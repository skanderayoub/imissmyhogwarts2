let jsonData;
let musicData;
let wallpaperData;
let firstClick = true;
let firstClickMusic = true;

// Step 1: Fetch the data asynchronously and store it in jsonData
async function fetchAudioData() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/links.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    jsonData = data; // Set jsonData here for global access
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function fetchMusicData() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/music.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    musicData = data; // Set jsonData here for global access    
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function fetchWallpaperData() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/wallpapers.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    wallpaperData = data;  
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function getRandomKeyAndValue(data) {
  const keys = Object.keys(data);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  // Access the value associated with that key
  const valueList = data[randomKey];

  // Select a random value from the list (if the value is an array)
  const randomValue = valueList[Math.floor(Math.random() * valueList.length)];

  return { randomKey, randomValue };
}

function playSound(data, audio, btn, click, type) {
  if (click) {
    const { randomKey, randomValue } = getRandomKeyAndValue(data);
    setKeyAndAudio(randomKey, randomValue, type);
    audio.src = randomValue;
  }  

  if (!audio.paused) {
    audio.pause();
    btn.className = "audio paused";
  } else {
    audio.play();
    //audio.controls = true;
    btn.className = "audio playing";
  }
}

function playNewSound(data, audio, type) {
  const { randomKey, randomValue } = getRandomKeyAndValue(data);
  setKeyAndAudio(randomKey, randomValue, type);
  audio.src = randomValue; // Set the audio source to the random value (e.g., audio URL)

  // Play the audio
  audio.play();
}

function setKeyAndAudio(randomKey, randomValue, type) {
  if (type === "sound") {
    setCharacterAndAudio(randomKey, randomValue);
  } else if (type === "music") {
    setAlbumAndAudio(randomKey, randomValue);
  }
} 
function setCharacterAndAudio(randomKey, randomValue) {
  let character = document.getElementById("p");
  character.innerHTML = "Personnage: " + randomKey;  
  let regex = /\/([^\/]+)\.wav$/;
  let match = randomValue.match(regex);
  
  if (match[1]) {
    // Unquote the extracted text
    let extractedText = decodeURIComponent(match[1]);
    a.innerHTML = "Audio: " + extractedText;
  }
}  

function setAlbumAndAudio(randomKey, randomValue) {
  let album = document.getElementById("p2");
  let audio = document.getElementById("a2");
  album.innerHTML = "Musique: " + randomKey; 
  let regex = /\/([^\/]+)\.mp3$/;
  let match = randomValue.match(regex);
  
  if (match[1]) {
    // Step 2: Unquote the extracted text
    let extractedText = decodeURIComponent(match[1]);
    audio.innerHTML = "Audio: " + extractedText;
  }   
} 

// Step 4: Fetch the data, then set up button event listener for dynamic random value selection
fetchWallpaperData().then(() => {
  if (wallpaperData) {
    fetchAudioData().then(() => {
      if (jsonData) {
        fetchMusicData().then(() => {
          if (musicData) {    
            // Get the button and audio elements
            const playButton = document.getElementById("playButton");
            const audioSound = document.getElementById("audio");
            const playMusicButton = document.getElementById("playButton2");
            const playNewMusicButton = document.getElementById("newMusic");
            const audioMusic = document.getElementById("audio2");
            const backgroundSelect = document.getElementById('backgroundSelect');

            backgroundSelect.addEventListener('change', () => {
              let selectedValue = backgroundSelect.value;
              document.body.style.backgroundImage = "url('" + wallpaperData[selectedValue] + "')";
            });

            playMusicButton.addEventListener("click", () => {
              playSound(musicData, audioMusic, playMusicButton, firstClickMusic, "music");
              if (firstClickMusic) {
                firstClickMusic = false;
                playNewMusicButton.style.display = "inline"; 
              }
            });

            audioMusic.addEventListener("ended", () => {
              playNewSound(musicData, audioMusic, "music");
            });

            playNewMusicButton.addEventListener("click", () => {
              playNewSound(musicData, audioMusic, "music");
            });

            playButton.addEventListener("click", () => {
              playSound(jsonData, audioSound, playButton, firstClick, "sound");
              if (firstClick) {
                firstClick = false;
              }
            });

            // Listen for when the current audio ends, and play a new sound
            audioSound.addEventListener('ended', () => {
              // When the audio ends, get a new random sound and play it
              playNewSound(jsonData, audioSound, "sound");
            });
          }
        });
      }
    });
  }
});
