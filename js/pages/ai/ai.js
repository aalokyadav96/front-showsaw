import { displayAI } from "../../services/ai/ai.js";

async function AI(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayAI(contentContainer, isLoggedIn);
}

export { AI };
