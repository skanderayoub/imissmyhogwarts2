import {
  fetchAudioData,
  fetchMusicData,
  fetchWallpaperData,
  fetchCursorData,
  fetchCharacterLoreData,
  fetchSpellsData,
} from './data.js';
import {
  getNextTrack,
  getPreviousTrack,
  playSound,
  playNewSound,
  playMusicTrack,
} from './audio.js';
import { setupMouseEffects, updateCursorStyle } from './ui.js';

window.jsonData = null;
window.musicData = null;
window.wallpaperData = null;
window.cursorData = null;
window.firstClick = true;
window.firstClickMusic = true;
window.screenWidth = window.innerWidth;
window.currentTrackIndex = 0;
window.shuffleMode = false;
window.trackList = [];
window.characterLoreData = [];
window.spellsData = [];
window.currentCharacterPage = 0;
window.currentSpellPage = 0;
window.charactersPerPage = 12;
window.spellsPerPage = 12;

function filterCharacters(filterValue) {
  if (filterValue === 'all') {
    return window.characterLoreData;
  } else if (filterValue === 'student') {
    return window.characterLoreData.filter(character => character.hogwartsStudent);
  } else if (filterValue === 'staff') {
    return window.characterLoreData.filter(character => character.hogwartsStaff);
  } else {
    return window.characterLoreData.filter(character => character.house === filterValue);
  }
}

function filterSpells(filterValue) {
  if (filterValue === 'all') {
    return window.spellsData;
  } else {
    return window.spellsData.filter(spell => spell.type === filterValue);
  }
}

function renderCharacterLoreList(page, filterValue) {
  const characterLoreList = document.getElementById('characterLoreList');
  const characterDetails = document.getElementById('characterDetails');
  characterLoreList.innerHTML = '';
  characterDetails.classList.add('hidden');
  const filteredCharacters = filterCharacters(filterValue);
  const start = page * window.charactersPerPage;
  const end = start + window.charactersPerPage;
  const paginatedCharacters = filteredCharacters.slice(start, end);

  paginatedCharacters.forEach((character) => {
    const card = document.createElement('div');
    card.className = 'character-card cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-all';
    card.dataset.character = character.name;
    const span = document.createElement('span');
    span.textContent = character.name;
    card.appendChild(span);
    card.addEventListener('click', () => {
      document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      characterDetails.classList.remove('hidden');
      const wandInfo = character.wand && (character.wand.wood || character.wand.core || character.wand.length)
        ? `${character.wand.wood || 'Unknown'} wood, ${character.wand.core || 'Unknown'} core${character.wand.length ? `, ${character.wand.length} inches` : ''}`
        : 'Unknown';
      characterDetails.innerHTML = `
        <div class="flex flex-col items-center">
          ${character.image ? `<img src="${character.image}" alt="${character.name}" class="w-32 h-32 object-cover rounded-lg mb-4" />` : ''}
          <p><span class="font-bold">Name:</span> ${character.name}</p>
          <p><span class="font-bold">Alternate Names:</span> ${character.alternate_names.length > 0 ? character.alternate_names.join(', ') : 'None'}</p>
          <p><span class="font-bold">House:</span> ${character.house || 'Unknown'}</p>
          <p><span class="font-bold">Species:</span> ${character.species || 'Unknown'}</p>
          <p><span class="font-bold">Role:</span> ${character.hogwartsStudent ? 'Student' : character.hogwartsStaff ? 'Staff' : 'Other'}</p>
          <p><span class="font-bold">Ancestry:</span> ${character.ancestry || 'Unknown'}</p>
          <p><span class="font-bold">Patronus:</span> ${character.patronus || 'Unknown'}</p>
          <p><span class="font-bold">Wand:</span> ${wandInfo}</p>
          <p><span class="font-bold">Date of Birth:</span> ${character.dateOfBirth || 'Unknown'}</p>
        </div>
      `;
    });
    characterLoreList.appendChild(card);
  });

  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  prevPage.disabled = page === 0;
  nextPage.disabled = end >= filteredCharacters.length;
}

