import { displayCartoons } from "../../services/Cartoon/Cartoons.js";

async function Cartoons(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayCartoons(contentContainer, isLoggedIn);
}

export { Cartoons };
