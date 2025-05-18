import { fetchWandAudio } from './data.js';

const wandAudio = await fetchWandAudio();

// Wand quiz data (parsed from Wand_questions.json)
const wandQuestions = {
    "1": {
        "Question": "To ensure we find the perfect wand for you, it's very important that you answer the following questions honestly. First of all, would you describe yourself as...",
        "Answers": ["Short", "Average", "Tall"]
    },
    "2": {
        "Question": "And your eyes...",
        "Answers": ["Dark brown / Black", "Brown", "Hazel", "Blue", "Blue / Grey", "Blue / Green", "Green", "Grey", "Other"]
    },
    "3": {
        "Question": "Was the day on which you were born...",
        "Answers": ["an even number", "an odd date"]
    },
    "4": {
        "Question": "Do you most pride yourself on your...",
        "Answers": ["Kindness", "Optimism", "Determination", "Resilience", "Imagination", "Intelligence", "Originality"]
    },
    "5": {
        "Question": "Travelling alone down a deserted road, you reach a crossroads. Do you continue...",
        "Answers": ["left towards the sea", "ahead towards the forest", "right towards the castle"]
    },
    "6": {
        "Question": "Do you most fear...",
        "Answers": ["Fire", "Darkness", "Isolation", "Small spaces", "Heights"]
    },
    "7": {
        "Question": "In a chest of magical artefacts, which would you choose...",
        "Answers": ["Ornate mirror", "Dusty bottle", "Golden key", "Silver dagger", "Bound scroll", "Glittering jewel", "Black glove"]
    }
};

