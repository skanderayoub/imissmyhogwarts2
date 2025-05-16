let jsonData;
let musicData;
let wallpaperData;
let cursorData;
let firstClick = true;
let firstClickMusic = true;
let screenWidth = window.innerWidth;
let currentTrackIndex = 0;
let shuffleMode = false;
let trackList = [];

async function fetchAudioData() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/links.json"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        jsonData = await response.json();
    } catch (error) {
        console.error("Error fetching audio data:", error);
    }
}

async function fetchMusicData() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/music.json"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        musicData = await response.json();
        const tempTrackList = [];
        Object.entries(musicData).forEach(([album, tracks]) => {
            tracks.forEach(url => {
                const regex = /\/(\d+)\.\s*([^\/]+)\.mp3$/;
                const match = url.match(regex);
                const trackNumber = match ? parseInt(match[1]) : Infinity;
                const trackName = match ? decodeURIComponent(match[2]) : url.split('/').pop();
                tempTrackList.push({ album, url, trackNumber, trackName });
            });
        });
        tempTrackList.sort((a, b) => {
            if (a.album < b.album) return -1;
            if (a.album > b.album) return 1;
            return a.trackNumber - b.trackNumber;
        });
        trackList = tempTrackList.map(({ album, url }) => ({ album, url }));
    } catch (error) {
        console.error("Error fetching music data:", error);
    }
}

async function fetchWallpaperData() {
    try {
        const url = screenWidth < 600
            ? "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/wallpapers_phone.json"
            : "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/wallpapers.json";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        wallpaperData = await response.json();
    } catch (error) {
        console.error("Error fetching wallpaper data:", error);
    }
}

async function fetchCursorData() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/cursors.json"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        cursorData = await response.json();
    } catch (error) {
        console.error("Error fetching cursor data:", error);
        cursorData = ["dumbledore"];
    }
}

function getRandomTrack() {
    const randomIndex = Math.floor(Math.random() * trackList.length);
    return { index: randomIndex, track: trackList[randomIndex] };
}

function getNextTrack() {
    if (shuffleMode) {
        return getRandomTrack();
    }
    const nextIndex = (currentTrackIndex + 1) % trackList.length;
    return { index: nextIndex, track: trackList[nextIndex] };
}

function getPreviousTrack() {
    if (shuffleMode) {
        return getRandomTrack();
    }
    const prevIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    return { index: prevIndex, track: trackList[prevIndex] };
}

function playSound(data, audio, btn, click, type) {
    if (!data || Object.keys(data).length === 0) {
        alert("Please select at least one character!");
        return;
    }
    if (click) {
        const keys = Object.keys(data);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const valueList = data[randomKey];
        const randomValue = valueList[Math.floor(Math.random() * valueList.length)];
        setKeyAndAudio(randomKey, randomValue, type);
        audio.src = randomValue;
    }
    if (!audio.paused) {
        audio.pause();
        btn.className = "audio paused w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
    } else {
        audio.play();
        btn.className = "audio playing w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
    }
}

function playNewSound(data, audio, type) {
    if (!data || Object.keys(data).length === 0) return;
    const keys = Object.keys(data);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const valueList = data[randomKey];
    const randomValue = valueList[Math.floor(Math.random() * valueList.length)];
    setKeyAndAudio(randomKey, randomValue, type);
    audio.src = randomValue;
    audio.play();
}

function playMusicTrack(index, audio, btn) {
    currentTrackIndex = index;
    const track = trackList[index];
    setKeyAndAudio(track.album, track.url, "music");
    audio.src = track.url;
    audio.play();
    btn.className = "audio playing w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
}

function setKeyAndAudio(key, value, type) {
    if (type === "sound") {
        setCharacterAndAudio(key, value);
    } else if (type === "music") {
        setAlbumAndAudio(key, value);
    }
}

function setCharacterAndAudio(key, value) {
    const character = document.getElementById("p");
    const audioText = document.getElementById("a");
    character.innerHTML = `<span class="font-bold">Personnage:</span> ${key}`;
    const regex = /\/([^\/]+)\.wav$/;
    const match = value.match(regex);
    if (match && match[1]) {
        const cleanName = decodeURIComponent(match[1]).split('/').pop();
        audioText.innerHTML = `<span class="font-bold">Audio:</span> ${cleanName}`;
    }
}

function setAlbumAndAudio(album, url) {
    const albumText = document.getElementById("p2");
    const audioText = document.getElementById("a2");
    const trackNumber = currentTrackIndex + 1;
    const totalTracks = trackList.length;
    albumText.innerHTML = `<span class="font-bold">Musique:</span> ${album} (${trackNumber}/${totalTracks})`;
    const regex = /\/([^\/]+)\.mp3$/;
    const match = url.match(regex);
    if (match && match[1]) {
        audioText.innerHTML = `<span class="font-bold">Audio:</span> ${decodeURIComponent(match[1])}`;
    }
}

function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}

