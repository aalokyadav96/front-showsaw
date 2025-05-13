import { displayNewchat } from "../../services/newchat/newchat.js";

async function NewChat(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    var roomId = "4638";
    displayNewchat(contentContainer, isLoggedIn, roomId);
}

export { NewChat };
