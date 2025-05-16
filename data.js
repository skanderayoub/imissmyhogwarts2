export async function fetchAudioData() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/links.json"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching audio data:", error);
        return null;
    }
}

export async function fetchMusicData() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/music.json"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const musicData = await response.json();
        const tempTrackList = [];
        Object.entries(musicData).forEach(([album, tracks]) => {
            tracks.forEach((url) => {
                const regex = /\/(\d+)\.\s*([^\/]+)\.mp3$/;
                const match = url.match(regex);
                const trackNumber = match ? parseInt(match[1]) : Infinity;
                const trackName = match
                    ? decodeURIComponent(match[2])
                    : url.split("/").pop();
                tempTrackList.push({ album, url, trackNumber, trackName });
            });
        });
        tempTrackList.sort((a, b) => {
            if (a.album < b.album) return -1;
            if (a.album > b.album) return 1;
            return a.trackNumber - b.trackNumber;
        });
        return { musicData, trackList: tempTrackList.map(({ album, url }) => ({ album, url })) };
    } catch (error) {
        console.error("Error fetching music data:", error);
        return { musicData: null, trackList: [] };
    }
}

export async function fetchWallpaperData(screenWidth) {
    try {
        const url =
            screenWidth < 600
                ? "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/wallpapers_phone.json"
                : "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/wallpapers.json";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching wallpaper data:", error);
        return null;
    }
}

export async function fetchCursorData() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/cursors.json"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Error fetching cursor data:", error);
        return ["dumbledore"];
    }
}

export async function fetchCharacterLoreData() {
    try {
        const response = await fetch('./characters.json');
        if (!response.ok) throw new Error('Failed to fetch characters.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
}

export async function fetchSpellsData() {
    try {
        const response = await fetch('./spells.json');
        if (!response.ok) throw new Error('Failed to fetch spells.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching spells:', error);
        return [];
    }
}

export async function fetchSpellCategories() {
    try {
        const response = await fetch('./spells.json');
        if (!response.ok) throw new Error('Failed to fetch spells.json for categories');
        const data = await response.json();
        const categories = [...new Set(data.map(spell => spell.attributes.category).filter(category => category))];
        return categories.sort();
    } catch (error) {
        console.error('Error fetching spell categories:', error);
        return [];
    }
}

export async function fetchPotionsData() {
    try {
        const response = await fetch('./potions.json');
        if (!response.ok) throw new Error('Failed to fetch potions.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching potions:', error);
        return [];
    }
}

export async function fetchPotionDifficulties() {
    try {
        const response = await fetch('./potions.json');
        if (!response.ok) throw new Error('Failed to fetch potions.json for difficulties');
        const data = await response.json();
        const difficulties = [...new Set(data.map(potion => potion.attributes.difficulty).filter(difficulty => difficulty))];
        return difficulties.sort();
    } catch (error) {
        console.error('Error fetching potion difficulties:', error);
        return [];
    }
}