// Wand selection data (parsed from Wand_Selection_final.xlsx)
const wandData = {
    cores: {
        "Dusty bottle": { "Darkness": "Unicorn", "Fire": "Unicorn", "Heights": "Unicorn", "Small spaces": "Unicorn", "Isolation": "Unicorn" },
        "Black glove": { "Darkness": "Dragon", "Fire": "Dragon", "Heights": "Dragon", "Small spaces": "Unicorn", "Isolation": "Unicorn" },
        "Golden key": { "Darkness": "Unicorn", "Fire": "Unicorn", "Heights": "Unicorn", "Small spaces": "Phoenix", "Isolation": "Unicorn" },
        "Bound scroll": { "Darkness": "Unicorn", "Fire": "Unicorn", "Heights": "Unicorn", "Small spaces": "Phoenix", "Isolation": "Unicorn" },
        "Glittering jewel": { "Darkness": "Unicorn", "Fire": "Unicorn", "Heights": "Unicorn", "Small spaces": "Phoenix", "Isolation": "Dragon" },
        "Silver dagger": { "Darkness": "Dragon", "Fire": "Dragon", "Heights": "Dragon", "Small spaces": "Dragon", "Isolation": "Phoenix" },
        "Ornate mirror": { "Darkness": "Unicorn", "Fire": "Unicorn", "Heights": "Unicorn", "Small spaces": "Dragon", "Isolation": "Dragon" }
    },
    lengths: {
        "Dusty bottle": { "Short": "10 1/2 in", "Average": "11 1/4 in", "Tall": "13 1/2 in" },
        "Black glove": { "Short": "9 1/2 in", "Average": "12 in", "Tall": "14 in" },
        "Golden key": { "Short": "11 in", "Average": "12 1/4 in", "Tall": "13 3/4 in" },
        "Bound scroll": { "Short": "10 in", "Average": "10 3/4 in", "Tall": "14 1/2 in" },
        "Glittering jewel": { "Short": "9 3/4 in", "Average": "11 3/4 in", "Tall": "13 1/4 in" },
        "Silver dagger": { "Short": "12 3/4 in", "Average": "12 1/2 in", "Tall": "13 in" },
        "Ornate mirror": { "Short": "10 1/4 in", "Average": "11 1/2 in", "Tall": "14 1/4 in" }
    },
    flexibilities: {
        "Determination": { "an even number": "unbending", "an odd date": "reasonably supple" },
        "Imagination": { "an even number": "surprisingly swishy", "an odd date": "slightly springy" },
        "Resilience": { "an even number": "rigid", "an odd date": "supple" },
        "Intelligence": { "an even number": "unyielding", "an odd date": "hard" },
        "Originality": { "an even number": "quite bendy", "an odd date": "brittle" },
        "Optimism": { "an even number": "solid", "an odd date": "pliant" },
        "Kindness": { "an even number": "slightly yielding", "an odd date": "quite flexible" }
    },
    woods: {
        "Dark brown / Black": {
            "Determination": { "left towards the sea": "Beech", "ahead towards the forest": "Ebony", "right towards the castle": "Aspen" },
            "Imagination": { "left towards the sea": "Sycamore", "ahead towards the forest": "English Oak", "right towards the castle": "Alder" },
            "Resilience": { "left towards the sea": "Larch", "ahead towards the forest": "Apple", "right towards the castle": "Pine" },
            "Intelligence": { "left towards the sea": "Ash", "ahead towards the forest": "Hazel", "right towards the castle": "Black Walnut" },
            "Originality": { "left towards the sea": "Acacia", "ahead towards the forest": "Cedar", "right towards the castle": "Redwood" },
            "Optimism": { "left towards the sea": "Laurel", "ahead towards the forest": "Spruce", "right towards the castle": "Hornbeam" },
            "Kindness": { "left towards the sea": "Silver Lime", "ahead towards the forest": "Rowan", "right towards the castle": "Vine" }
        },
        "Brown": {
            "Determination": { "left towards the sea": "Fir", "ahead towards the forest": "Yew", "right towards the castle": "Sycamore" },
            "Imagination": { "left towards the sea": "Cypress", "ahead towards the forest": "Cedar", "right towards the castle": "Spruce" },
            "Resilience": { "left towards the sea": "Laurel", "ahead towards the forest": "Rowan", "right towards the castle": "Maple" },
            "Intelligence": { "left towards the sea": "Redwood", "ahead towards the forest": "Dogwood", "right towards the castle": "Chestnut" },
            "Originality": { "left towards the sea": "Pine", "ahead towards the forest": "Hazel", "right towards the castle": "Beech" },
            "Optimism": { "left towards the sea": "Vine", "ahead towards the forest": "Apple", "right towards the castle": "Elm" },
            "Kindness": { "left towards the sea": "Acacia", "ahead towards the forest": "Pear", "right towards the castle": "Laurel" }
        },
        "Hazel": {
            "Determination": { "left towards the sea": "Cedar", "ahead towards the forest": "English Oak", "right towards the castle": "Hazel" },
            "Imagination": { "left towards the sea": "Dogwood", "ahead towards the forest": "Yew", "right towards the castle": "Hawthorn" },
            "Resilience": { "left towards the sea": "Vine", "ahead towards the forest": "Ebony", "right towards the castle": "Laurel" },
            "Intelligence": { "left towards the sea": "Elm", "ahead towards the forest": "Blackthorn", "right towards the castle": "Fir" },
            "Originality": { "left towards the sea": "Chestnut", "ahead towards the forest": "Sycamore", "right towards the castle": "Ash" },
            "Optimism": { "left towards the sea": "Redwood", "ahead towards the forest": "Pear", "right towards the castle": "Beech" },
            "Kindness": { "left towards the sea": "Cherry", "ahead towards the forest": "Red Oak", "right towards the castle": "Maple" }
        },
        "Blue": {
            "Determination": { "left towards the sea": "Hazel", "ahead towards the forest": "Cedar", "right towards the castle": "Beech" },
            "Imagination": { "left towards the sea": "Larch", "ahead towards the forest": "Holly", "right towards the castle": "Laurel" },
            "Resilience": { "left towards the sea": "Redwood", "ahead towards the forest": "Yew", "right towards the castle": "Walnut" },
            "Intelligence": { "left towards the sea": "Cypress", "ahead towards the forest": "Alder", "right towards the castle": "Elder" },
            "Originality": { "left towards the sea": "Elm", "ahead towards the forest": "Fir", "right towards the castle": "Sycamore" },
            "Optimism": { "left towards the sea": "Maple", "ahead towards the forest": "Rowan", "right towards the castle": "Pine" },
            "Kindness": { "left towards the sea": "Willow", "ahead towards the forest": "English Oak", "right towards the castle": "Hawthorn" }
        },
        "Blue / Grey": {
            "Determination": { "left towards the sea": "Sycamore", "ahead towards the forest": "Holly", "right towards the castle": "Cedar" },
            "Imagination": { "left towards the sea": "Rowan", "ahead towards the forest": "Pear", "right towards the castle": "Ebony" },
            "Resilience": { "left towards the sea": "Maple", "ahead towards the forest": "Cypress", "right towards the castle": "Poplar" },
            "Intelligence": { "left towards the sea": "Hawthorn", "ahead towards the forest": "Spruce", "right towards the castle": "Sycamore" },
            "Originality": { "left towards the sea": "Cherry", "ahead towards the forest": "Beech", "right towards the castle": "Elm" },
            "Optimism": { "left towards the sea": "Hornbeam", "ahead towards the forest": "Alder", "right towards the castle": "Ash" },
            "Kindness": { "left towards the sea": "Pear", "ahead towards the forest": "Larch", "right towards the castle": "Redwood" }
        },
        "Blue / Green": {
            "Determination": { "left towards the sea": "Pear", "ahead towards the forest": "Cypress", "right towards the castle": "Hawthorn" },
            "Imagination": { "left towards the sea": "Maple", "ahead towards the forest": "Alder", "right towards the castle": "Hazel" },
            "Resilience": { "left towards the sea": "Hornbeam", "ahead towards the forest": "English Oak", "right towards the castle": "Redwood" },
            "Intelligence": { "left towards the sea": "Laurel", "ahead towards the forest": "Ebony", "right towards the castle": "Pine" },
            "Originality": { "left towards the sea": "Larch", "ahead towards the forest": "Ash", "right towards the castle": "Alder" },
            "Optimism": { "left towards the sea": "Dogwood", "ahead towards the forest": "Cedar", "right towards the castle": "Fir" },
            "Kindness": { "left towards the sea": "Rowan", "ahead towards the forest": "Beech", "right towards the castle": "Spruce" }
        },
        "Green": {
            "Determination": { "left towards the sea": "Rowan", "ahead towards the forest": "Walnut", "right towards the castle": "Fir" },
            "Imagination": { "left towards the sea": "Hornbeam", "ahead towards the forest": "Apple", "right towards the castle": "Maple" },
            "Resilience": { "left towards the sea": "Dogwood", "ahead towards the forest": "Holly", "right towards the castle": "Black Walnut" },
            "Intelligence": { "left towards the sea": "Vine", "ahead towards the forest": "Larch", "right towards the castle": "Hazel" },
            "Originality": { "left towards the sea": "Beech", "ahead towards the forest": "Pine", "right towards the castle": "Spruce" },
            "Optimism": { "left towards the sea": "Elm", "ahead towards the forest": "Beech", "right towards the castle": "Cedar" },
            "Kindness": { "left towards the sea": "Cypress", "ahead towards the forest": "Ash", "right towards the castle": "Ebony" }
        },
        "Grey": {
            "Determination": { "left towards the sea": "Cypress", "ahead towards the forest": "Hornbeam", "right towards the castle": "Ash" },
            "Imagination": { "left towards the sea": "Silver Lime", "ahead towards the forest": "Beech", "right towards the castle": "Cedar" },
            "Resilience": { "left towards the sea": "Elm", "ahead towards the forest": "Fir", "right towards the castle": "Spruce" },
            "Intelligence": { "left towards the sea": "Pear", "ahead towards the forest": "Chestnut", "right towards the castle": "Ebony" },
            "Originality": { "left towards the sea": "Hawthorn", "ahead towards the forest": "Larch", "right towards the castle": "Maple" },
            "Optimism": { "left towards the sea": "Pine", "ahead towards the forest": "Dogwood", "right towards the castle": "Black Walnut" },
            "Kindness": { "left towards the sea": "Red Oak", "ahead towards the forest": "Alder", "right towards the castle": "Poplar" }
        },
        "Other": {
            "Determination": { "left towards the sea": "Red Oak", "ahead towards the forest": "Rowan", "right towards the castle": "Black Walnut" },
            "Imagination": { "left towards the sea": "Chestnut", "ahead towards the forest": "Fir", "right towards the castle": "Aspen" },
            "Resilience": { "left towards the sea": "Pine", "ahead towards the forest": "Dogwood", "right towards the castle": "Ebony" },
            "Intelligence": { "left towards the sea": "Maple", "ahead towards the forest": "Sycamore", "right towards the castle": "Poplar" },
            "Originality": { "left towards the sea": "Silver Lime", "ahead towards the forest": "Alder", "right towards the castle": "Cedar" },
            "Optimism": { "left towards the sea": "Ash", "ahead towards the forest": "Elm", "right towards the castle": "Walnut" },
            "Kindness": { "left towards the sea": "Larch", "ahead towards the forest": "Cypress", "right towards the castle": "Blackthorn" }
        }
    }
};

