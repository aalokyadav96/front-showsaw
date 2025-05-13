import { displayClips } from "../../services/clips/clips.js";

async function Clips(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayClips(contentContainer, isLoggedIn);
}

export { Clips };
