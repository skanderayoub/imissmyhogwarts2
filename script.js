function playSound() {
    let audio = document.getElementById("audio");
    //audio.src = "/assets/Abraham Ronen/abrahamronen_10630.wav";
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

fetch('./paths.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // Handle the JSON data here
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
