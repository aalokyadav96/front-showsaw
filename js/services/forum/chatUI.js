import { getChats, createChat, deleteChat } from './chatAPI.js';
import { createElement } from "../../components/createElement.js";
import { setupWebSocket } from "./wsock.js";
import { createMessagesArea, loadMessages } from "./msgHandle.js";

let CURRENT_CHAT_ID = null;
let activeChatElement = null;

// Removed fetchContacts since it's no longer needed

export async function displayChat(contentContainer, isLoggedIn) {
    contentContainer.textContent = '';
    if (!isLoggedIn) {
        contentContainer.textContent = 'Please log in to view chats.';
        return;
    }

    const chatAppContainer = createElement('div', { id: 'chatAppContainer', class: 'mobile-flex-container' }, []);

    const header = createElement('div', { id: 'chatHeader', class: 'chat-header' }, []);
    const toggleBtn = createElement('button', { id: 'toggleSidebarBtn' }, ['☰']);
    toggleBtn.addEventListener('click', () => {
        document.getElementById('chatsSidebar').classList.toggle('visible');
    });
    header.appendChild(toggleBtn);

    const chatsSidebar = await createChatsSidebar();  // changed
    const messagesArea = createMessagesArea();

    chatAppContainer.append(header, chatsSidebar, messagesArea);
    contentContainer.appendChild(chatAppContainer);

    fetchChats();
    setupWebSocket();
}

async function createChatsSidebar() {
    const chatsSidebar = createElement('div', { id: 'chatsSidebar', class: 'sidebar' }, []);

    const newThreadButton = createElement('button', { id: 'newThreadButton' }, ['New Thread']);
    newThreadButton.addEventListener('click', showThreadPrompt);  // changed
    chatsSidebar.appendChild(newThreadButton);

    const chatsList = createElement('ul', { id: 'chatsList' }, []);
    chatsSidebar.appendChild(chatsList);

    return chatsSidebar;
}

// New thread creation prompt (replaces contact modal)
function showThreadPrompt() {
    const title = prompt("Enter a title for the new thread:");
    if (title && title.trim().length > 0) {
        createNewThread(title.trim());
    }
}

// Changed to accept title instead of contact ID
async function createNewThread(title) {
    try {
        const newChat = await createChat({ title });  // backend must accept { title } instead of contact_id
        await fetchChats();
        selectChat(document.querySelector(`[data-chat-id="${newChat.chat_id}"]`), newChat.chat_id);
    } catch (err) {
        console.error("Failed to create new thread:", err);
    }
}

async function fetchChats() {
    try {
        const chats = await getChats();
        renderChats(chats);
    } catch (err) {
        console.error("Failed to fetch chats:", err);
    }
}

function renderChats(chats) {
    const chatsList = document.getElementById('chatsList');
    chatsList.innerHTML = '';

    chats.forEach(chat => {
        const li = createElement('li', { dataset: { chatId: chat.chat_id }, class: "hflex-sb chat-item" }, []);
        const span = createElement('span', {}, [`${chat.name || chat.title}: ${chat.preview || ''}`]);
        span.addEventListener('click', () => selectChat(li, chat.chat_id, chat.name));

        const deleteBtn = createElement('button', {}, ["Delete"]);
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChatHandler(chat.chat_id);
        });

        li.append(span, deleteBtn);
        chatsList.appendChild(li);
    });
}

function selectChat(chatElement, chatId, chatName) {
    if (CURRENT_CHAT_ID === chatId) return;

    if (activeChatElement) activeChatElement.style.backgroundColor = "";
    chatElement.style.backgroundColor = "#c7ffce";
    activeChatElement = chatElement;
    CURRENT_CHAT_ID = chatId;

    let msgarea = document.getElementById('messagesArea');
    msgarea.style.display = "flex";
    msgarea.prepend(createElement('h2', {}, [chatName]));
    loadMessages(chatId);

    if (window.innerWidth <= 768) {
        document.getElementById('chatsSidebar').classList.remove('visible');
    }
}

async function deleteChatHandler(chatId) {
    if (!confirm("Are you sure you want to delete this chat?")) return;
    try {
        await deleteChat(chatId);
        removeChatFromUI(chatId);
    } catch (error) {
        console.error("Failed to delete chat:", error);
        alert("Failed to delete chat. Please try again.");
    }
}

function removeChatFromUI(chatId) {
    const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (chatElement) chatElement.remove();
    document.getElementById('messagesArea').style.display = "none";
}

export { CURRENT_CHAT_ID };
