import { displayChat } from "../../services/userchat/chatPage.js";

async function Chat(isLoggedIn, chatID, contentContainer) {
    contentContainer.innerHTML = '';
    displayChat(contentContainer, chatID, isLoggedIn);
}

export { Chat };
