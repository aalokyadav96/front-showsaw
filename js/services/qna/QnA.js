import { secnav } from "../../components/secnav.js";

export async function displayQnA(contentContainer, isLoggedIn) {
    if (!contentContainer) {
        console.error("Content container not found!");
        return;
    }

    const qnaSection = document.createElement("section");
    qnaSection.classList.add("qna-section");

    const itemsContainer = document.createElement("div");
    itemsContainer.classList.add("qna-items-container");

    const mockData = {
        QnA: [
            {
                question: "What is the capital of France?",
                answer: "Paris"
            },
            {
                question: "What is 2 + 2?",
                answer: "4"
            }
        ],
        Poll: [
            {
                question: "Do you like vanilla JS?",
                options: ["Yes", "No", "Maybe"],
                totalVotes: 120
            }
        ],
        Quiz: [
            {
                question: "Which language runs in a web browser?",
                options: ["Python", "Java", "C", "JavaScript"],
                correct: "JavaScript"
            }
        ]
    };

    function showCategory(category) {
        itemsContainer.innerHTML = "";

        if (!mockData[category]) return;

        mockData[category].forEach(item => {
            const article = document.createElement("article");
            article.classList.add("qna-item");

            const question = document.createElement("h2");
            question.textContent = item.question;
            article.appendChild(question);

            if (category === "QnA") {
                const answer = document.createElement("p");
                answer.textContent = `Answer: ${item.answer}`;
                article.appendChild(answer);
            } else if (category === "Poll") {
                const options = document.createElement("ul");
                options.classList.add("poll-options");
                item.options.forEach(opt => {
                    const li = document.createElement("li");
                    li.textContent = opt;
                    options.appendChild(li);
                });
                article.appendChild(options);

                const total = document.createElement("p");
                total.classList.add("meta-info");
                total.textContent = `Total Votes: ${item.totalVotes}`;
                article.appendChild(total);
            } else if (category === "Quiz") {
                const options = document.createElement("ul");
                options.classList.add("quiz-options");
                item.options.forEach(opt => {
                    const li = document.createElement("li");
                    li.textContent = opt;
                    if (opt === item.correct) li.classList.add("correct-answer");
                    options.appendChild(li);
                });
                article.appendChild(options);
            }

            itemsContainer.appendChild(article);
        });
    }

    const categories = [
        { label: "QnA", callback: showCategory },
        { label: "Poll", callback: showCategory },
        { label: "Quiz", callback: showCategory }
    ];

    const secondaryNav = secnav(categories);
    if (secondaryNav) qnaSection.appendChild(secondaryNav);

    qnaSection.appendChild(itemsContainer);

    showCategory("QnA"); // Default

    contentContainer.appendChild(qnaSection);
}

// export async function displayQnA(contentContainer, isLoggedIn) {
//     // Clear previous content
//     contentContainer.innerHTML = '';

//     // Create QnA page container
//     const qnaPage = document.createElement('div');
//     qnaPage.className = 'qna-page';

//     // Check if the user is logged in
//     if (!isLoggedIn) {
//         qnaPage.innerHTML = '<h2>Please log in to participate in discussions.</h2>';
//         contentContainer.appendChild(qnaPage);
//         return;
//     }

//     // Sample Q&A list
//     const questions = [
//         { id: 1, question: 'What are the benefits of learning JavaScript?', answers: ['It is versatile for web development.', 'Many career opportunities available.'] },
//         { id: 2, question: 'How does AI impact daily life?', answers: ['AI improves automation and efficiency.', 'It enhances personalized recommendations.'] }
//     ];

//     // Create question list container
//     const questionList = document.createElement('div');
//     questionList.className = 'question-list';

//     // Populate question list
//     questions.forEach(q => {
//         const questionItem = document.createElement('div');
//         questionItem.className = 'question-item';
//         questionItem.innerHTML = `<h3>${q.question}</h3>`;

//         const answerList = document.createElement('div');
//         answerList.className = 'answer-list';

//         q.answers.forEach(ans => {
//             const answerItem = document.createElement('p');
//             answerItem.className = 'answer-item';
//             answerItem.textContent = `• ${ans}`;
//             answerList.appendChild(answerItem);
//         });

//         questionItem.appendChild(answerList);
//         questionList.appendChild(questionItem);
//     });

//     // Create submission form for new questions
//     const askForm = document.createElement('form');
//     askForm.innerHTML = `
//         <h3>Ask a Question</h3>
//         <input type="text" id="questionInput" placeholder="Enter your question..." required>
//         <button type="submit">Submit</button>
//     `;

//     askForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const questionText = document.getElementById('questionInput').value;
//         if (questionText.trim()) {
//             const newQuestion = document.createElement('div');
//             newQuestion.className = 'question-item';
//             newQuestion.innerHTML = `<h3>${questionText}</h3><p>No answers yet.</p>`;
//             questionList.appendChild(newQuestion);
//         }
//         askForm.reset();
//     });

//     // Append elements to QnA page
//     qnaPage.innerHTML = '<h2>Welcome to the Q&A Page</h2>';
//     qnaPage.appendChild(questionList);
//     qnaPage.appendChild(askForm);
    
//     // Add the QnA page to the content container
//     contentContainer.appendChild(qnaPage);
// }
