import { displayPoll } from "../../services/poll/poll.js";

async function Poll(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayPoll(contentContainer, isLoggedIn);
}

export { Poll };
