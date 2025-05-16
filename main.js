import {
    fetchAudioData,
    fetchMusicData,
    fetchWallpaperData,
    fetchCursorData,
    fetchCharacterLoreData,
    fetchSpellsData,
    fetchSpellCategories,
    fetchPotionsData,
    fetchPotionDifficulties,
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
window.potionsData = [];
window.currentCharacterPage = 0;
window.currentSpellPage = 0;
window.currentPotionPage = 0;
window.charactersPerPage = 9;
window.spellsPerPage = 12;
window.potionsPerPage = 12;
window.characterSearchQuery = '';
window.spellSearchQuery = '';
window.potionSearchQuery = '';

function getHouseCrest(house) {
    switch (house) {
        case 'Gryffindor':
            return './assets/crests/Gryffindor.png';
        case 'Hufflepuff':
            return './assets/crests/Hufflepuff.png';
        case 'Ravenclaw':
            return './assets/crests/Ravenclaw.png';
        case 'Slytherin':
            return './assets/crests/Slytherin.png';
        default:
            return './assets/crests/Hogwarts.png';
    }
}

function isNonEmpty(value) {
    return value !== null && value !== '' && value !== undefined &&
        (Array.isArray(value) ? value.length > 0 : typeof value !== 'object' || Object.keys(value).length > 0);
}

function filterCharacters(filterValue, searchQuery) {
    let filtered = window.characterLoreData;

    if (filterValue !== 'all') {
        filtered = filtered.filter(character => character.attributes.house === filterValue);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(character =>
            character.attributes.name.toLowerCase().includes(query) ||
            (character.attributes.alias_names || []).some(alias => alias.toLowerCase().includes(query))
        );
    }

    return filtered;
}

function filterSpells(category, searchQuery) {
    let filtered = window.spellsData;

    if (category !== 'all') {
        filtered = filtered.filter(spell => spell.attributes.category === category);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(spell =>
            spell.attributes.name.toLowerCase().includes(query)
        );
    }

    return filtered;
}

function filterPotions(difficulty, searchQuery) {
    let filtered = window.potionsData;

    if (difficulty !== 'all') {
        filtered = filtered.filter(potion => potion.attributes.difficulty === difficulty);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(potion =>
            potion.attributes.name.toLowerCase().includes(query)
        );
    }

    return filtered;
}

function renderCharacterLoreList(page, filterValue, searchQuery) {
    const characterLoreList = document.getElementById('characterLoreList');
    const characterDetails = document.getElementById('characterDetails');
    characterLoreList.innerHTML = '';
    characterDetails.classList.add('hidden');
    const filteredCharacters = filterCharacters(filterValue, searchQuery);
    const start = page * window.charactersPerPage;
    const end = start + window.charactersPerPage;
    const paginatedCharacters = filteredCharacters.slice(start, end);

    paginatedCharacters.forEach((character) => {
        const card = document.createElement('div');
        card.className = 'character-card cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-all p-2 rounded-lg';
        card.dataset.character = character.attributes.name;
        const content = document.createElement('div');
        content.className = 'flex flex-col items-center';
        const imageSrc = character.attributes.image || getHouseCrest(character.attributes.house);
        content.innerHTML = `
      <img src="${imageSrc}" alt="${character.attributes.name} crest" class="w-12 h-12 object-contain rounded-full mb-1" />
      <span class="text-center text-xs font-harry-potter text-yellow-200">${character.attributes.name}</span>
    `;
        card.appendChild(content);
        card.addEventListener('click', () => {
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            characterDetails.classList.remove('hidden');
            const wandsInfo = character.attributes.wands && character.attributes.wands.length > 0
                ? character.attributes.wands.map(wand =>
                    `${wand.wood || 'Unknown'} wood, ${wand.core || 'Unknown'} core${wand.length ? `, ${wand.length} inches` : ''}`
                ).join('; ')
                : 'Unknown';
            const details = [];
            if (isNonEmpty(character.attributes.name))
                details.push(`<p class="mb-2"><span class="font-bold">Name:</span> ${character.attributes.name}</p>`);
            if (isNonEmpty(character.attributes.alias_names))
                details.push(`<p class="mb-2"><span class="font-bold">Alternate Names:</span> ${character.attributes.alias_names.join(', ')}</p>`);
            if (isNonEmpty(character.attributes.house))
                details.push(`<p class="mb-2"><span class="font-bold">House:</span> ${character.attributes.house}</p>`);
            if (isNonEmpty(character.attributes.species))
                details.push(`<p class="mb-2"><span class="font-bold">Species:</span> ${character.attributes.species}</p>`);
            if (isNonEmpty(character.attributes.patronus))
                details.push(`<p class="mb-2"><span class="font-bold">Patronus:</span> ${character.attributes.patronus}</p>`);
            if (isNonEmpty(wandsInfo) && wandsInfo !== 'Unknown')
                details.push(`<p class="mb-2"><span class="font-bold">Wands:</span> ${wandsInfo}</p>`);
            if (isNonEmpty(character.attributes.born))
                details.push(`<p class="mb-2"><span class="font-bold">Born:</span> ${character.attributes.born}</p>`);
            if (isNonEmpty(character.attributes.romances))
                details.push(`<p class="mb-2"><span class="font-bold">Romances:</span> ${character.attributes.romances.join(', ')}</p>`);
            if (isNonEmpty(character.attributes.titles))
                details.push(`<p class="mb-2"><span class="font-bold">Titles:</span> ${character.attributes.titles.join(', ')}</p>`);
            if (isNonEmpty(character.attributes.jobs))
                details.push(`<p class="mb-2"><span class="font-bold">Jobs:</span> ${character.attributes.jobs.join(', ')}</p>`);
            if (isNonEmpty(character.attributes.family_members))
                details.push(`<p class="mb-2"><span class="font-bold">Family Members:</span> ${character.attributes.family_members.join(', ')}</p>`);
            characterDetails.innerHTML = `
        <div class="flex flex-col items-center p-4">
          <img src="${imageSrc}" alt="${character.attributes.name} crest" class="w-24 h-24 object-contain rounded-lg mb-4" />
          ${details.join('')}
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

function renderSpellList(page, category, searchQuery) {
    const spellList = document.getElementById('spellList');
    const spellDetails = document.getElementById('spellDetails');
    spellList.innerHTML = '';
    spellDetails.classList.add('hidden');
    const filteredSpells = filterSpells(category, searchQuery);
    const start = page * window.spellsPerPage;
    const end = start + window.spellsPerPage;
    const paginatedSpells = filteredSpells.slice(start, end);

    paginatedSpells.forEach((spell) => {
        const card = document.createElement('div');
        card.className = 'character-card cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-all p-2 rounded-lg';
        card.dataset.spell = spell.attributes.name;
        const content = document.createElement('div');
        content.className = 'flex flex-col items-center';
        content.innerHTML = `
      <span class="text-center text-xs font-harry-potter text-yellow-200">${spell.attributes.name}</span>
    `;
        card.appendChild(content);
        card.addEventListener('click', () => {
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            spellDetails.classList.remove('hidden');
            const imageHtml = spell.attributes.image ? `<img src="${spell.attributes.image}" alt="${spell.attributes.name}" class="w-64 h-64 object-contain rounded-lg mb-4" />` : '';
            spellDetails.innerHTML = `
        <div class="flex flex-col items-center p-4">
          ${imageHtml}
          <p class="mb-2"><span class="font-bold">Spell:</span> ${spell.attributes.name}</p>
          <p class="mb-2"><span class="font-bold">Category:</span> ${spell.attributes.category || 'Unknown'}</p>
          <p class="mb-2"><span class="font-bold">Effect:</span> ${spell.attributes.effect || 'No effect available'}</p>
          <p class="mb-2"><span class="font-bold">Creator:</span> ${spell.attributes.creator || 'Unknown'}</p>
          <p class="mb-2"><span class="font-bold">Light:</span> ${spell.attributes.light || 'Unknown'}</p>
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

function renderPotionList(page, difficulty, searchQuery) {
    const potionList = document.getElementById('potionList');
    const potionDetails = document.getElementById('potionDetails');
    potionList.innerHTML = '';
    potionDetails.classList.add('hidden');
    const filteredPotions = filterPotions(difficulty, searchQuery);
    const start = page * window.potionsPerPage;
    const end = start + window.potionsPerPage;
    const paginatedPotions = filteredPotions.slice(start, end);

    paginatedPotions.forEach((potion) => {
        const card = document.createElement('div');
        card.className = 'character-card cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-all p-2 rounded-lg';
        card.dataset.potion = potion.attributes.name;
        const content = document.createElement('div');
        content.className = 'flex flex-col items-center';
        content.innerHTML = `
      <span class="text-center text-xs font-harry-potter text-yellow-200">${potion.attributes.name}</span>
    `;
        card.appendChild(content);
        card.addEventListener('click', () => {
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            potionDetails.classList.remove('hidden');
            const imageHtml = potion.attributes.image ? `<img src="${potion.attributes.image}" alt="${potion.attributes.name}" class="w-64 h-64 object-contain rounded-lg mb-4" />` : '';
            const details = [];
            if (isNonEmpty(potion.attributes.name))
                details.push(`<p class="mb-2"><span class="font-bold">Potion:</span> ${potion.attributes.name}</p>`);
            if (isNonEmpty(potion.attributes.characteristics))
                details.push(`<p class="mb-2"><span class="font-bold">Characteristics:</span> ${potion.attributes.characteristics}</p>`);
            if (isNonEmpty(potion.attributes.difficulty))
                details.push(`<p class="mb-2"><span class="font-bold">Difficulty:</span> ${potion.attributes.difficulty}</p>`);
            if (isNonEmpty(potion.attributes.effect))
                details.push(`<p class="mb-2"><span class="font-bold">Effect:</span> ${potion.attributes.effect}</p>`);
            if (isNonEmpty(potion.attributes.inventors))
                details.push(`<p class="mb-2"><span class="font-bold">Inventors:</span> ${potion.attributes.inventors}</p>`);
            if (isNonEmpty(potion.attributes.ingredients))
                details.push(`<p class="mb-2"><span class="font-bold">Ingredients:</span> ${potion.attributes.ingredients}</p>`);
            if (isNonEmpty(potion.attributes.manufacturers))
                details.push(`<p class="mb-2"><span class="font-bold">Manufacturers:</span> ${potion.attributes.manufacturers}</p>`);
            if (isNonEmpty(potion.attributes.side_effects))
                details.push(`<p class="mb-2"><span class="font-bold">Side Effects:</span> ${potion.attributes.side_effects}</p>`);
            if (isNonEmpty(potion.attributes.time))
                details.push(`<p class="mb-2"><span class="font-bold">Time:</span> ${potion.attributes.time}</p>`);
            potionDetails.innerHTML = `
        <div class="flex flex-col items-center p-4">
          ${imageHtml}
          ${details.join('')}
        </div>
      `;
        });
        potionList.appendChild(card);
    });

    const prevPotionPage = document.getElementById('prevPotionPage');
    const nextPotionPage = document.getElementById('nextPotionPage');
    prevPotionPage.disabled = page === 0;
    nextPotionPage.disabled = end >= filteredPotions.length;
}

async function initialize() {
    const [audioData, { musicData, trackList }, wallpaperData, cursorData, characterLoreData, spellsData, spellCategories, potionsData, potionDifficulties] = await Promise.all([
        fetchAudioData(),
        fetchMusicData(),
        fetchWallpaperData(window.screenWidth),
        fetchCursorData(),
        fetchCharacterLoreData(),
        fetchSpellsData(),
        fetchSpellCategories(),
        fetchPotionsData(),
        fetchPotionDifficulties(),
    ]);

    window.jsonData = audioData;
    window.musicData = musicData;
    window.trackList = trackList;
    window.wallpaperData = wallpaperData;
    window.cursorData = cursorData;
    window.characterLoreData = characterLoreData;
    window.spellsData = spellsData;
    window.potionsData = potionsData;

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
    const potionFilter = document.getElementById('potionFilter');
    const characterSearch = document.getElementById('characterSearch');
    const spellSearch = document.getElementById('spellSearch');
    const potionSearch = document.getElementById('potionSearch');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const prevSpellPage = document.getElementById('prevSpellPage');
    const nextSpellPage = document.getElementById('nextSpellPage');
    const prevPotionPage = document.getElementById('prevPotionPage');
    const nextPotionPage = document.getElementById('nextPotionPage');
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
                    renderCharacterLoreList(window.currentCharacterPage, loreFilter.value, window.characterSearchQuery);
                    renderSpellList(window.currentSpellPage, spellFilter.value, window.spellSearchQuery);
                    renderPotionList(window.currentPotionPage, potionFilter.value, window.potionSearchQuery);
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

    spellCategories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        spellFilter.appendChild(option);
    });

    potionDifficulties.forEach((difficulty) => {
        const option = document.createElement('option');
        option.value = difficulty;
        option.text = difficulty;
        potionFilter.appendChild(option);
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
        card.className = 'character-card cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-all p-2 rounded-lg';
        card.dataset.character = key;
        const content = document.createElement('div');
        content.className = 'flex flex-col items-center';
        content.innerHTML = `
      <span class="text-center text-xs font-harry-potter text-yellow-200">${key}</span>
    `;
        card.appendChild(content);
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
        characterList.appendChild(card);
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
        renderCharacterLoreList(window.currentCharacterPage, loreFilter.value, window.characterSearchQuery);
    });

    spellFilter.addEventListener('change', () => {
        window.currentSpellPage = 0;
        renderSpellList(window.currentSpellPage, spellFilter.value, window.spellSearchQuery);
    });

    potionFilter.addEventListener('change', () => {
        window.currentPotionPage = 0;
        renderPotionList(window.currentPotionPage, potionFilter.value, window.potionSearchQuery);
    });

    characterSearch.addEventListener('input', () => {
        window.characterSearchQuery = characterSearch.value.trim();
        window.currentCharacterPage = 0;
        renderCharacterLoreList(window.currentCharacterPage, loreFilter.value, window.characterSearchQuery);
    });

    spellSearch.addEventListener('input', () => {
        window.spellSearchQuery = spellSearch.value.trim();
        window.currentSpellPage = 0;
        renderSpellList(window.currentSpellPage, spellFilter.value, window.spellSearchQuery);
    });

    potionSearch.addEventListener('input', () => {
        window.potionSearchQuery = potionSearch.value.trim();
        window.currentPotionPage = 0;
        renderPotionList(window.currentPotionPage, potionFilter.value, window.potionSearchQuery);
    });

    prevPage.addEventListener('click', () => {
        if (window.currentCharacterPage > 0) {
            window.currentCharacterPage--;
            renderCharacterLoreList(window.currentCharacterPage, loreFilter.value, window.characterSearchQuery);
        }
    });

    nextPage.addEventListener('click', () => {
        const filteredCharacters = filterCharacters(loreFilter.value, window.characterSearchQuery);
        if ((window.currentCharacterPage + 1) * window.charactersPerPage < filteredCharacters.length) {
            window.currentCharacterPage++;
            renderCharacterLoreList(window.currentCharacterPage, loreFilter.value, window.characterSearchQuery);
        }
    });

    prevSpellPage.addEventListener('click', () => {
        if (window.currentSpellPage > 0) {
            window.currentSpellPage--;
            renderSpellList(window.currentSpellPage, spellFilter.value, window.spellSearchQuery);
        }
    });

    nextSpellPage.addEventListener('click', () => {
        const filteredSpells = filterSpells(spellFilter.value, window.spellSearchQuery);
        if ((window.currentSpellPage + 1) * window.spellsPerPage < filteredSpells.length) {
            window.currentSpellPage++;
            renderSpellList(window.currentSpellPage, spellFilter.value, window.spellSearchQuery);
        }
    });

    prevPotionPage.addEventListener('click', () => {
        if (window.currentPotionPage > 0) {
            window.currentPotionPage--;
            renderPotionList(window.currentPotionPage, potionFilter.value, window.potionSearchQuery);
        }
    });

    nextPotionPage.addEventListener('click', () => {
        const filteredPotions = filterPotions(potionFilter.value, window.potionSearchQuery);
        if ((window.currentPotionPage + 1) * window.potionsPerPage < filteredPotions.length) {
            window.currentPotionPage++;
            renderPotionList(window.currentPotionPage, potionFilter.value, window.potionSearchQuery);
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
        window.shuffleMode = !window.shuffleMode;
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

    backgroundSelect.addEventListener('click', () => {
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
    renderCharacterLoreList(window.currentCharacterPage, 'all', '');
    renderSpellList(window.currentSpellPage, 'all', '');
    renderPotionList(window.currentPotionPage, 'all', '');
}

initialize();