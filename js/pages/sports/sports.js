import { displaySports } from "../../services/sports/sports.js";

async function Sports(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displaySports(contentContainer, isLoggedIn);
}

export { Sports };