function renderSpellList(page, filterValue) {
  const spellList = document.getElementById('spellList');
  const spellDetails = document.getElementById('spellDetails');
  spellList.innerHTML = '';
  spellDetails.classList.add('hidden');
  const filteredSpells = filterSpells(filterValue);
  const start = page * window.spellsPerPage;
  const end = start + window.spellsPerPage;
  const paginatedSpells = filteredSpells.slice(start, end);

  paginatedSpells.forEach((spell) => {
    const card = document.createElement('div');
    card.className = 'character-card cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-all';
    card.dataset.spell = spell.name;
    const span = document.createElement('span');
    span.textContent = spell.name;
    card.appendChild(span);
    card.addEventListener('click', () => {
      document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      spellDetails.classList.remove('hidden');
      spellDetails.innerHTML = `
        <div class="flex flex-col items-center">
          <p><span class="font-bold">Spell:</span> ${spell.name}</p>
          <p><span class="font-bold">Type:</span> ${spell.type || 'Unknown'}</p>
          <p><span class="font-bold">Description:</span> ${spell.description || 'No description available'}</p>
        </div>
      `;
    });
    spellList.appendChild(card);
  });

  const prevSpellPage = document.getElementById('prevSpellPage');
  const nextSpellPage = document.getElementById('nextSpellPage');
  prevSpellPage.disabled = page === 0;
  nextSpellPage.disabled = end >= filteredSpells.length;
}

