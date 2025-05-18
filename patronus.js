export function startPatronusQuiz(patronusData) {
    const quizContainer = document.getElementById('patronus-quiz');
    const progressContainer = document.getElementById('patronus-progress');
    const resultContainer = document.getElementById('patronus-result');
    
    let currentSet = 1;
    let colorSequence = [];
    let selectedAnswers = [];

    function getAnswerOptions(setNumber) {
        const setData = patronusData.Questions[setNumber.toString()];
        if (!setData) return [];

        // Get all category keys (e.g., ["1", "2", "3", "4", "5"])
        const categories = Object.keys(setData);
        if (categories.length === 0) return [];

        // Randomly select one category
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryData = setData[randomCategory];

        // Collect answers and their colors from the selected category
        const allAnswers = Object.entries(categoryData).map(([answer, color]) => ({
            answer,
            color
        }));

        return allAnswers;
    }

    function findMatchingPatronuses(colors) {
        const colorKey = colors.join(' ');
        const matches = patronusData.Questions.Answers[colorKey];
        if (!matches) return [];
        return Array.isArray(matches) ? matches : [matches];
    }

    function renderQuestion(setNumber) {
        quizContainer.innerHTML = '';
        resultContainer.innerHTML = '';
        quizContainer.classList.remove('hidden');

        // Get answer options for a random category in the current set
        const options = getAnswerOptions(setNumber);
        if (options.length === 0) {
            // Skip to next set if no answers available
            currentSet++;
            if (currentSet <= 7) {
                renderQuestion(currentSet);
            } else {
                showFinalResult();
            }
            return;
        }

        // Update progress bar
        progressContainer.innerHTML = `
            <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-yellow-400 h-2 rounded-full" style="width: ${(setNumber / 7) * 100}%"></div>
            </div>
        `;

        // Display the question and answer options
        quizContainer.innerHTML = `
            <p class="text-lg text-yellow-300 mb-4 font-harry-potter">Choose a mystical word
            </p>
            <div class="grid grid-cols-1 gap-2">
            ${options.map(option => `
                <button class="answer-btn px-4 py-2 bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover:bg-gray-700 transition-all" data-answer="${option.answer}" data-color="${option.color}">
                ${option.answer}
                </button>
            `).join('')}
        </div>
            <p class="text-yellow-200 mb-4">Chosen answers so far:</p>
            <ul class="list-disc list-inside text-yellow-200 mb-4">
            ${selectedAnswers.map((ans, idx) => `<li>Set ${idx + 1}: ${ans}</li>`).join('')}
            </ul>
        `;

        // Add event listeners to answer buttons
        document.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.dataset.answer;
                const color = button.dataset.color;

                // Store the answer and color
                selectedAnswers.push(answer);
                colorSequence.push(color);

                // Check for matching Patronuses
                const matches = findMatchingPatronuses(colorSequence);
                if (matches.length === 1) {
                    // Unique Patronus found
                    showFinalResult(matches[0]);
                    return;
                }

                // Proceed to next question
                currentSet++;
                if (currentSet <= 7) {
                    renderQuestion(currentSet);
                } else {
                    showFinalResult(matches.length > 0 ? matches : null);                    
                }
            });
        });
    }

    function showFinalResult(patronus = null) {
        quizContainer.innerHTML = '';
        progressContainer.innerHTML = '';
        quizContainer.classList.add('hidden');

        if (patronus) {
            resultContainer.innerHTML = `
                <p class="text-lg text-yellow-200 font-harry-potter">
                    Your Patronus is:
                </p>
                <p class="text-3xl text-yellow-200 font-harry-potter font-bold mt-4">
                    ${Array.isArray(patronus) ? patronus[0] : patronus}
                </p>
                <p class="text-yellow-200 mt-2">Based on answers:</p>
                <ul class="list-disc list-inside text-yellow-200 mb-4">
                    ${selectedAnswers.map((ans, idx) => `<li>Set ${idx + 1}: ${ans}</li>`).join('')}
                </ul>
                <button id="restartPatronusQuiz" class="btn-normal mt-4 px-4 py-2 bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover:bg-gray-700 transition-all">
                    Try Again
                </button>
            `;
        } else {
            resultContainer.innerHTML = `
                <p class="text-lg text-yellow-200 font-harry-potter">
                    No unique Patronus matches these words. The magic is elusive!
                </p>
                <p class="text-yellow-200 mt-2">Your answers:</p>
                <ul class="list-disc list-inside text-yellow-200 mb-4">
                    ${selectedAnswers.map((ans, idx) => `<li>Set ${idx + 1}: ${ans}</li>`).join('')}
                </ul>
                <button id="restartPatronusQuiz" class="mt-4 px-4 py-2 bg-gray-800 bg-opacity-70 rounded-lg text-yellow-200 hover:bg-gray-700 transition-all">
                    Try Again
                </button>
            `;
        }

        document.getElementById('restartPatronusQuiz').addEventListener('click', () => {
            currentSet = 1;
            colorSequence = [];
            selectedAnswers = [];
            renderQuestion(1);
        });
    }

    // Start with the first question
    renderQuestion(1);
}