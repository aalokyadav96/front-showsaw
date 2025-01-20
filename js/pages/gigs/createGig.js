import { createGigForm } from "../../services/gigs/createGigService.js";

function Create(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    createGigForm(isLoggedIn, contentContainer);
}

export { Create };
