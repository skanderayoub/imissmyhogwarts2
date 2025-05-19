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
    fetchFunnyAudioData,
    fetchPottermoreData,
    fetchPatronusData,
} from './data.js';
import {
    getNextTrack,
    getPreviousTrack,
    playSound,
    playNewSound,
    playMusicTrack,
} from './audio.js';
import { setupMouseEffects } from './ui.js';
import { startQuiz } from './sorting-hat.js';
import { startPatronusQuiz } from './patronus.js';
import { startQuiz as startWandQuiz } from './wand-quiz.js';
import { startQuiz as startTriviaQuiz } from './trivia-quiz.js';

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
window.currentFunnyVoiceIndex = 0;
window.voiceSearchQuery = '';
window.newData = null;
window.selectedCharacters = [];
window.patronusData = null;

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
        case 'Legacy':
            return './assets/crests/Hogwarts-Legacy.png';
        default:
            return './assets/crests/Hogwarts.png';
    }
}

function isNonEmpty(value) {
    return value !== null && value !== '' && value !== undefined &&
        (Array.isArray(value) ? value.length > 0 : typeof value !== 'object' || Object.keys(value).length > 0);
}

function setEqualCardHeights(containerId) {
    const cards = document.querySelectorAll(`#${containerId} .character-card`);
    if (cards.length === 0) return;

    cards.forEach(card => card.style.height = 'auto');

    setTimeout(() => {
        const maxHeight = Array.from(cards).reduce((max, card) => {
            return Math.max(max, card.offsetHeight);
        }, 0);
        cards.forEach(card => card.style.height = `${maxHeight}px`);
    }, 0);
}

function formatAsList(items, label, type) {
    let itemClass = type === 'potion' ? 'potion-detail-item' : 'character-detail-item';

    if (!isNonEmpty(items)) return '';

    let listItems;
    if (type === 'potion') {
        // Potion lists are comma-separated strings
        listItems = typeof items === 'string' && items.trim() !== ''
            ? items.split(',').map(item => item.trim()).filter(item => item !== '')
            : [];
    } else {
        // Character lists are arrays
        listItems = Array.isArray(items) ? items.filter(item => isNonEmpty(item)) : [];
    }

    if (listItems.length === 0) return '';
    if (listItems.length === 1) {
        return `<li class="${itemClass}"><span class="font-bold text-secondary">${label}:</span> ${listItems[0]}</li>`;
    }
    return `
        <li class="${itemClass}">
            <span class="font-bold text-secondary">${label}:</span>
            <ul class="list-disc list-inside ml-4 mt-1">
                ${listItems.map(item => `<li class="text-yellow-200 text-sm animate-slideIn">${item}</li>`).join('')}
            </ul>
        </li>
    `;
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
            spell.attributes.name.toLowerCase().includes(query) ||
            (spell.attributes.incantation && spell.attributes.incantation.toLowerCase().includes(query))
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

function filterVoices(searchQuery) {
    let filtered = Object.keys(window.jsonData);

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(key => {
            const character = window.characterLoreData.find(c => c.attributes.name === key);
            return key.toLowerCase().includes(query) ||
                (character && (character.attributes.alias_names || []).some(alias => alias.toLowerCase().includes(query)));
        });
    }

    return filtered;
}