async function initialize() {
    await Promise.all([fetchWallpaperData(), fetchAudioData(), fetchMusicData(), fetchCursorData()]);
    if (!wallpaperData || !jsonData || !musicData || !cursorData) {
        console.error("Failed to load required data:", { wallpaperData, jsonData, musicData, cursorData });
        return;
    }

    const playButton = document.getElementById("playButton");
    const audioSound = document.getElementById("audio");
    const voiceVolume = document.getElementById("voiceVolume");
    const voiceMute = document.getElementById("voiceMute");
    const playMusicButton = document.getElementById("playButton2");
    const prevMusicButton = document.getElementById("prevMusic");
    const nextMusicButton = document.getElementById("nextMusic");
    const shuffleMusicButton = document.getElementById("shuffleMusic");
    const musicSelect = document.getElementById("musicSelect");
    const audioMusic = document.getElementById("audio2");
    const musicVolume = document.getElementById("musicVolume");
    const musicProgress = document.getElementById("musicProgress");
    const backgroundSelect = document.getElementById("backgroundSelect");
    const characterList = document.getElementById("characterList");
    const themeSelect = document.getElementById("themeSelect");
    const cursorSelect = document.getElementById("cursorSelect");
    let selectedCharacters = [];
    let newData = jsonData;

    // Set up tab navigation first
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Tab button clicked: ${button.dataset.tab}`);
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            const targetTab = document.getElementById(button.dataset.tab);
            if (targetTab) {
                targetTab.classList.remove('hidden');
                console.log(`Switched to tab: ${button.dataset.tab}`);
            } else {
                console.error(`Tab content not found for: ${button.dataset.tab}`);
            }
        });
    });

    cursorData.forEach(cursor => {
        const option = document.createElement("option");
        option.value = cursor;
        option.text = cursor.charAt(0).toUpperCase() + cursor.slice(1);
        cursorSelect.appendChild(option);
    });

    const bgImg = new Image();
    bgImg.src = screenWidth < 600 ? "assets/phone/dark.png" : "https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
    bgImg.onload = () => {
        document.body.style.display = "block";
    };

    wallpaperData.forEach((wallpaper, index) => {
        const option = document.createElement("option");
        option.text = wallpaper.substring(wallpaper.lastIndexOf('/') + 1).replace(/\.(png|jpg)/, "");
        option.value = index;
        backgroundSelect.add(option);
    });

    Object.keys(jsonData).forEach((key) => {
        const card = document.createElement("div");
        card.className = "character-card";
        card.dataset.character = key;
        const span = document.createElement("span");
        span.textContent = key;
        card.appendChild(span);
        characterList.appendChild(card);

        card.addEventListener("click", () => {
            card.classList.toggle("selected");
            selectedCharacters = Array.from(characterList.querySelectorAll(".character-card.selected"))
                .map(card => card.dataset.character);
            newData = Object.fromEntries(
                Object.entries(jsonData).filter(([key]) => selectedCharacters.includes(key))
            );
        });
    });

    Object.entries(musicData).forEach(([album, tracks]) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = album;
        const sortedTracks = tracks.map(url => {
            const regex = /\/(\d+)\.\s*([^\/]+)\.mp3$/;
            const match = url.match(regex);
            const trackNumber = match ? parseInt(match[1]) : Infinity;
            const trackName = match ? decodeURIComponent(match[2]) : url.split('/').pop();
            return { url, trackNumber, trackName };
        }).sort((a, b) => a.trackNumber - b.trackNumber);
        sortedTracks.forEach(({ url, trackName }) => {
            const option = document.createElement("option");
            option.text = trackName;
            option.value = trackList.findIndex(t => t.url === url);
            optgroup.appendChild(option);
        });
        musicSelect.appendChild(optgroup);
    });

    async function updateCursorStyle(cursorValue) {
        const root = document.documentElement;
        const cursorUrl = `url('assets/cursors/${cursorValue}/cursor.cur')`;
        const pointerUrl = `url('assets/cursors/${cursorValue}/pointer.cur')`;
        try {
            // Preload cursor images to check if they exist
            const cursorImg = new Image();
            const pointerImg = new Image();
            cursorImg.src = `assets/cursors/${cursorValue}/cursor.cur`;
            pointerImg.src = `assets/cursors/${cursorValue}/pointer.cur`;
            await Promise.all([
                new Promise((resolve, reject) => {
                    cursorImg.onload = resolve;
                    cursorImg.onerror = () => reject(new Error(`Failed to load cursor: ${cursorUrl}`));
                }),
                new Promise((resolve, reject) => {
                    pointerImg.onload = resolve;
                    pointerImg.onerror = () => reject(new Error(`Failed to load pointer: ${pointerUrl}`));
                })
            ]);
            root.style.setProperty('--cursor-url', cursorUrl);
            root.style.setProperty('--pointer-url', pointerUrl);
            console.log(`Cursor updated to: ${cursorUrl}, Pointer: ${pointerUrl}`);
            // Force style refresh
            document.body.style.cursor = 'auto';
            setTimeout(() => document.body.style.cursor = cursorUrl + ' 0 0, auto', 0);
        } catch (error) {
            console.error(`Error updating cursor to ${cursorValue}:`, error);
            // Fallback to wand.png or default
            const fallbackUrl = `url('assets/wand.png')`;
            root.style.setProperty('--cursor-url', fallbackUrl);
            root.style.setProperty('--pointer-url', fallbackUrl);
            console.warn(`Fell back to: ${fallbackUrl}`);
            // Ultimate fallback to browser default if wand.png fails
            if (!(await new Promise(resolve => {
                const img = new Image();
                img.src = 'assets/wand.png';
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
            }))) {
                root.style.setProperty('--cursor-url', 'default');
                root.style.setProperty('--pointer-url', 'pointer');
                console.warn("Ultimate fallback to browser default cursors");
            }
        }
    }

    cursorSelect.addEventListener("change", () => {
        console.log(`Cursor selected: ${cursorSelect.value}`);
        updateCursorStyle(cursorSelect.value);
    });

    musicSelect.addEventListener("change", () => {
        const index = parseInt(musicSelect.value);
        if (!isNaN(index)) {
            playMusicTrack(index, audioMusic, playMusicButton);
            firstClickMusic = false;
            nextMusicButton.style.display = "inline-block";
            prevMusicButton.style.display = "inline-block";
            shuffleMusicButton.style.display = "inline-block";
        }
    });

    voiceVolume.addEventListener("input", () => {
        audioSound.volume = voiceVolume.value;
        if (audioSound.volume > 0) {
            audioSound.muted = false;
            voiceMute.className = "audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
            voiceVolume.classList.remove("muted");
        }
    });

    voiceMute.addEventListener("click", () => {
        audioSound.muted = !audioSound.muted;
        voiceMute.className = audioSound.muted
            ? "audio unmute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all"
            : "audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
        voiceVolume.classList.toggle("muted", audioSound.muted);
        if (audioSound.muted) audioSound.volume = 0;
        else audioSound.volume = voiceVolume.value || 1;
    });

    musicVolume.addEventListener("input", () => {
        audioMusic.volume = musicVolume.value;
        if (audioMusic.volume > 0) {
            audioMusic.muted = false;
            musicMute.className = "audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
            musicVolume.classList.remove("muted");
        }
    });

    musicMute.addEventListener("click", () => {
        audioMusic.muted = !audioMusic.muted;
        musicMute.className = audioMusic.muted
            ? "audio unmute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all"
            : "audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
        musicVolume.classList.toggle("muted", audioMusic.muted);
        if (audioMusic.muted) audioMusic.volume = 0;
        else audioMusic.volume = musicVolume.value || 1;
    });

    audioMusic.addEventListener("timeupdate", () => {
        if (audioMusic.duration) {
            const progress = (audioMusic.currentTime / audioMusic.duration) * 100;
            musicProgress.style.width = `${progress}%`;
        }
    });

    playMusicButton.addEventListener("click", () => {
        if (!audioMusic.src) {
            const { index, track } = getNextTrack();
            playMusicTrack(index, audioMusic, playMusicButton);
            musicSelect.value = index;
        } else if (!audioMusic.paused) {
            audioMusic.pause();
            playMusicButton.className = "audio paused w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
        } else {
            audioMusic.play();
            playMusicButton.className = "audio playing w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
        }
        firstClickMusic = false;
        nextMusicButton.style.display = "inline-block";
        prevMusicButton.style.display = "inline-block";
        shuffleMusicButton.style.display = "inline-block";
    });

    prevMusicButton.addEventListener("click", () => {
        const { index, track } = getPreviousTrack();
        playMusicTrack(index, audioMusic, playMusicButton);
        musicSelect.value = index;
    });

    nextMusicButton.addEventListener("click", () => {
        const { index, track } = getNextTrack();
        playMusicTrack(index, audioMusic, playMusicButton);
        musicSelect.value = index;
    });

    shuffleMusicButton.addEventListener("click", () => {
        shuffleMode = !shuffleMode;
        shuffleMusicButton.className = shuffleMode
            ? "audio shuffle shuffle-active w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all"
            : "audio shuffle w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
    });

    audioMusic.addEventListener("ended", () => {
        const { index, track } = getNextTrack();
        playMusicTrack(index, audioMusic, playMusicButton);
        musicSelect.value = index;
    });

    playButton.addEventListener("click", () => {
        playSound(newData, audioSound, playButton, firstClick, "sound");
        if (firstClick) firstClick = false;
    });

    audioSound.addEventListener("ended", () => {
        playNewSound(newData, audioSound, "sound");
    });

    backgroundSelect.addEventListener("change", () => {
        const selectedValue = backgroundSelect.value;
        if (selectedValue) {
            document.body.style.backgroundImage = `url('${wallpaperData[selectedValue]}')`;
        }
    });

    themeSelect.addEventListener("change", () => {
        document.body.className = `min-h-screen bg-cover bg-center bg-fixed text-yellow-200 font-cinzel theme-${themeSelect.value}`;
    });

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (!window.lastSparkle || now - window.lastSparkle > 50) {
            createSparkle(e.clientX, e.clientY);
            window.lastSparkle = now;
        }
    });

    updateCursorStyle(cursorSelect.value);
}

initialize();