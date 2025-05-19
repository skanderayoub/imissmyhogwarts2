# I Miss My Hogwarts

Welcome to **I Miss My Hogwarts**, an immersive web application that brings the magic of the Harry Potter universe to life! Explore iconic characters, spells, and potions, listen to enchanting music and character voices, and test your wizarding knowledge with interactive quizzes. This project is hosted on GitHub Pages at [https://skanderayoub.github.io/imissmyhogwarts2/](https://skanderayoub.github.io/imissmyhogwarts2/).

## Table of Contents
- [I Miss My Hogwarts](#i-miss-my-hogwarts)
  - [Table of Contents](#table-of-contents)
  - [Inspiration and Credits](#inspiration-and-credits)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)

## Inspiration and Credits
This project is inspired by the "I Miss My..." series of websites, which create nostalgic and immersive experiences for various fictional universes. Notable inspirations include:
- **[I Miss My Library](https://www.imissmylibrary.com/)**
- **[I Miss My Cafe](https://imissmycafe.com/)**
- **[I Miss The Office](https://imisstheoffice.eu/)**

The original idea for "I Miss My Hogwarts" was conceived by my friend **Ela**, who envisioned a magical space to relive the Hogwarts experience. The project builds on this concept with a unique blend of lore, quizzes, and audio elements tailored to the Harry Potter universe.

**Data Sources**:
- **Lore Data**: Sourced from [PotterDB](https://potterdb.com/), providing comprehensive details on characters, spells, and potions.
- **Voice Data**: Obtained from [Hogwarts Legacy Voice Files](https://archive.org/download/hogwarts-legacy-voice-files) on Archive.org, used for character voice playback.
- **Music Data**: *Hogwarts Legacy (Study Themes from the Original Video Game Soundtrack)* retrieved from [vgmtreasurechest](https://eta.vgmtreasurechest.com/) and *Hogwarts Legacy (Original Video Game Soundtrack)* from [vgmsite](https://kappa.vgmsite.com/)

## Features
- **Themed Interface**: Switch between Hogwarts house themes (Gryffindor, Hufflepuff, Ravenclaw, Slytherin, Hogwarts) with smooth transitions for a magical experience.
- **Interactive Quizzes**:
  - **Sorting Hat Quiz**: Discover your Hogwarts house with thousands of question combinations.
  - **Patronus Quiz**: Find your magical guardian based on mystical questions.
  - **Wand Quiz**: Determine the wand that chooses you, tailored to your magical essence.
  - **Trivia Quiz**: Test your Harry Potter knowledge with questions across Easy, Moderate, and Hard difficulties.
- **Lore Exploration**: Browse detailed information about characters, spells, and potions, with filtering and search capabilities.
- **Audio Experience**:
  - Play character voices and funny audio clips from the Harry Potter universe.
  - Enjoy a curated selection of wizarding world music with play, pause, shuffle, and volume controls.
- **Customizable Ambiance**: Change background images to set the mood, with smooth transitions and responsive scaling.
- **Responsive Design**: Optimized for both desktop and mobile devices, ensuring a seamless experience.

## Technologies
- **HTML5**: Structure for the web application.
- **CSS3**: Styling with Tailwind CSS, custom fonts (Harry Potter, Cinzel), and theme-based custom properties.
- **JavaScript (ES Modules)**: Dynamic functionality, including data fetching, audio playback, and quiz logic.
- **Tailwind CSS**: Utility-first CSS framework for responsive and modern styling.
- **External Libraries**:
  - XLSX (v0.18.5) for handling data.
  - Google Fonts for Cinzel font.
- **GitHub Pages**: Hosting the static site.

## Setup
To run this project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/skanderayoub/imissmyhogwarts2.git
   cd imissmyhogwarts2
   ```

2. **Install Dependencies**:
   No additional dependencies are required, as the project uses CDN-hosted libraries (Tailwind CSS, XLSX). Ensure you have the following assets in the `assets/` directory:
   - `HARRYP__.ttf` (custom font)
   - Background images (e.g., `1303125.jpg`, `phone/dark.png`)
   - Crest images (e.g., `Gryffindor.png`, `Hufflepuff.png`, etc.)
   - Particle effect image (`particles.png`)

3. **Ensure Data Availability**:
   The project relies on external data files (e.g., `data.js` for characters, spells, potions, audio, etc.). Ensure these are correctly set up or hosted, as they are fetched dynamically. Lore data is sourced from [PotterDB](https://potterdb.com/), and voice data from [Hogwarts Legacy Voice Files](https://archive.org/download/hogwarts-legacy-voice-files).

## Usage
- **Navigate Tabs**: Use the top navigation buttons (Voices, Music, Ambiance, Lore & Games) to explore different sections.
- **Change Themes**: Select a Hogwarts house theme from the dropdown to customize the UI's colors and gradients.
- **Explore Lore**: Filter and search characters, spells, and potions in the "Lore" section to view detailed information.
- **Play Quizzes**: Access the "Games" section to start the Sorting Hat, Patronus, Wand, or Trivia quizzes.
- **Control Audio**: Use the audio controls to play character voices, funny audio clips, or music tracks, with options to adjust volume, mute, or shuffle.
- **Set Ambiance**: Choose a background image from the dropdown to change the site's visual ambiance.

## Project Structure
```
imissmyhogwarts2/
├── assets/
│   ├── crests/                # House crest images
│   ├── phone/                 # Mobile-specific backgrounds
│   ├── HARRYP__.ttf           # Custom Harry Potter font
│   ├── particles.png          # Particle effect for background
│   └── ....jpg                # Desktop-specific backgrounds
├── index.html                 # Main HTML file
├── style.css                  # Custom CSS with Tailwind and theme styles
├── main.js                    # Main JavaScript with module imports
├── data.js                    # Data fetching logic (assumed)
├── sorting-hat.js             # Sorting Hat quiz logic (assumed)
├── patronus.js                # Patronus quiz logic (assumed)
├── wand-quiz.js               # Wand quiz logic (assumed)
├── trivia-quiz.js             # Trivia quiz logic (assumed)
├── audio.js                   # Audio playback logic (assumed)
├── ui.js                      # UI effects (e.g., mouse effects) (assumed)
└── README.md                  # Project documentation
```

## Contributing
Contributions are not open for now
