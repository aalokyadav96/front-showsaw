import { displayChat } from "../../services/chat/chatService.js";

async function Chat(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayChat(contentContainer, isLoggedIn);
}

export { Chat };
