let jsonData;
let musicData;
let wallpaperData;
let firstClick = true;
let firstClickMusic = true;
let screenWidth = window.innerWidth;

// Step 1: Fetch the data asynchronously and store it in jsonData
async function fetchAudioData() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/links.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    jsonData = data; // Set jsonData here for global access
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

async function fetchMusicData() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/music.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    musicData = data; // Set jsonData here for global access
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

async function fetchWallpaperData() {
  try {
    if (screenWidth < 600) {
      console.log("phone");
      const response = await fetch(
        "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/wallpapers_phone.json"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      wallpaperData = data;
    } else {
      const response = await fetch(
        "https://raw.githubusercontent.com/skanderayoub/imissmyhogwarts2/refs/heads/main/wallpapers.json"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      wallpaperData = data;
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
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
            console.log(wallpaperData);
            const playButton = document.getElementById("playButton");
            const audioSound = document.getElementById("audio");
            const playMusicButton = document.getElementById("playButton2");
            const playNewMusicButton = document.getElementById("newMusic");
            const audioMusic = document.getElementById("audio2");
            const backgroundSelect =
              document.getElementById("backgroundSelect");
            const checkboxList = document.getElementById("checkboxList");7
            let selectedCheckboxes;
            let newData;

            bgImg = new Image();
            bgImg.src = "assets/1302540.png";
            let revelio = new Audio();
            revelio.src =
              "https://archive.org/download/hogwarts-legacy-voice-files/Player%20%28Female%29.rar/Player%20%28Female%29%2Fplayerfemale_00429.wav";
            bgImg.onload = function () {
              document.body.style.display = "block";
              document.body.addEventListener("mousemove", () => {
                //revelio.play();
                //console.log("revelio");
              });
            };

            let bgNum = wallpaperData.length;
            for (let i = 0; i < bgNum; i++) {
              let option = document.createElement("option");
              option.text = wallpaperData[i].substring(wallpaperData[i].lastIndexOf('/') + 1).replace(".png", "");
              option.value = i;
              backgroundSelect.add(option);
            }

            // Iterate over the keys in the dictionary and create checkbox items
            Object.keys(jsonData).forEach((key, index) => {
              // Create a new list item
              const listItem = document.createElement("li");
              listItem.className = "list-group-item";

              // Create the checkbox input
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.className = "form-check-input me-1";
              checkbox.id = `checkbox${index}`;
              checkbox.value = key;

              // Create the label for the checkbox
              const label = document.createElement("label");
              label.className = "form-check-label";
              label.htmlFor = `checkbox${index}`;
              label.textContent = key;

              // Append the checkbox and label to the list item
              listItem.appendChild(checkbox);
              listItem.appendChild(label);

              // Append the list item to the list
              checkboxList.appendChild(listItem);
            });

            // get all selected checkboxes
            function getSelectedCheckboxes() {
              return Array.from(checkboxList.querySelectorAll('input[type="checkbox"]:checked')).map((checkbox) => checkbox.value);
            }

            // Listen for changes to the checkboxes and console.log the selected values
            checkboxList.addEventListener('change', () => {
              selectedCheckboxes = getSelectedCheckboxes();
              newData = Object.fromEntries(
                Object.entries(jsonData).filter(([key]) => selectedCheckboxes.includes(key))
              );
              console.log(newData);
            });

            backgroundSelect.addEventListener("change", () => {
              let selectedValue = backgroundSelect.value;
              document.body.style.backgroundImage =
                "url('" + wallpaperData[selectedValue] + "')";
            });

            playMusicButton.addEventListener("click", () => {
              playSound(
                musicData,
                audioMusic,
                playMusicButton,
                firstClickMusic,
                "music"
              );
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
              playSound(newData, audioSound, playButton, firstClick, "sound");
              if (firstClick) {
                firstClick = false;
              }
            });

            // Listen for when the current audio ends, and play a new sound
            audioSound.addEventListener("ended", () => {
              // When the audio ends, get a new random sound and play it
              playNewSound(newData, audioSound, "sound");
            });
          }
        });
      }
    });
  }
});