// Wand descriptions for result display
const wandDescriptions = {
    cores: {
        Dragon: "A wand with a dragon heartstring core, powerful and capable of flamboyant spells, often bonding with those of strong will.",
        Unicorn: "A wand with a unicorn hair core, consistent and loyal, producing magic that is pure and difficult to turn to the Dark Arts.",
        Phoenix: "A wand with a phoenix feather core, versatile and rare, capable of a wide range of magic and choosing those with great potential."
    },
    woods: {
        Acacia: "A subtle wood, suited for those with a delicate touch and nuanced magic.",
        Alder: "A helpful wood, ideal for non-verbal spells and loyal companions.",
        Apple: "A charming wood, often wielded by those with personal charisma and high ideals.",
        Ash: "A steadfast wood, clinging to its true owner and excelling in protective magic.",
        Aspen: "A duelist’s wood, known for its strength in charm work and revolutionary spirit.",
        Beech: "A wise wood, choosing those with experience and an open mind.",
        Blackthorn: "A warrior’s wood, suited for those who thrive in adversity.",
        BlackWalnut: "A perceptive wood, requiring a master with clear intentions and self-awareness.",
        Cedar: "A loyal wood, drawn to those with strength of character and loyalty.",
        Cherry: "A rare wood, granting exceptional power in charm work and requiring great control.",
        Chestnut: "A versatile wood, influenced by the core and the wielder’s personality.",
        Cypress: "A noble wood, often chosen by those destined for heroic deeds.",
        Dogwood: "A playful wood, seeking a witty and clever master.",
        Ebony: "A striking wood, suited for combative magic and those who hold fast to their beliefs.",
        Elder: "A rare and powerful wood, difficult to master and choosing those with exceptional destinies.",
        Elm: "An elegant wood, producing sophisticated magic for those with presence and dexterity.",
        EnglishOak: "A strong wood, loyal to those with courage and fidelity.",
        Fir: "A resilient wood, favoring those with focus and determination.",
        Hawthorn: "A complex wood, suited for healing and curses, and those with a conflicted nature.",
        Hazel: "A sensitive wood, reflecting its owner’s emotions and excelling in skilled hands.",
        Holly: "A protective wood, often choosing those with a need for overcoming anger or impulsiveness.",
        Hornbeam: "A refined wood, bonding closely with its owner’s moral vision.",
        Larch: "A hidden strength wood, unlocking talents in those with unexpected resilience.",
        Laurel: "An honorable wood, seeking those who avoid laziness and strive for glory.",
        Maple: "A traveler’s wood, thriving in the hands of the ambitious and adaptable.",
        Pear: "A warm wood, favoring those with generosity and wisdom.",
        Pine: "A durable wood, often choosing independent and mysterious wielders.",
        Poplar: "A reliable wood, producing consistent magic for those with clear moral vision.",
        RedOak: "A quick wood, ideal for those with fast reactions and adaptability.",
        Redwood: "A fortunate wood, drawn to those who seize opportunities and escape danger.",
        Rowan: "A protective wood, strong in defensive magic and favoring the pure-hearted.",
        SilverLime: "A mystical wood, popular among seers and those skilled in Legilimency.",
        Spruce: "A bold wood, requiring a firm hand and a humorous spirit.",
        Sycamore: "A curious wood, eager for new experiences and burning bright in adventurous hands.",
        Vine: "An intuitive wood, seeking those with hidden depths and vision.",
        Walnut: "A versatile wood, excelling in the hands of innovative and intelligent wielders.",
        Willow: "A healing wood, choosing those with great potential and modesty.",
        Yew: "A powerful wood, associated with legendary figures and transformative magic."
    },
    flexibilities: {
        unbending: "An unbending wand, reflecting a steadfast and resolute nature.",
        "reasonably supple": "A reasonably supple wand, balancing flexibility with strength.",
        "surprisingly swishy": "A surprisingly swishy wand, lively and adaptable to creative magic.",
        "slightly springy": "A slightly springy wand, responsive and dynamic in spellcasting.",
        rigid: "A rigid wand, suited for those with unwavering focus.",
        supple: "A supple wand, versatile and accommodating to its wielder’s needs.",
        unyielding: "An unyielding wand, strong-willed and precise in its magic.",
        hard: "A hard wand, durable and suited for intense spellwork.",
        "quite bendy": "A quite bendy wand, flexible and playful in its magic.",
        brittle: "A brittle wand, delicate yet capable of precise and intricate spells.",
        solid: "A solid wand, reliable and grounded in its magical performance.",
        pliant: "A pliant wand, highly adaptable to its owner’s intentions.",
        "slightly yielding": "A slightly yielding wand, offering a balance of control and flexibility.",
        "quite flexible": "A quite flexible wand, versatile and responsive to a wide range of magic."
    }
};

