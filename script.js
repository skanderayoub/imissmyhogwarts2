let jsonData;
let musicData;
let wallpaperData;
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
        // Flatten music tracks into a single list with album info
        trackList = Object.entries(musicData).flatMap(([album, tracks]) =>
            tracks.map(url => ({ album, url }))
        );
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
        btn.className = "audio paused";
    } else {
        audio.play();
        btn.className = "audio playing";
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
    btn.className = "audio playing";
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
    character.innerHTML = `<span class="label">Personnage:</span> ${key}`;
    const regex = /\/([^\/]+)\.wav$/;
    const match = value.match(regex);
    if (match && match[1]) {
        const cleanName = decodeURIComponent(match[1]).split('/').pop();
        audioText.innerHTML = `<span class="label">Audio:</span> ${cleanName}`;
    }
}

function setAlbumAndAudio(album, url) {
    const albumText = document.getElementById("p2");
    const audioText = document.getElementById("a2");
    const trackNumber = currentTrackIndex + 1;
    const totalTracks = trackList.length;
    albumText.innerHTML = `<span class="label">Musique:</span> ${album} (${trackNumber}/${totalTracks})`;
    const regex = /\/([^\/]+)\.mp3$/;
    const match = url.match(regex);
    if (match && match[1]) {
        audioText.innerHTML = `<span class="label">Audio:</span> ${decodeURIComponent(match[1])}`;
    }
}

// House mapping for characters
const houseMapping = {
    "Gryffindor Student": "gryffindor",
    "Hufflepuff Student": "hufflepuff",
    "Ravenclaw Student": "ravenclaw",
    "Slytherin Student": "slytherin",
};

async function initialize() {
    await Promise.all([fetchWallpaperData(), fetchAudioData(), fetchMusicData()]);
    if (!wallpaperData || !jsonData || !musicData) return;

    const playButton = document.getElementById("playButton");
    const audioSound = document.getElementById("audio");
    const voiceVolume = document.getElementById("voiceVolume");
    const voiceMute = document.getElementById("voiceMute");
    const playMusicButton = document.getElementById("playButton2");
    const prevMusicButton = document.getElementById("prevMusic");
    const nextMusicButton = document.getElementById("nextMusic");
    const shuffleMusicButton = document.getElementById("shuffleMusic");
    const audioMusic = document.getElementById("audio2");
    const musicVolume = document.getElementById("musicVolume");
    const backgroundSelect = document.getElementById("backgroundSelect");
    const characterList = document.getElementById("characterList");
    let selectedCharacters = [];
    let newData = jsonData;

    const bgImg = new Image();
    bgImg.src = screenWidth < 600 ? "assets/phone/dark.png" : "assets/1302540.png";
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
        card.className = `character-card ${houseMapping[key] || ''}`;
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

    voiceVolume.addEventListener("input", () => {
        audioSound.volume = voiceVolume.value;
        if (audioSound.volume > 0) {
            audioSound.muted = false;
            voiceMute.className = "audio mute";
        }
    });

    voiceMute.addEventListener("click", () => {
        audioSound.muted = !audioSound.muted;
        voiceMute.className = audioSound.muted ? "audio unmute" : "audio mute";
        if (audioSound.muted) audioSound.volume = 0;
        else audioSound.volume = voiceVolume.value || 1;
    });

    musicVolume.addEventListener("input", () => {
        audioMusic.volume = musicVolume.value;
        if (audioMusic.volume > 0) {
            audioMusic.muted = false;
            musicMute.className = "audio mute";
        }
    });

    musicMute.addEventListener("click", () => {
        audioMusic.muted = !audioMusic.muted;
        musicMute.className = audioMusic.muted ? "audio unmute" : "audio mute";
        if (audioMusic.muted) audioMusic.volume = 0;
        else audioMusic.volume = musicVolume.value || 1;
    });

    playMusicButton.addEventListener("click", () => {
        if (!audioMusic.src) {
            const { index, track } = getNextTrack();
            playMusicTrack(index, audioMusic, playMusicButton);
        } else if (!audioMusic.paused) {
            audioMusic.pause();
            playMusicButton.className = "audio paused";
        } else {
            audioMusic.play();
            playMusicButton.className = "audio playing";
        }
        firstClickMusic = false;
        nextMusicButton.style.display = "inline-block";
        prevMusicButton.style.display = "inline-block";
        shuffleMusicButton.style.display = "inline-block";
    });

    prevMusicButton.addEventListener("click", () => {
        const { index, track } = getPreviousTrack();
        playMusicTrack(index, audioMusic, playMusicButton);
    });

    nextMusicButton.addEventListener("click", () => {
        const { index, track } = getNextTrack();
        playMusicTrack(index, audioMusic, playMusicButton);
    });

    shuffleMusicButton.addEventListener("click", () => {
        shuffleMode = !shuffleMode;
        shuffleMusicButton.className = shuffleMode ? "audio shuffle shuffle-active" : "audio shuffle";
    });

    audioMusic.addEventListener("ended", () => {
        const { index, track } = getNextTrack();
        playMusicTrack(index, audioMusic, playMusicButton);
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
}

initialize();