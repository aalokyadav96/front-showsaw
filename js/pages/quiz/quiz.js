import { displayQuiz } from "../../services/quiz/quiz.js";

async function Quiz(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayQuiz(contentContainer, isLoggedIn);
}

export { Quiz };