let quizData = [];
let currentQuestionIndex = 0;
let userAnswers = {};

// Function to play audio sequentially using event listeners
function playAudioSequence(audioUrls, message, callback) {
    const quizContainer = document.getElementById('wand-quiz');
    const progressContainer = document.getElementById('wand-progress');
    const resultContainer = document.getElementById('wand-result');

    // Disable interaction and show message
    quizContainer.classList.add('pointer-events-none', 'opacity-50');
    progressContainer.innerHTML = `<p class="text-yellow-200">${message}</p>`;
    resultContainer.innerHTML = '';

    let current = 0;
    const audio = new Audio();

    function playNext() {
        if (current >= audioUrls.length) {
            // Re-enable interaction
            quizContainer.classList.remove('pointer-events-none', 'opacity-50');
            audio.pause(); // Ensure audio is stopped
            callback();
            return;
        }

        audio.src = audioUrls[current];
        audio.load();
        console.log("Attempting to play:", audioUrls[current]);
        audio.play().then(() => {
            console.log("Playing:", audioUrls[current]);
        }).catch(error => {
            console.error(`Playback failed for ${audioUrls[current]}:`, error);
            current++;
            playNext(); // Skip to next on error
        });

        audio.onended = () => {
            current++;
            playNext();
        };

        audio.onerror = () => {
            console.error(`Error loading audio: ${audioUrls[current]}`);
            current++;
            playNext(); // Skip to next on error
        };
    }

    playNext();
}

