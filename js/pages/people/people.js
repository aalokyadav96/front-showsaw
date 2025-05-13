import { displayPeople } from "../../services/people/people.js";

async function People(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayPeople(contentContainer, isLoggedIn);
}

export { People };
