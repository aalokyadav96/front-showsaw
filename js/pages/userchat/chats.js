import { displayChats } from "../../services/userchat/chats.js";

async function Chats(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayChats(contentContainer, isLoggedIn);
}

export { Chats };
