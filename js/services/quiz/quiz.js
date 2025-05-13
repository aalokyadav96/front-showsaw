export async function displayQuiz(contentContainer, isLoggedIn) {
    // Clear previous content
    contentContainer.innerHTML = '';

    // Create quiz page container
    const quizPage = document.createElement('div');
    quizPage.className = 'quiz-page';

    // Check if the user is logged in
    if (!isLoggedIn) {
        quizPage.innerHTML = '<h2>Please log in to participate in quizzes.</h2>';
        contentContainer.appendChild(quizPage);
        return;
    }

    // Sample quiz questions
    const quizQuestions = [
        { id: 1, question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswer: 2 },
        { id: 2, question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 1 }
    ];

    // Create quiz container
    const quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-container';

    let score = 0;

    // Populate quiz questions
    quizQuestions.forEach((q, qIndex) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';

        const questionElement = document.createElement('h3');
        questionElement.textContent = q.question;
        questionItem.appendChild(questionElement);

        q.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.onclick = () => {
                if (index === q.correctAnswer) {
                    score++;
                }
                optionButton.disabled = true;
                updateQuizResults();
            };
            questionItem.appendChild(optionButton);
        });

        quizContainer.appendChild(questionItem);
    });

    // Display quiz results
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'quiz-results';

    function updateQuizResults() {
        resultsContainer.innerHTML = `<h4>Your Score: ${score} / ${quizQuestions.length}</h4>`;
    }

    quizContainer.appendChild(resultsContainer);
    quizPage.appendChild(quizContainer);
    contentContainer.appendChild(quizPage);
}