// Function to get a random audio from an array
function getRandomAudio(audioOptions) {
    if (Array.isArray(audioOptions)) {
        return audioOptions[Math.floor(Math.random() * audioOptions.length)];
    }
    return audioOptions;
}

async function loadQuizData() {
    try {
        // Load all questions from wandQuestions
        quizData = Object.values(wandQuestions).map(q => ({
            question: q.Question,
            answers: q.Answers.map(text => ({ text }))
        }));
    } catch (error) {
        console.error("Failed to load wand quiz data:", error);
        // Fallback to a single question
        quizData = [
            {
                question: "What quality do you value most in yourself?",
                answers: [
                    { text: "Determination" },
                    { text: "Imagination" },
                    { text: "Resilience" },
                    { text: "Intelligence" },
                    { text: "Originality" },
                    { text: "Optimism" },
                    { text: "Kindness" }
                ]
            }
        ];
    }
}

function startQuiz() {
    const quizContainer = document.getElementById('wand-quiz');
    quizContainer.classList.remove('hidden');
    currentQuestionIndex = 0;
    userAnswers = {
        height: null,
        eyeColor: null,
        birthDate: null,
        pride: null,
        path: null,
        fear: null,
        artefact: null
    };

    // Play Greetings audio
    const greetingUrls = [
        wandAudio.Greetings["Ollivander presentation"],
        wandAudio.Greetings["Pleasure to meet you"],
        wandAudio.Greetings["Let's get started"]
    ];
    playAudioSequence(greetingUrls, "Greetings from Ollivander", () => {
        loadQuizData().then(() => {
            renderQuiz();
        });
    });
}

function renderQuiz() {
    const quizContainer = document.getElementById('wand-quiz');
    const progressContainer = document.getElementById('wand-progress');
    const resultContainer = document.getElementById('wand-result');

    if (currentQuestionIndex >= quizData.length) {
        // Play Found audio before showing result
        const foundUrls = [
            getRandomAudio([
                wandAudio.Found["There you are"],
                wandAudio.Found["You might be the one"]
            ])
        ];
        playAudioSequence(foundUrls, "The wand is choosing...", () => {
            showResult();
        });
        return;
    }

    // Play Selection audio after the third question (index 2)
    if (currentQuestionIndex === 3) {
        const selectionUrls = [
            getRandomAudio(wandAudio.Selection.Hesiation),
            getRandomAudio(wandAudio.Selection["Try this"]),
            wandAudio.Selection["Swish it!"],
            getRandomAudio(wandAudio.Selection["Oh dear"]),
            getRandomAudio(wandAudio.Selection["This isn't a good match"]),
            wandAudio.Selection["Dont't worry"]
        ];
        playAudioSequence(selectionUrls, "Selecting your wand...", () => {
            displayQuestion();
        });
    } else {
        displayQuestion();
    }
}

