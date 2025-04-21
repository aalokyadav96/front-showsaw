import { displayCartoon } from "../../services/Cartoon/CartoonPage.js";

async function Cartoon(isLoggedIn, CartoonID, contentContainer) {
    contentContainer.innerHTML = '';
    displayCartoon(contentContainer, CartoonID, isLoggedIn);
}

export { Cartoon };