async function initialize() {
  const [audioData, { musicData, trackList }, wallpaperData, cursorData, characterLoreData, spellsData] = await Promise.all([
    fetchAudioData(),
    fetchMusicData(),
    fetchWallpaperData(window.screenWidth),
    fetchCursorData(),
    fetchCharacterLoreData(),
    fetchSpellsData(),
  ]);

  window.jsonData = audioData;
  window.musicData = musicData;
  window.trackList = trackList;
  window.wallpaperData = wallpaperData;
  window.cursorData = cursorData;
  window.characterLoreData = characterLoreData;
  window.spellsData = spellsData;

  if (!window.wallpaperData || !window.jsonData || !window.musicData || !window.cursorData) {
    console.error("Failed to load required data:", {
      wallpaperData: window.wallpaperData,
      jsonData: window.jsonData,
      musicData: window.musicData,
      cursorData: window.cursorData,
    });
    return;
  }

  const playButton = document.getElementById('playButton');
  const audioSound = document.getElementById('audio');
  const voiceVolume = document.getElementById('voiceVolume');
  const voiceMute = document.getElementById('voiceMute');
  const playMusicButton = document.getElementById('playButton2');
  const prevMusicButton = document.getElementById('prevMusic');
  const nextMusicButton = document.getElementById('nextMusic');
  const shuffleMusicButton = document.getElementById('shuffleMusic');
  const musicSelect = document.getElementById('musicSelect');
  const audioMusic = document.getElementById('audio2');
  const musicVolume = document.getElementById('musicVolume');
  const musicProgress = document.getElementById('musicProgress');
  const backgroundSelect = document.getElementById('backgroundSelect');
  const characterList = document.getElementById('characterList');
  const themeSelect = document.getElementById('themeSelect');
  const cursorSelect = document.getElementById('cursorSelect');
  const loreFilter = document.getElementById('loreFilter');
  const spellFilter = document.getElementById('spellFilter');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  const prevSpellPage = document.getElementById('prevSpellPage');
  const nextSpellPage = document.getElementById('nextSpellPage');
  let selectedCharacters = [];
  let newData = window.jsonData;

  if (window.screenWidth < 600) {
    cursorSelect.style.display = 'none';
  }

  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(`Tab button clicked: ${button.dataset.tab}`);
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      document
        .querySelectorAll('.tab-content')
        .forEach((content) => content.classList.add('hidden'));
      const targetTab = document.getElementById(button.dataset.tab);
      if (targetTab) {
        targetTab.classList.remove('hidden');
        console.log(`Switched to tab: ${button.dataset.tab}`);
        if (button.dataset.tab === 'lore-games') {
          renderCharacterLoreList(window.currentCharacterPage, loreFilter.value);
          renderSpellList(window.currentSpellPage, spellFilter.value);
        }
      } else {
        console.error(`Tab content not found for: ${button.dataset.tab}`);
      }
    });
  });

  window.cursorData.forEach((cursor) => {
    const option = document.createElement('option');
    option.value = cursor;
    option.text = cursor.charAt(0).toUpperCase() + cursor.slice(1);
    cursorSelect.appendChild(option);
  });

  const bgImg = new Image();
  bgImg.src =
    window.screenWidth < 600
      ? 'assets/phone/dark.png'
      : 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
  bgImg.onload = () => {
    document.body.style.display = 'block';
  };

  window.wallpaperData.forEach((wallpaper, index) => {
    const option = document.createElement('option');
    option.text = wallpaper
      .substring(wallpaper.lastIndexOf('/') + 1)
      .replace(/\.(png|jpg)/, '');
    option.value = index;
    backgroundSelect.add(option);
  });

  Object.keys(window.jsonData).forEach((key) => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.dataset.character = key;
    const span = document.createElement('span');
    span.textContent = key;
    card.appendChild(span);
    characterList.appendChild(card);

    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      selectedCharacters = Array.from(
        characterList.querySelectorAll('.character-card.selected')
      ).map((card) => card.dataset.character);
      newData = Object.fromEntries(
        Object.entries(window.jsonData).filter(([key]) =>
          selectedCharacters.includes(key)
        )
      );
    });
  });

  Object.entries(window.musicData).forEach(([album, tracks]) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = album;
    const sortedTracks = tracks
      .map((url) => {
        const regex = /\/(\d+)\.\s*([^\/]+)\.mp3$/;
        const match = url.match(regex);
        const trackNumber = match ? parseInt(match[1]) : Infinity;
        const trackName = match
          ? decodeURIComponent(match[2])
          : url.split('/').pop();
        return { url, trackNumber, trackName };
      })
      .sort((a, b) => a.trackNumber - b.trackNumber);
    sortedTracks.forEach(({ url, trackName }) => {
      const option = document.createElement('option');
      option.text = trackName;
      option.value = window.trackList.findIndex((t) => t.url === url);
      optgroup.appendChild(option);
    });
    musicSelect.appendChild(optgroup);
  });

  loreFilter.addEventListener('change', () => {
    window.currentCharacterPage = 0;
    renderCharacterLoreList(window.currentCharacterPage, loreFilter.value);
  });

  spellFilter.addEventListener('change', () => {
    window.currentSpellPage = 0;
    renderSpellList(window.currentSpellPage, spellFilter.value);
  });

  prevPage.addEventListener('click', () => {
    if (window.currentCharacterPage > 0) {
      window.currentCharacterPage--;
      renderCharacterLoreList(window.currentCharacterPage, loreFilter.value);
    }
  });

  nextPage.addEventListener('click', () => {
    const filteredCharacters = filterCharacters(loreFilter.value);
    if ((window.currentCharacterPage + 1) * window.charactersPerPage < filteredCharacters.length) {
      window.currentCharacterPage++;
      renderCharacterLoreList(window.currentCharacterPage, loreFilter.value);
    }
  });

  prevSpellPage.addEventListener('click', () => {
    if (window.currentSpellPage > 0) {
      window.currentSpellPage--;
      renderSpellList(window.currentSpellPage, spellFilter.value);
    }
  });

  nextSpellPage.addEventListener('click', () => {
    const filteredSpells = filterSpells(spellFilter.value);
    if ((window.currentSpellPage + 1) * window.spellsPerPage < filteredSpells.length) {
      window.currentSpellPage++;
      renderSpellList(window.currentSpellPage, spellFilter.value);
    }
  });

  cursorSelect.addEventListener('change', () => {
    console.log(`Cursor selected: ${cursorSelect.value}`);
    updateCursorStyle(cursorSelect.value);
  });

  musicSelect.addEventListener('change', () => {
    const index = parseInt(musicSelect.value);
    if (!isNaN(index)) {
      playMusicTrack(index, audioMusic, playMusicButton, window.trackList, (i) => (window.currentTrackIndex = i));
      window.firstClickMusic = false;
      nextMusicButton.style.display = 'inline-block';
      prevMusicButton.style.display = 'inline-block';
      shuffleMusicButton.style.display = 'inline-block';
    }
  });

  voiceVolume.addEventListener('input', () => {
    audioSound.volume = voiceVolume.value;
    if (audioSound.volume > 0) {
      audioSound.muted = false;
      voiceMute.className =
        'audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
      voiceVolume.classList.remove('muted');
    }
  });

  voiceMute.addEventListener('click', () => {
    audioSound.muted = !audioSound.muted;
    voiceMute.className = audioSound.muted
      ? 'audio unmute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all'
      : 'audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
    voiceVolume.classList.toggle('muted', audioSound.muted);
    if (audioSound.muted) audioSound.volume = 0;
    else audioSound.volume = voiceVolume.value || 1;
  });

  musicVolume.addEventListener('input', () => {
    audioMusic.volume = musicVolume.value;
    if (audioMusic.volume > 0) {
      audioMusic.muted = false;
      musicMute.className =
        'audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
      musicVolume.classList.remove('muted');
    }
  });

  musicMute.addEventListener('click', () => {
    audioMusic.muted = !audioMusic.muted;
    musicMute.className = audioMusic.muted
      ? 'audio unmute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all'
      : 'audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
    musicVolume.classList.toggle('muted', audioMusic.muted);
    if (audioMusic.muted) audioMusic.volume = 0;
    else audioMusic.volume = musicVolume.value || 1;
  });

  audioMusic.addEventListener('timeupdate', () => {
    if (audioMusic.duration) {
      const progress = (audioMusic.currentTime / audioMusic.duration) * 100;
      musicProgress.style.width = `${progress}%`;
    }
  });

  playMusicButton.addEventListener('click', () => {
    if (!audioMusic.src) {
      const { index, track } = getNextTrack(window.currentTrackIndex, window.trackList, window.shuffleMode);
      playMusicTrack(index, audioMusic, playMusicButton, window.trackList, (i) => (window.currentTrackIndex = i));
      musicSelect.value = index;
    } else if (!audioMusic.paused) {
      audioMusic.pause();
      playMusicButton.className =
        'audio paused w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
    } else {
      audioMusic.play();
      playMusicButton.className =
        'audio playing w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
    }
    window.firstClickMusic = false;
    nextMusicButton.style.display = 'inline-block';
    prevMusicButton.style.display = 'inline-block';
    shuffleMusicButton.style.display = 'inline-block';
  });

  prevMusicButton.addEventListener('click', () => {
    const { index, track } = getPreviousTrack(window.currentTrackIndex, window.trackList, window.shuffleMode);
    playMusicTrack(index, audioMusic, playMusicButton, window.trackList, (i) => (window.currentTrackIndex = i));
    musicSelect.value = index;
  });

  nextMusicButton.addEventListener('click', () => {
    const { index, track } = getNextTrack(window.currentTrackIndex, window.trackList, window.shuffleMode);
    playMusicTrack(index, audioMusic, playMusicButton, window.trackList, (i) => (window.currentTrackIndex = i));
    musicSelect.value = index;
  });

  shuffleMusicButton.addEventListener('click', () => {
    window.shuffleMode = !window.shufflePrzyMode;
    shuffleMusicButton.className = window.shuffleMode
      ? 'audio shuffle shuffle-active w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all'
      : 'audio shuffle w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
  });

  audioMusic.addEventListener('ended', () => {
    const { index, track } = getNextTrack(window.currentTrackIndex, window.trackList, window.shuffleMode);
    playMusicTrack(index, audioMusic, playMusicButton, window.trackList, (i) => (window.currentTrackIndex = i));
    musicSelect.value = index;
  });

  playButton.addEventListener('click', () => {
    playSound(newData, audioSound, playButton, window.firstClick, 'sound');
    if (window.firstClick) window.firstClick = false;
  });

  audioSound.addEventListener('ended', () => {
    playNewSound(newData, audioSound, 'sound');
  });

  backgroundSelect.addEventListener('change', () => {
    const selectedValue = backgroundSelect.value;
    if (selectedValue) {
      document.body.style.backgroundImage = `url('${window.wallpaperData[selectedValue]}')`;
    }
  });

  themeSelect.addEventListener('change', () => {
    document.body.className = `min-h-screen bg-cover bg-center bg-fixed text-yellow-200 font-cinzel theme-${themeSelect.value}`;
    localStorage.setItem('hogwartsTheme', themeSelect.value);
  });

  const savedTheme = localStorage.getItem('hogwartsTheme');
  if (savedTheme) {
    themeSelect.value = savedTheme;
    document.body.className = `min-h-screen bg-cover bg-center bg-fixed text-yellow-200 font-cinzel theme-${savedTheme}`;
  }

  setupMouseEffects();
  updateCursorStyle(cursorSelect.value);
  renderCharacterLoreList(window.currentCharacterPage, 'all');
  renderSpellList(window.currentSpellPage, 'all');
}

initialize();