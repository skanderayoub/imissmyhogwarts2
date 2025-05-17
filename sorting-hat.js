const quizData = [
    {
        question: "What quality do you value most in yourself?",
        answers: [
            { text: "Courage and bravery", house: "Gryffindor", score: 1 },
            { text: "Loyalty and hard work", house: "Hufflepuff", score: 1 },
            { text: "Intelligence and creativity", house: "Ravenclaw", score: 1 },
            { text: "Ambition and cunning", house: "Slytherin", score: 1 },
        ],
    },
    {
        question: "How would you face a dangerous situation?",
        answers: [
            { text: "Charge in boldly", house: "Gryffindor", score: 1 },
            { text: "Protect others first", house: "Hufflepuff", score: 1 },
            { text: "Analyze and plan", house: "Ravenclaw", score: 1 },
            { text: "Use strategy to gain advantage", house: "Slytherin", score: 1 },
        ],
    },
    {
        question: "What do you seek in a friend?",
        answers: [
            { text: "Someone daring and adventurous", house: "Gryffindor", score: 1 },
            { text: "Someone kind and trustworthy", house: "Hufflepuff", score: 1 },
            { text: "Someone witty and knowledgeable", house: "Ravenclaw", score: 1 },
            { text: "Someone resourceful and determined", house: "Slytherin", score: 1 },
        ],
    },
    {
        question: "What’s your approach to achieving your goals?",
        answers: [
            { text: "Face challenges head-on", house: "Gryffindor", score: 1 },
            { text: "Work steadily and support others", house: "Hufflepuff", score: 1 },
            { text: "Research and innovate", house: "Ravenclaw", score: 1 },
            { text: "Plan carefully and seize opportunities", house: "Slytherin", score: 1 },
        ],
    },
    {
        question: "Which magical creature would you befriend?",
        answers: [
            { text: "Phoenix (bold and loyal)", house: "Gryffindor", score: 1 },
            { text: "Badger (gentle and persistent)", house: "Hufflepuff", score: 1 },
            { text: "Raven (wise and observant)", house: "Ravenclaw", score: 1 },
            { text: "Serpent (clever and elusive)", house: "Slytherin", score: 1 },
        ],
    },
];

const houseDescriptions = {
    Gryffindor: {
        description: "You belong to Gryffindor, where dwell the brave at heart! Your courage, chivalry, and determination shine, making you a natural leader in the face of adversity.",
        crest: "./assets/crests/Gryffindor.png",
        sound: ["https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10027.wav",
            "https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10038.wav",
            "https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10047.wav"
        ],

    },
    Hufflepuff: {
        description: "You are a Hufflepuff, valued for your loyalty, patience, and hard work! Your kindness and dedication make you a true friend and a steadfast ally.",
        crest: "./assets/crests/Hufflepuff.png",
        sound: ["https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10029.wav",
            "https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10036.wav",
            "https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10049.wav"
        ],
    },
    Ravenclaw: {
        description: "Welcome to Ravenclaw, home of wit and learning! Your intelligence, creativity, and curiosity drive you to seek knowledge and embrace new ideas.",
        crest: "./assets/crests/Ravenclaw.png",
        sound: ["https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10028.wav",
            "https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10037.wav",
            "https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10048.wav"
        ],
    },
    Slytherin: {
        description: "Slytherin is your home, where ambition and cunning reign! Your resourcefulness and determination ensure you achieve your goals with strategic flair.",
        crest: "./assets/crests/Slytherin.png",
        sound: ["https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10030.wav",
            "https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10035.wav",
            "https://archive.org/download/hogwarts-legacy-voice-files/Sorting%20Hat.rar/Sorting%20Hat%2Fsortinghat_10050.wav"
        ],
    },
};

let currentQuestionIndex = 0;
let scores = {
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
};

function startQuiz() {
    currentQuestionIndex = 0;
    scores = { Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0 };
    renderQuiz();
}

function renderQuiz() {
    const quizContainer = document.getElementById('sorting-hat-quiz');
    const progressContainer = document.getElementById('quiz-progress');
    const resultContainer = document.getElementById('quiz-result');

    if (currentQuestionIndex >= quizData.length) {
        showResult();
        return;
    }

    const questionData = quizData[currentQuestionIndex];
    quizContainer.innerHTML = `
        <h3 class="text-xl font-harry-potter text-yellow-400 mb-4">${questionData.question}</h3>
        <div class="grid grid-cols-1 gap-2">
            ${questionData.answers
            .map(
                (answer, index) => `
                    <button class="quiz-answer bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all p-3 text-left" data-index="${index}">
                        ${answer.text}
                    </button>
                `
            )
            .join('')}
        </div>
    `;

    // Update progress
    progressContainer.innerHTML = `
        <p class="text-yellow-200">Question ${currentQuestionIndex + 1} of ${quizData.length}</p>
        <div class="w-full bg-gray-700 rounded-full h-2">
            <div class="bg-yellow-400 h-2 rounded-full" style="width: ${(currentQuestionIndex + 1) / quizData.length * 100}%"></div>
        </div>
    `;

    // Hide result
    resultContainer.innerHTML = '';

    // Add event listeners to answer buttons
    document.querySelectorAll('.quiz-answer').forEach(button => {
        button.addEventListener('click', () => {
            const answerIndex = parseInt(button.dataset.index);
            const answer = questionData.answers[answerIndex];
            scores[answer.house] += answer.score;
            currentQuestionIndex++;
            renderQuiz();
        });
    });
}

function showResult() {
    const quizContainer = document.getElementById('sorting-hat-quiz');
    const progressContainer = document.getElementById('quiz-progress');
    const resultContainer = document.getElementById('quiz-result');

    // Determine the house with the highest score
    let maxScore = 0;
    let selectedHouse = 'Gryffindor'; // Default in case of tie
    for (const [house, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            selectedHouse = house;
        } else if (score === maxScore && score > 0) {
            // In case of a tie, randomly choose one
            selectedHouse = Math.random() < 0.5 ? selectedHouse : house;
        }
    }

    const houseInfo = houseDescriptions[selectedHouse];
    quizContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    resultContainer.innerHTML = `
        <h3 class="text-2xl font-harry-potter text-yellow-400 mb-4">The Sorting Hat Has Spoken!</h3>
        <img src="${houseInfo.crest}" alt="${selectedHouse} crest" class="w-32 h-32 object-contain rounded-lg mb-4 mx-auto" />
        <p class="text-lg text-yellow-200 mb-4">${houseInfo.description}</p>
        <button id="restart-quiz" class="bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all px-4 py-2">Try Again</button>
    `;
    // Play random sound from the selected house
    const audio = new Audio();
    const randomSound = houseInfo.sound[Math.floor(Math.random() * houseInfo.sound.length)];
    audio.src = randomSound;
    audio.play();

    document.getElementById('restart-quiz').addEventListener('click', startQuiz);
}

export { startQuiz };