function renderVoiceList(searchQuery) {
    const characterList = document.getElementById('characterList');
    const voiceCharacterList = document.getElementById('voiceCharacterList');

    characterList.innerHTML = '';

    const existingSelectedList = document.getElementById('selectedCharacterList');
    if (existingSelectedList) {
        existingSelectedList.remove();
    }
    const existingHeader = document.getElementById('selectedCharactersHeader');
    if (existingHeader) {
        existingHeader.remove();
    }

    const filteredCharacters = filterVoices(searchQuery);

    filteredCharacters.forEach(key => {
        if (!window.selectedCharacters.includes(key)) {
            renderCharacterCard(key, characterList, false);
        }
    });

    if (window.selectedCharacters.length > 0) {
        const headerContainer = document.createElement('div');
        headerContainer.id = 'selectedCharactersHeader';
        headerContainer.className = 'mt-4';

        const divider = document.createElement('div');
        divider.className = 'border-t border-yellow-400 my-2 mx-2';
        headerContainer.appendChild(divider);

        const selectedHeader = document.createElement('div');
        selectedHeader.className = 'text-yellow-200 font-harry-potter text-sm mb-2 px-2';
        selectedHeader.textContent = 'Selected Characters';
        headerContainer.appendChild(selectedHeader);

        voiceCharacterList.appendChild(headerContainer);

        const selectedCharacterList = document.createElement('div');
        selectedCharacterList.id = 'selectedCharacterList';
        selectedCharacterList.className = 'grid grid-cols-3 gap-1';
        voiceCharacterList.appendChild(selectedCharacterList);

        window.selectedCharacters.forEach(key => {
            if (filteredCharacters.includes(key)) {
                renderCharacterCard(key, selectedCharacterList, true);
            }
        });
    }

    function renderCharacterCard(key, container, isSelected) {
        const character = window.characterLoreData.find(c => c.attributes.name === key);
        const card = document.createElement('div');
        card.className = `character-card cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 transition-all p-2 rounded-lg ${isSelected ? 'selected' : ''}`;
        card.dataset.character = key;
        const content = document.createElement('div');
        content.className = 'flex flex-col items-center';
        const imageSrc = character ? (character.attributes.image || getHouseCrest(character.attributes.house)) : getHouseCrest('Legacy');
        content.innerHTML = `
            <img src="${imageSrc}" alt="${key} crest" class="w-12 h-12 object-contain rounded-full mb-1" />
            <span class="text-center text-xs font-harry-potter text-yellow-200">${key}</span>
        `;
        card.appendChild(content);
        card.addEventListener('click', () => {
            const index = window.selectedCharacters.indexOf(key);
            if (index === -1) {
                window.selectedCharacters.push(key);
                card.classList.add('selected');
            } else {
                window.selectedCharacters.splice(index, 1);
                card.classList.remove('selected');
            }
            window.newData = Object.fromEntries(
                Object.entries(window.jsonData).filter(([key]) =>
                    window.selectedCharacters.includes(key)
                )
            );
            if (window.selectedCharacters.length === 0) {
                window.newData = window.jsonData;
            }
            document.getElementById('p').innerHTML = `<span class="font-bold">Personnage:</span> ${window.selectedCharacters.join(', ') || 'Select a character'}`;
            renderVoiceList(searchQuery);
        });
        container.appendChild(card);
    }

    setEqualCardHeights('characterList');
    setEqualCardHeights('selectedCharacterList');
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
            const details = [];
            // Non-null and non-empty attributes in logical order
            if (isNonEmpty(character.attributes.species)) {
                details.push(`<li class="character-detail-item"><span class="font-bold text-secondary">Species:</span> ${character.attributes.species}</li>`);
            }
            if (isNonEmpty(character.attributes.gender)) {
                details.push(`<li class="character-detail-item"><span class="font-bold text-secondary">Gender:</span> ${character.attributes.gender}</li>`);
            }
            if (isNonEmpty(character.attributes.nationality)) {
                details.push(`<li class="character-detail-item"><span class="font-bold text-secondary">Nationality:</span> ${character.attributes.nationality}</li>`);
            }
            if (isNonEmpty(character.attributes.house)) {
                details.push(`<li class="character-detail-item"><span class="font-bold text-secondary">House:</span> ${character.attributes.house}</li>`);
            }
            if (isNonEmpty(character.attributes.patronus)) {
                details.push(`<li class="character-detail-item"><span class="font-bold text-secondary">Patronus:</span> ${character.attributes.patronus}</li>`);
            }
            if (isNonEmpty(character.attributes.born)) {
                details.push(`<li class="character-detail-item"><span class="font-bold text-secondary">Born:</span> ${character.attributes.born}</li>`);
            }
            if (isNonEmpty(character.attributes.died)) {
                details.push(`<li class="character-detail-item"><span class="font-bold text-secondary">Died:</span> ${character.attributes.died}</li>`);
            }
            if (isNonEmpty(character.attributes.alias_names)) {
                details.push(formatAsList(character.attributes.alias_names, 'Alternate Names', 'character'));
            }
            if (isNonEmpty(character.attributes.wands)) {
                details.push(formatAsList(character.attributes.wands, 'Wands', 'character'));
            }
            if (isNonEmpty(character.attributes.romances)) {
                details.push(formatAsList(character.attributes.romances, 'Romances', 'character'));
            }
            if (isNonEmpty(character.attributes.titles)) {
                details.push(formatAsList(character.attributes.titles, 'Titles', 'character'));
            }
            if (isNonEmpty(character.attributes.jobs)) {
                details.push(formatAsList(character.attributes.jobs, 'Jobs', 'character'));
            }
            if (isNonEmpty(character.attributes.family_members)) {
                details.push(formatAsList(character.attributes.family_members, 'Family Members', 'character'));
            }

            // Render character details
            characterDetails.innerHTML = `
    <div class="character-details-container flex flex-col items-center p-4 animate-fadeIn">
        <img src="${imageSrc}" alt="${character.attributes.name} crest" class="w-24 h-24 object-contain rounded-lg mb-4" />
        ${isNonEmpty(character.attributes.name) ? `<h3 class="character-name font-harry-potter text-2xl text-yellow-300 text-shadow-lg text-center mb-4">${character.attributes.name}</h3>` : ''}
        ${details.length > 0 ? `
            <ul class="character-details-list grid grid-cols-1 gap-2 w-full max-w-md">
                ${details.join('')}
            </ul>
        ` : '<p class="text-yellow-200 text-center">No additional details available.</p>'}
    </div>
`;
        });
        characterLoreList.appendChild(card);
    });

    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    prevPage.disabled = page === 0;
    nextPage.disabled = end >= filteredCharacters.length;
    setEqualCardHeights('characterLoreList');
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
        const imageHtml = spell.attributes.image ? `<img src="${spell.attributes.image}" alt="${spell.attributes.name}" class="w-12 h-12 object-contain rounded-lg mb-4" />` : '';

        content.innerHTML = `
            ${imageHtml}
            <span class="text-center text-xs font-harry-potter text-yellow-200">${spell.attributes.name}</span>
        `;
        card.appendChild(content);
        card.addEventListener('click', () => {
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            spellDetails.classList.remove('hidden');
            const imageHtml = spell.attributes.image ? `<img src="${spell.attributes.image}" alt="${spell.attributes.name}" class="w-64 h-64 object-contain rounded-lg mb-4" />` : '';
            const details = [];
            // Effect first
            if (isNonEmpty(spell.attributes.effect)) {
                details.push(`<li class="spell-detail-item"><span class="font-bold text-secondary">Effect:</span> ${spell.attributes.effect}</li>`);
            }
            if (isNonEmpty(spell.attributes.incantation)) {
                details.push(`<li class="spell-detail-item"><span class="font-bold text-secondary">Incantation:</span> ${spell.attributes.incantation}</li>`);
            }
            // Other non-null attributes
            if (isNonEmpty(spell.attributes.category)) {
                details.push(`<li class="spell-detail-item"><span class="font-bold text-secondary">Category:</span> ${spell.attributes.category}</li>`);
            }
            if (isNonEmpty(spell.attributes.creator)) {
                details.push(`<li class="spell-detail-item"><span class="font-bold text-secondary">Creator:</span> ${spell.attributes.creator}</li>`);
            }
            if (isNonEmpty(spell.attributes.light)) {
                details.push(`<li class="spell-detail-item"><span class="font-bold text-secondary">Light:</span> ${spell.attributes.light}</li>`);
            }
            if (isNonEmpty(spell.attributes.hand)) {
                details.push(`<li class="spell-detail-item"><span class="font-bold text-secondary">Hand:</span> ${spell.attributes.hand}</li>`);
            }

            // Render spell details
            spellDetails.innerHTML = `
    <div class="spell-details-container flex flex-col items-center p-4 animate-fadeIn">
        ${imageHtml}
        ${isNonEmpty(spell.attributes.name) ? `<h3 class="spell-name font-harry-potter text-2xl text-yellow-300 text-shadow-lg text-center mb-4">${spell.attributes.name}</h3>` : ''}
        ${details.length > 0 ? `
            <ul class="spell-details-list grid grid-cols-1 gap-2 w-full max-w-md">
                ${details.join('')}
            </ul>
        ` : '<p class="text-yellow-200 text-center">No additional details available.</p>'}
    </div>
`;
        });
        spellList.appendChild(card);
    });

    const prevSpellPage = document.getElementById('prevSpellPage');
    const nextSpellPage = document.getElementById('nextSpellPage');
    prevSpellPage.disabled = page === 0;
    nextSpellPage.disabled = end >= filteredSpells.length;
    setEqualCardHeights('spellList');
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
        const imageHtml = potion.attributes.image ? `<img src="${potion.attributes.image}" alt="${potion.attributes.name}" class="w-12 h-12 object-contain rounded-lg mb-4" />` : '';
        content.innerHTML = `
            ${imageHtml}
            <span class="text-center text-xs font-harry-potter text-yellow-200">${potion.attributes.name}</span>
        `;
        
        card.appendChild(content);
        card.addEventListener('click', () => {
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            potionDetails.classList.remove('hidden');
            const imageHtml = potion.attributes.image ? `<img src="${potion.attributes.image}" alt="${potion.attributes.name}" class="w-64 h-64 object-contain rounded-lg mb-4" />` : '';
            const details = [];
            // Effect first
            if (isNonEmpty(potion.attributes.effect)) {
                details.push(`<li class="potion-detail-item"><span class="font-bold text-secondary">Effect:</span> ${potion.attributes.effect}</li>`);
            }
            // Other attributes
            if (isNonEmpty(potion.attributes.characteristics)) {
                details.push(`<li class="potion-detail-item"><span class="font-bold text-secondary">Characteristics:</span> ${potion.attributes.characteristics}</li>`);
            }
            if (isNonEmpty(potion.attributes.difficulty)) {
                details.push(`<li class="potion-detail-item"><span class="font-bold text-secondary">Difficulty:</span> ${potion.attributes.difficulty}</li>`);
            }
            if (isNonEmpty(potion.attributes.inventors)) {
                details.push(`${formatAsList(potion.attributes.inventors, 'Inventors', 'potion')}`);
            }
            if (isNonEmpty(potion.attributes.ingredients)) {
                details.push(`${formatAsList(potion.attributes.ingredients, 'Ingredients', 'potion')}`);
            }
            if (isNonEmpty(potion.attributes.manufacturers)) {
                details.push(`${formatAsList(potion.attributes.manufacturers, 'Manufacturers', 'potion')}`);
            }
            if (isNonEmpty(potion.attributes.side_effects)) {
                details.push(`<li class="potion-detail-item"><span class="font-bold text-secondary">Side Effects:</span> ${potion.attributes.side_effects}</li>`);
            }
            if (isNonEmpty(potion.attributes.time)) {
                details.push(`<li class="potion-detail-item"><span class="font-bold text-secondary">Time:</span> ${potion.attributes.time}</li>`);
            }

            // Render potion details
            potionDetails.innerHTML = `
    <div class="potion-details-container flex flex-col items-center p-4 animate-fadeIn">
        ${imageHtml}
        ${isNonEmpty(potion.attributes.name) ? `<h3 class="potion-name font-harry-potter text-2xl text-yellow-300 text-shadow-lg text-center mb-4">${potion.attributes.name}</h3>` : ''}
        ${details.length > 0 ? `
            <ul class="potion-details-list grid grid-cols-1 gap-2 w-full max-w-md">
                ${details.join('')}
            </ul>
        ` : '<p class="text-yellow-200 text-center">No additional details available.</p>'}
    </div>
`;
        });
        potionList.appendChild(card);
    });

    const prevPotionPage = document.getElementById('prevPotionPage');
    const nextPotionPage = document.getElementById('nextPotionPage');
    prevPotionPage.disabled = page === 0;
    nextPotionPage.disabled = end >= filteredPotions.length;
    setEqualCardHeights('potionList');
}

