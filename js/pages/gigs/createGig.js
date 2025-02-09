import { createGigForm } from "../../services/gigs/createGigService.js";

async function Create(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    createGigForm(isLoggedIn, contentContainer);
}

export { Create };
