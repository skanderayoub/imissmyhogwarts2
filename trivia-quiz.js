async function loadQuizData() {
    try {
        // Fetch the JSON file
        const response = await fetch('./trivia_updated.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const triviaQuestions = await response.json();

        // Filter questions by difficulty
        const easyQuestions = triviaQuestions.questions.filter(q => q.difficulty === 'Easy');
        const moderateQuestions = triviaQuestions.questions.filter(q => q.difficulty === 'Moderate');
        const hardQuestions = triviaQuestions.questions.filter(q => q.difficulty === 'Hard');

        // Select questions: 10 Easy, 15 Moderate, 5 Hard
        const selectedEasy = easyQuestions.sort(() => Math.random() - 0.5).slice(0, Math.min(10, easyQuestions.length));
        const selectedModerate = moderateQuestions.sort(() => Math.random() - 0.5).slice(0, Math.min(15, moderateQuestions.length));
        const selectedHard = hardQuestions.sort(() => Math.random() - 0.5).slice(0, Math.min(5, hardQuestions.length));

        // Combine and shuffle questions
        quizData = [...selectedEasy, ...selectedModerate, ...selectedHard].sort(() => Math.random() - 0.5).slice(0, totalQuestions);

        // Map to quiz format
        quizData = quizData.map(q => ({
            id: q.id,
            question: q.question,
            answers: q.options.map(text => ({ text })),
            correctAnswer: q.correct_answer,
            category: q.category,
            difficulty: q.difficulty
        }));
    } catch (error) {
        console.error('Failed to load trivia quiz data:', error);
        // Fallback to sample questions
        quizData = [
            {
                id: 1,
                question: "What is the name of Harry Potter's owl?",
                answers: [{ text: "Hedwig" }, { text: "Errol" }, { text: "Pigwidgeon" }],
                correctAnswer: "Hedwig",
                category: "Characters",
                difficulty: "Easy"
            },
            {
                id: 2,
                question: "Which spell is used to unlock doors?",
                answers: [{ text: "Alohomora" }, { text: "Lumos" }, { text: "Accio" }],
                correctAnswer: "Alohomora",
                category: "Spells",
                difficulty: "Easy"
            }
        ];
    }
}

let quizData = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
const totalQuestions = 30;
const pointsPerDifficulty = {
    Easy: 1,
    Moderate: 2,
    Hard: 3
};

function startQuiz() {
    const quizContainer = document.getElementById('trivia-quiz');
    const resultContainer = document.getElementById('trivia-result');
    const startButton = document.getElementById('start-trivia-quiz');
    const triviaTitle = document.getElementById('trivia-title');
    triviaTitle.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    startButton.classList.add('hidden');
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;

    loadQuizData().then(() => {
        renderInstructions();
    });
}

function renderInstructions() {
    const quizContainer = document.getElementById('trivia-quiz');
    const progressContainer = document.getElementById('trivia-progress');
    const resultContainer = document.getElementById('trivia-result');

    quizContainer.innerHTML = `
        <h3 class="text-xl font-harry-potter text-yellow-300 mb-4">Are You a True Potterhead?</h3>
        <p class="text-lg text-yellow-200 mb-4">
            Test your Harry Potter knowledge with <strong>30 questions</strong> from the wizarding world! 
            The quiz includes <strong>10 Easy</strong>, <strong>15 Moderate</strong>, and <strong>5 Hard</strong> questions.
            Earn points for each correct answer: <strong>1 point</strong> for Easy, <strong>2 points</strong> for Moderate, and <strong>3 points</strong> for Hard.
            Use the Lore section to brush up if needed. Ready to prove you're the ultimate fan?
        </p>
        <div class="flex justify-center">
            <button id="begin-trivia" class="btn-normal bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all px-4 py-2 font-harry-potter text-lg">
                Begin Quiz
            </button>
        </div>
    `;
    quizContainer.classList.add('animate-fadeIn');
    progressContainer.innerHTML = '';
    resultContainer.innerHTML = '';

    document.getElementById('begin-trivia').addEventListener('click', () => {
        renderQuiz();
    });
}

function renderQuiz() {
    const quizContainer = document.getElementById('trivia-quiz');
    const progressContainer = document.getElementById('trivia-progress');
    const resultContainer = document.getElementById('trivia-result');

    if (currentQuestionIndex >= quizData.length) {
        showResult();
        return;
    }

    const questionData = quizData[currentQuestionIndex];
    quizContainer.innerHTML = `
        <h3 class="text-xl font-harry-potter text-yellow-300 mb-4">${questionData.question} (${questionData.difficulty})</h3>
        <div class="grid grid-cols-1 gap-2">
            ${questionData.answers.map((answer, index) => `
                <button class="quiz-answer bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all p-3" data-index="${index}">
                    ${answer.text}
                </button>
            `).join('')}
        </div>
    `;

    // Apply fade-in animation
    quizContainer.classList.remove('animate-fadeIn');
    void quizContainer.offsetWidth; // Trigger reflow to restart animation
    quizContainer.classList.add('animate-fadeIn');

    // Update progress
    progressContainer.innerHTML = `
        <p class="text-yellow-200">Question ${currentQuestionIndex + 1} of ${quizData.length}</p>
        <div class="w-full bg-gray-700 rounded-full h-2">
            <div class="bg-yellow-400 h-2 rounded-full" style="width: ${((currentQuestionIndex + 1) / quizData.length) * 100}%"></div>
        </div>
    `;

    // Hide result
    resultContainer.innerHTML = '';

    // Add event listeners to answer buttons
    document.querySelectorAll('.quiz-answer').forEach(button => {
        button.addEventListener('click', () => {
            const answerIndex = parseInt(button.dataset.index);
            const answerText = questionData.answers[answerIndex].text;
            const isCorrect = answerText === questionData.correctAnswer;
            if (isCorrect) {
                score += pointsPerDifficulty[questionData.difficulty];
            }
            userAnswers.push({
                question: questionData.question,
                selectedAnswer: answerText,
                correctAnswer: questionData.correctAnswer,
                isCorrect,
                difficulty: questionData.difficulty,
                pointsEarned: isCorrect ? pointsPerDifficulty[questionData.difficulty] : 0
            });
            console.log(`Answer for question ${currentQuestionIndex + 1}: ${answerText}, Correct: ${isCorrect}, Points: ${isCorrect ? pointsPerDifficulty[questionData.difficulty] : 0}`);
            currentQuestionIndex++;
            renderQuiz();
        });
    });
}

function showResult() {
    const quizContainer = document.getElementById('trivia-quiz');
    const progressContainer = document.getElementById('trivia-progress');
    const resultContainer = document.getElementById('trivia-result');
    quizContainer.classList.add('hidden');

    const maxPossibleScore = quizData.reduce((total, q) => total + pointsPerDifficulty[q.difficulty], 0);
    const percentage = ((score / maxPossibleScore) * 100).toFixed(2);
    const easyCorrect = userAnswers.filter(a => a.isCorrect && a.difficulty === 'Easy').length;
    const moderateCorrect = userAnswers.filter(a => a.isCorrect && a.difficulty === 'Moderate').length;
    const hardCorrect = userAnswers.filter(a => a.isCorrect && a.difficulty === 'Hard').length;
    const easyTotal = quizData.filter(q => q.difficulty === 'Easy').length;
    const moderateTotal = quizData.filter(q => q.difficulty === 'Moderate').length;
    const hardTotal = quizData.filter(q => q.difficulty === 'Hard').length;

    quizContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
        <h3 class="text-2xl font-harry-potter text-yellow-400 mb-4">Your Wizarding Knowledge Revealed!</h3>
        <p class="text-lg text-yellow-200 mb-4">
            You scored <span class="font-bold">${score}</span> out of <span class="font-bold">${maxPossibleScore}</span> points (${percentage}%)
        </p>
        <div class="text-sm text-yellow-200 space-y-2 mb-4">
            <p><strong>Easy Questions:</strong> ${easyCorrect}/${easyTotal} correct (Earned ${easyCorrect * pointsPerDifficulty.Easy} points)</p>
            <p><strong>Moderate Questions:</strong> ${moderateCorrect}/${moderateTotal} correct (Earned ${moderateCorrect * pointsPerDifficulty.Moderate} points)</p>
            <p><strong>Hard Questions:</strong> ${hardCorrect}/${hardTotal} correct (Earned ${hardCorrect * pointsPerDifficulty.Hard} points)</p>
        </div>
        <div class="flex justify-center space-x-4">
            <button id="detailed-stats" class="btn-normal bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all px-4 py-2">
                View Detailed Stats
            </button>
            <button id="restart-trivia-quiz" class="btn-normal bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all px-4 py-2">
                Try Again
            </button>
        </div>
    `;
    resultContainer.classList.add('animate-fadeIn');

    document.getElementById('restart-trivia-quiz').addEventListener('click', startQuiz);
    document.getElementById('detailed-stats').addEventListener('click', showDetailedStats);
}

function showDetailedStats() {
    const quizContainer = document.getElementById('trivia-quiz');
    const progressContainer = document.getElementById('trivia-progress');
    const resultContainer = document.getElementById('trivia-result');

    quizContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    resultContainer.innerHTML = `
        <h3 class="text-2xl font-harry-potter text-yellow-400 mb-4">Detailed Trivia Results</h3>
        <div style="overflow-x: auto; overflow-y: auto; max-height: 400px; scrollbar-width: thin; scrollbar-color: var(--primary-color) rgba(0, 0, 0, 0.3);">
            <table class="w-full text-yellow-200 text-sm">
                <thead>
                    <tr class="bg-gray-800 bg-opacity-70">
                        <th class="p-2 text-left">Question</th>
                        <th class="p-2 text-left">Your Answer</th>
                        <th class="p-2 text-left">Correct Answer</th>
                        <th class="p-2 text-left">Difficulty</th>
                        <th class="p-2 text-left">Result</th>
                    </tr>
                </thead>
                <tbody>
                    ${userAnswers.map((answer, index) => `
                        <tr class="${answer.isCorrect ? 'bg-green-900' : 'bg-red-900'} bg-opacity-30">
                            <td class="p-2">${answer.question}</td>
                            <td class="p-2">${answer.selectedAnswer}</td>
                            <td class="p-2">${answer.correctAnswer}</td>
                            <td class="p-2">${answer.difficulty}</td>
                            <td class="p-2">${answer.isCorrect ? `Correct (+${answer.pointsEarned} pts)` : 'Incorrect'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="flex justify-center mt-4">
            <button id="back-to-results" class="btn-normal bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover-transition transition-all px-4 py-2">
                Back to Results
            </button>
        </div>
    `;
    resultContainer.classList.add('animate-fadeIn');

    document.getElementById('back-to-results').addEventListener('click', showResult);
}

export { startQuiz };