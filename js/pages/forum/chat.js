import { displayChat } from "../../services/forum/chatService.js";

async function Chat(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayChat(contentContainer, isLoggedIn);
}

export { Chat };
