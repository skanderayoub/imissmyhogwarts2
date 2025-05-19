export function getRandomTrack(trackList) {
    const randomIndex = Math.floor(Math.random() * trackList.length);
    return { index: randomIndex, track: trackList[randomIndex] };
}

export function getNextTrack(currentTrackIndex, trackList, shuffleMode) {
    if (shuffleMode) {
        return getRandomTrack(trackList);
    }
    const nextIndex = (currentTrackIndex + 1) % trackList.length;
    return { index: nextIndex, track: trackList[nextIndex] };
}

export function getPreviousTrack(currentTrackIndex, trackList, shuffleMode) {
    if (shuffleMode) {
        return getRandomTrack(trackList);
    }
    const prevIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    return { index: prevIndex, track: trackList[prevIndex] };
}

export function playSound(data, audio, btn, click, type) {
    console.log("playSound", data);
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
        btn.className =
            "audio paused w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
    } else {
        audio.play();
        btn.className =
            "audio playing w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
    }
}

export function playNewSound(data, audio, type) {
    if (!data || Object.keys(data).length === 0) return;
    const keys = Object.keys(data);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const valueList = data[randomKey];
    const randomValue = valueList[Math.floor(Math.random() * valueList.length)];
    setKeyAndAudio(randomKey, randomValue, type);
    audio.src = randomValue;
    audio.play();
}

export function playMusicTrack(index, audio, btn, trackList, setCurrentTrackIndex) {
    setCurrentTrackIndex(index);
    const track = trackList[index-1];
    setKeyAndAudio(track.name, track.url, "music");
    audio.src = track.url;
    audio.play();
    btn.className =
        "audio playing w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all";
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
        const cleanName = decodeURIComponent(match[1]).split("/").pop();
        audioText.innerHTML = `<span class="font-bold">Audio:</span> ${cleanName}`;
    }
}

function setAlbumAndAudio(album, url) {
    const audioText = document.getElementById("a2");
    const regex = /\/([^\/]+)\.mp3$/;
    const match = url.match(regex);
    if (match && match[1]) {
        audioText.innerHTML = `<span class="font-bold">Audio:</span> ${decodeURIComponent(
            match[1]
        )}`;
    }
}