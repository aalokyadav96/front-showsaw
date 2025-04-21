import { createCartoonForm } from "../../services/Cartoon/createCartoon.js";

async function Create(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    createCartoonForm(isLoggedIn, contentContainer);
}

export { Create };
