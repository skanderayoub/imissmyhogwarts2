let jsonData;
let firstClick = true;

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

// Step 2: Get a random key-value pair from jsonData
function getRandomKeyAndValue() {
  const keys = Object.keys(jsonData);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  // Access the value associated with that key
  const valueList = jsonData[randomKey];

  // Select a random value from the list (if the value is an array)
  const randomValue = valueList[Math.floor(Math.random() * valueList.length)];

  return { randomKey, randomValue };
}

// Step 3: Play a sound based on the random value (assuming it's a valid URL or audio path)
function playSound() {
  let audio = document.getElementById("audio");
  if (firstClick) {
    const { randomKey, randomValue } = getRandomKeyAndValue();
    setCharacterAndAudio(randomKey, randomValue);
    firstClick = false;
    audio.src = randomValue;
  }

  if (!audio.paused) {
    audio.pause();
  } else {
    audio.play();
  }
  let status = document.getElementById("s");
  status.innerHTML = audio.paused ? "Status: Paused" : "Status: Playing";
}

function playNewSound() {
  let audio = document.getElementById("audio");
  const { randomKey, randomValue } = getRandomKeyAndValue();
  setCharacterAndAudio(randomKey, randomValue);
  audio.src = randomValue; // Set the audio source to the random value (e.g., audio URL)

  // Play the audio
  audio.play();
}

function playMusic() {
  let audio = document.getElementById("audio2");
  audio.play();
}

function setCharacterAndAudio(randomKey, randomValue) {
  let character = document.getElementById("p");
  let audio = document.getElementById("a");
  character.innerHTML = "Personnage: " + randomKey;  
  let regex = /\/([^\/]+)\.wav$/;
  let match = randomValue.match(regex);
  
  if (match[1]) {
    // Step 2: Unquote the extracted text
    let extractedText = decodeURIComponent(match[1]);
    a.innerHTML = "Audio: " + extractedText;
  }  
} 

function setAlbumAndAudio(randomKey, randomValue) {
  let album = document.getElementById("p2");
  let audio = document.getElementById("a2");
  album.innerHTML = "Personnage: " + randomKey;  
  audio.innerHTML = "Audio: " + randomValue; 
} 

// Step 4: Fetch the data, then set up button event listener for dynamic random value selection
fetchAudioData().then(() => {
  if (jsonData) {
    // Get the button and audio elements
    const playButton = document.getElementById("playButton");
    const audio = document.getElementById("audio");
    const music = document.getElementById("audio2");
    const playMusicButton = document.getElementById("playButton2");

    playMusicButton.addEventListener("click", () => {
      playMusic();
    });

    // Add event listener to the button to play sound on click
    playButton.addEventListener("click", () => {
      // Get a new random value when the button is clicked and start playing
      
      playSound();
    });

    // Listen for when the current audio ends, and play a new sound
    audio.addEventListener('ended', () => {
      // When the audio ends, get a new random sound and play it
      playNewSound();
    });
  }
});
