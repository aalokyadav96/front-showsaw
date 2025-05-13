import { displayQnA } from "../../services/qna/qna.js";

async function QnA(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayQnA(contentContainer, isLoggedIn);
}

export { QnA };