function displayQuestion() {
    const quizContainer = document.getElementById('wand-quiz');
    const progressContainer = document.getElementById('wand-progress');
    const resultContainer = document.getElementById('wand-result');

    const questionData = quizData[currentQuestionIndex];
    quizContainer.innerHTML = `
        <h3 class="text-xl font-harry-potter text-yellow-300 mb-4">${questionData.question}</h3>
        <div class="grid grid-cols-1 gap-2">
            ${questionData.answers
                .map(
                    (answer, index) => `
                    <button class="wand-quiz-answer bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all p-3" data-index="${index}">
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
    document.querySelectorAll('.wand-quiz-answer').forEach(button => {
        button.addEventListener('click', () => {
            const answerIndex = parseInt(button.dataset.index);
            const answerText = questionData.answers[answerIndex].text;
            // Store answer based on question index
            switch (currentQuestionIndex) {
                case 0:
                    userAnswers.height = answerText;
                    break;
                case 1:
                    userAnswers.eyeColor = answerText;
                    break;
                case 2:
                    userAnswers.birthDate = answerText;
                    break;
                case 3:
                    userAnswers.pride = answerText;
                    break;
                case 4:
                    userAnswers.path = answerText;
                    break;
                case 5:
                    userAnswers.fear = answerText;
                    break;
                case 6:
                    userAnswers.artefact = answerText;
                    break;
            }
            console.log(`Answer for question ${currentQuestionIndex + 1}:`, answerText);
            currentQuestionIndex++;
            renderQuiz();
        });
    });
}

function showResult() {
    const quizContainer = document.getElementById('wand-quiz');
    const progressContainer = document.getElementById('wand-progress');
    const resultContainer = document.getElementById('wand-result');

    // Determine wand attributes
    const artefact = userAnswers.artefact || "Ornate mirror";
    const fear = userAnswers.fear || "Darkness";
    const height = userAnswers.height || "Average";
    const pride = userAnswers.pride || "Determination";
    const birthDate = userAnswers.birthDate || "an even number";
    const eyeColor = userAnswers.eyeColor || "Brown";
    const path = userAnswers.path || "left towards the sea";

    console.log("User answers:", userAnswers);

    const core = wandData.cores[artefact][fear] || "Unicorn";
    const length = wandData.lengths[artefact][height] || "11 in";
    const flexibility = wandData.flexibilities[pride][birthDate] || "reasonably supple";
    const wood = wandData.woods[eyeColor][pride][path] || "Beech";

    console.log("Wand attributes:", { core, length, flexibility, wood });

    // Construct wand description
    const wandDescription = `
        ${wood} wood, ${core} core, ${length}, ${flexibility}.
        <br><br>
        <strong>Wood:</strong> ${wandDescriptions.woods[wood.replace(/\s/g, '')] || "A fine wood, suited to a unique wizard."}<br>
        <strong>Core:</strong> ${wandDescriptions.cores[core] || "A reliable core for versatile magic."}<br>
        <strong>Flexibility:</strong> ${wandDescriptions.flexibilities[flexibility] || "A balanced flexibility for varied spellcasting."}
    `;

    quizContainer.innerHTML = '';
    quizContainer.classList.add('hidden');
    progressContainer.innerHTML = '';

    // Play Characteristics audio based on core
    const coreAudio = wandAudio.Characteristics[core];
    playAudioSequence([coreAudio], `Discovering your wand's core: ${core}`, () => {
        resultContainer.innerHTML = `
            <h3 class="text-2xl font-harry-potter text-yellow-400 mb-4">The Wand Chooses You!</h3>
            <img src="./assets/wand.png" alt="Wand" class="w-32 h-32 object-contain rounded-lg mb-4 mx-auto" />
            <p class="text-lg text-yellow-200 mb-4">${wandDescription}</p>
            <button id="restart-wand-quiz" class="bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all px-4 py-2">Try Again</button>
        `;
        document.getElementById('restart-wand-quiz').addEventListener('click', startQuiz);
    });
}

export { startQuiz };