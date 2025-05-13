export async function displayPoll(contentContainer, isLoggedIn) {
    // Clear previous content
    contentContainer.innerHTML = '';

    // Create poll page container
    const pollPage = document.createElement('div');
    pollPage.className = 'poll-page';

    // Check if the user is logged in
    if (!isLoggedIn) {
        pollPage.innerHTML = '<h2>Please log in to participate in polls.</h2>';
        contentContainer.appendChild(pollPage);
        return;
    }

    // Sample poll question
    const pollQuestion = { 
        question: 'Which programming language do you prefer?', 
        options: ['JavaScript', 'Python', 'Java', 'C++'], 
        votes: [0, 0, 0, 0] 
    };

    // Create poll container
    const pollContainer = document.createElement('div');
    pollContainer.className = 'poll-container';

    // Display question
    const questionElement = document.createElement('h3');
    questionElement.textContent = pollQuestion.question;
    pollContainer.appendChild(questionElement);

    // Create poll options
    pollQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.onclick = () => {
            pollQuestion.votes[index]++;
            updatePollResults();
        };
        pollContainer.appendChild(optionButton);
    });

    // Display poll results
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'poll-results';

    function updatePollResults() {
        resultsContainer.innerHTML = '<h4>Live Results:</h4>';
        pollQuestion.options.forEach((option, index) => {
            const resultItem = document.createElement('p');
            resultItem.textContent = `${option}: ${pollQuestion.votes[index]} votes`;
            resultsContainer.appendChild(resultItem);
        });
    }

    pollContainer.appendChild(resultsContainer);
    pollPage.appendChild(pollContainer);
    contentContainer.appendChild(pollPage);
}