async function initialize() {
    const [audioData, { musicData, trackList }, wallpaperData, characterLoreData, spellsData, spellCategories, potionsData, potionDifficulties, funnyAudio, patronusData] = await Promise.all([
        fetchAudioData(),
        fetchMusicData(),
        fetchWallpaperData(window.screenWidth),
        fetchCharacterLoreData(),
        fetchSpellsData(),
        fetchSpellCategories(),
        fetchPotionsData(),
        fetchPotionDifficulties(),
        fetchFunnyAudioData(),
        fetchPatronusData(),
    ]);

    window.jsonData = audioData;
    window.musicData = musicData;
    window.trackList = trackList;
    window.wallpaperData = wallpaperData;
    window.characterLoreData = characterLoreData;
    window.spellsData = spellsData;
    window.potionsData = potionsData;
    window.funnyAudio = funnyAudio;
    window.newData = audioData;
    window.patronusData = patronusData;

    if (!window.wallpaperData || !window.jsonData || !window.musicData || !window.patronusData) {
        console.error("Failed to load required data:", {
            wallpaperData: window.wallpaperData,
            jsonData: window.jsonData,
            musicData: window.musicData,
            patronusData: window.patronusData,
        });
        return;
    }

    const playButton = document.getElementById('playButton');
    const audioSound = document.getElementById('audio');
    const voiceVolume = document.getElementById('voiceVolume');
    const voiceMute = document.getElementById('voiceMute');
    const playAllVoices = document.getElementById('playAllVoices');
    const funnyVoicesAudio = document.getElementById('funnyVoicesAudio');
    const funnyVoiceVolume = document.getElementById('funnyVoiceVolume');
    const funnyVoiceMute = document.getElementById('funnyVoiceMute');
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
    const loreFilter = document.getElementById('loreFilter');
    const spellFilter = document.getElementById('spellFilter');
    const potionFilter = document.getElementById('potionFilter');
    const characterSearch = document.getElementById('characterSearch');
    const spellSearch = document.getElementById('spellSearch');
    const potionSearch = document.getElementById('potionSearch');
    const voiceSearch = document.getElementById('voiceSearch');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const prevSpellPage = document.getElementById('prevSpellPage');
    const nextSpellPage = document.getElementById('nextSpellPage');
    const prevPotionPage = document.getElementById('prevPotionPage');
    const nextPotionPage = document.getElementById('nextPotionPage');
    const clearSelectionButton = document.getElementById('clearSelection');

    musicSelect.innerHTML = '<option value="">Choose a Track</option>';
    const albums = [...new Set(window.trackList.map(track => track.album))];
    albums.forEach(album => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = album;
        window.trackList
            .filter(track => track.album === album)
            .forEach((track, index) => {
                const option = document.createElement('option');
                option.value = window.trackList.indexOf(track);
                const trackName = track.url
                    .substring(track.url.lastIndexOf('/') + 1)
                    .replace(/\.(mp3)/, '')
                    .replace(/^\d+\.\s*/, '');
                option.text = decodeURIComponent(trackName);
                optgroup.appendChild(option);
            });
        musicSelect.appendChild(optgroup);
    });

    const defaultBackground = window.screenWidth < 600
        ? 'assets/phone/dark.png'
        : './assets/1303125.jpg';
    const bgImg = new Image();
    bgImg.src = defaultBackground;
    bgImg.onload = () => {
        document.body.style.backgroundImage = `url('${defaultBackground}')`;
        document.body.style.display = 'block';
        document.body.style.height = '100%';
        document.body.style.width = '100%';
        document.body.style.position = 'fixed';
    };
    bgImg.onerror = () => {
        console.error(`Failed to load background image: ${defaultBackground}`);
        document.body.style.display = 'block';
    };

    let isPlayingFunnyVoices = false;
    const funnyVoiceUrls = window.funnyAudio;
    playAllVoices.addEventListener('click', () => {
        if (!isPlayingFunnyVoices) {
            isPlayingFunnyVoices = true;
            console.log('Funny voices audio data:', funnyVoiceUrls);
            playAllVoices.className = 'audio playing w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
            if (!funnyVoicesAudio.src || funnyVoicesAudio.paused) {
                funnyVoicesAudio.src = funnyVoiceUrls[window.currentFunnyVoiceIndex];
                funnyVoicesAudio.play().catch((e) => console.error('Error playing funny voice:', e));
            } else {
                funnyVoicesAudio.play().catch((e) => console.error('Error playing funny voice:', e));
            }
        } else {
            isPlayingFunnyVoices = false;
            playAllVoices.className = 'audio paused w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
            funnyVoicesAudio.pause();
        }
    });

    funnyVoicesAudio.addEventListener('ended', () => {
        if (isPlayingFunnyVoices) {
            window.currentFunnyVoiceIndex = (window.currentFunnyVoiceIndex + 1) % funnyVoiceUrls.length;
            funnyVoicesAudio.src = funnyVoiceUrls[window.currentFunnyVoiceIndex];
            funnyVoicesAudio.play().catch((e) => console.error('Error playing funny voice:', e));
        }
    });

    funnyVoiceVolume.addEventListener('input', () => {
        funnyVoicesAudio.volume = funnyVoiceVolume.value;
        if (funnyVoicesAudio.volume > 0) {
            funnyVoicesAudio.muted = false;
            funnyVoiceMute.className = 'audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
            funnyVoiceVolume.classList.remove('muted');
        }
    });

    funnyVoiceMute.addEventListener('click', () => {
        funnyVoicesAudio.muted = !funnyVoicesAudio.muted;
        funnyVoiceMute.className = funnyVoicesAudio.muted
            ? 'audio unmute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all'
            : 'audio mute w-10 h-10 bg-gray-800 rounded-full hover-transition transition-all';
        funnyVoiceVolume.classList.toggle('muted', funnyVoicesAudio.muted);
        if (funnyVoicesAudio.muted) funnyVoicesAudio.volume = 0;
        else funnyVoicesAudio.volume = funnyVoiceVolume.value || 1;
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    const loreSubTabButtons = document.querySelectorAll('.lore-sub-tab-button');
    const gamesSubTabButtons = document.querySelectorAll('.games-sub-tab-button');

    function switchMainTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.remove('hidden');
            document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
            console.log(`Switched to main tab: ${tabId}`);
            if (tabId === 'lore-games') {
                switchLoreSubTab('characters');
                switchGamesSubTab('sorting-hat');
            } else if (tabId === 'voices') {
                renderVoiceList(window.voiceSearchQuery);
            }
        } else {
            console.error(`Tab content not found for: ${tabId}`);
        }
    }

    function switchLoreSubTab(loreTabId) {
        loreSubTabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.lore-sub-tab-content').forEach(content => content.classList.add('hidden'));
        const targetLoreTab = document.getElementById(loreTabId);
        if (targetLoreTab) {
            targetLoreTab.classList.remove('hidden');
            document.querySelector(`.lore-sub-tab-button[data-lore-tab="${loreTabId}"]`).classList.add('active');
            console.log(`Switched to lore sub-tab: ${loreTabId}`);
            if (loreTabId === 'characters') {
                renderCharacterLoreList(window.currentCharacterPage, loreFilter.value, window.characterSearchQuery);
            } else if (loreTabId === 'spells') {
                renderSpellList(window.currentSpellPage, spellFilter.value, window.spellSearchQuery);
            } else if (loreTabId === 'potions') {
                renderPotionList(window.currentPotionPage, potionFilter.value, window.potionSearchQuery);
            }
        } else {
            console.error(`Lore sub-tab content not found for: ${loreTabId}`);
        }
    }

    function switchGamesSubTab(gamesTabId) {
        gamesSubTabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.games-sub-tab-content').forEach(content => content.classList.add('hidden'));
        const targetGamesTab = document.getElementById(gamesTabId);
        if (targetGamesTab) {
            targetGamesTab.classList.remove('hidden');
            document.querySelector(`.games-sub-tab-button[data-games-tab="${gamesTabId}"]`).classList.add('active');
            console.log(`Switched to games sub-tab: ${gamesTabId}`);
            if (gamesTabId === 'sorting-hat') {
                startQuiz();
            } else if (gamesTabId === 'patronus') {
                startPatronusQuiz(window.patronusData);
            } else if (gamesTabId === 'wand') {
                // Wand quiz is started via button click
            } else if (gamesTabId === 'trivia') {
                // Trivia quiz is started via button click
            }
        } else {
            console.error(`Games sub-tab content not found for: ${gamesTabId}`);
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            switchMainTab(button.dataset.tab);
        });
    });

    loreSubTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            switchLoreSubTab(button.dataset.loreTab);
        });
    });

    gamesSubTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            switchGamesSubTab(button.dataset.gamesTab);
        });
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

    window.wallpaperData.forEach((wallpaper, index) => {
        const option = document.createElement('option');
        // Extract the file name without extension
        const fileName = wallpaper.split('/').pop().replace(/\.[^/.]+$/, '');
        option.text = fileName || `Wallpaper ${index + 1}`; // Fallback if fileName is empty
        option.value = index;
        backgroundSelect.appendChild(option);
    });
    console.log(window.wallpaperData);

    voiceSearch.addEventListener('input', () => {
        window.voiceSearchQuery = voiceSearch.value.trim();
        renderVoiceList(window.voiceSearchQuery);
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
        playSound(window.newData, audioSound, playButton, window.firstClick, 'sound');
        if (window.firstClick) window.firstClick = false;
    });

    audioSound.addEventListener('ended', () => {
        playNewSound(window.newData, audioSound, 'sound');
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

    clearSelectionButton.addEventListener('click', () => {
        window.selectedCharacters = [];
        window.newData = window.jsonData;
        renderVoiceList(window.voiceSearchQuery);
        document.getElementById('p').innerHTML = `<span class="font-bold">Personnage:</span> Select a character`;
    });

    const savedTheme = localStorage.getItem('hogwartsTheme');
    if (savedTheme) {
        themeSelect.value = savedTheme;
        document.body.className = `min-h-screen bg-cover bg-center bg-fixed text-yellow-200 font-cinzel theme-${savedTheme}`;
    }

    document.getElementById('start-wand-quiz').addEventListener('click', () => {
        switchGamesSubTab('wand');
        startWandQuiz();
    });
    document.getElementById('start-trivia-quiz').addEventListener('click', () => {
        switchGamesSubTab('trivia');
        startTriviaQuiz();
    });

    setupMouseEffects();
    renderVoiceList('');

    const loreGamesTab = document.querySelector('.tab-button[data-tab="lore-games"]');
    if (loreGamesTab.classList.contains('active')) {
        switchMainTab('lore-games');
    }
}

initialize();