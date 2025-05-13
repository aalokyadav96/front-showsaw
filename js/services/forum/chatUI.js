import { getChats, createChat, getContacts, deleteChat } from './chatAPI.js';
import { createElement } from "./helpers.js";
import { setupWebSocket } from "./wsock.js";
import { createMessagesArea, loadMessages } from "./msgHandle.js";

let CURRENT_CHAT_ID = null;
let contacts = [];
let activeChatElement = null;

async function fetchContacts() {
    try {
        contacts = await getContacts();
    } catch (err) {
        console.error("Failed to fetch contacts:", err);
    }
}

export async function displayChat(contentContainer, isLoggedIn) {
    contentContainer.textContent = '';
    if (!isLoggedIn) {
        contentContainer.textContent = 'Please log in to view chats.';
        return;
    }

    await fetchContacts();

    const chatAppContainer = createElement('div', { id: 'chatAppContainer', class: 'mobile-flex-container' });

    const header = createElement('div', { id: 'chatHeader', class: 'chat-header' });
    const toggleBtn = createElement('button', { id: 'toggleSidebarBtn' }, '☰');
    toggleBtn.addEventListener('click', () => {
        document.getElementById('chatsSidebar').classList.toggle('visible');
    });
    header.appendChild(toggleBtn);

    const chatsSidebar = await createChatsSidebar();
    const messagesArea = createMessagesArea();

    chatAppContainer.append(header, chatsSidebar, messagesArea);
    contentContainer.appendChild(chatAppContainer);

    fetchChats();
    setupWebSocket();
}

async function createChatsSidebar() {
    const chatsSidebar = createElement('div', { id: 'chatsSidebar', class: 'sidebar' });

    const newChatButton = createElement('button', { id: 'newChatButton' }, 'New Chat');
    newChatButton.addEventListener('click', toggleContactsModal);
    chatsSidebar.appendChild(newChatButton);

    const chatsList = createElement('ul', { id: 'chatsList' });
    chatsSidebar.appendChild(chatsList);

    const contactsModal = await createContactsModal();
    chatsSidebar.appendChild(contactsModal);

    return chatsSidebar;
}

async function createContactsModal() {
    const contactsModal = createElement('div', {
        id: 'contactsModal',
        class: 'contacts-modal',
        style: 'display: none;'
    });

    contacts.forEach(contact => {
        const contactBtn = createElement('div', {}, contact.name);
        contactBtn.addEventListener('click', async () => {
            await createNewChat(contact.id);
            contactsModal.style.display = 'none';
        });
        contactsModal.appendChild(contactBtn);
    });

    return contactsModal;
}

async function fetchChats() {
    try {
        const chats = await getChats();
        renderChats(chats);
    } catch (err) {
        console.error("Failed to fetch chats:", err);
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

function renderChats(chats) {
    const chatsList = document.getElementById('chatsList');
    chatsList.innerHTML = '';

    chats.forEach(chat => {
        const li = createElement('li', { dataset: { chatId: chat.chat_id }, class: "hflex-sb chat-item" });
        const span = createElement('span', {}, `${chat.name}: ${chat.preview}`);
        span.addEventListener('click', () => selectChat(li, chat.chat_id));

        const deleteBtn = createElement('button', {}, "Delete");
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChatHandler(chat.chat_id);
        });

        li.append(span, deleteBtn);
        chatsList.appendChild(li);
    });
}

function selectChat(chatElement, chatId) {
    if (CURRENT_CHAT_ID === chatId) return;

    if (activeChatElement) activeChatElement.style.backgroundColor = "";
    chatElement.style.backgroundColor = "#c7ffce";
    activeChatElement = chatElement;
    CURRENT_CHAT_ID = chatId;

    document.getElementById('messagesArea').style.display = "flex";
    loadMessages(chatId);

    // Hide sidebar on mobile after selecting chat
    if (window.innerWidth <= 768) {
        document.getElementById('chatsSidebar').classList.remove('visible');
    }
}

async function createNewChat(contactId) {
    try {
        const newChat = await createChat(contactId);
        await fetchChats();
        selectChat(document.querySelector(`[data-chat-id="${newChat.chat_id}"]`), newChat.chat_id);
    } catch (err) {
        console.error("Failed to create new chat:", err);
    }
}

function toggleContactsModal() {
    const contactsModal = document.getElementById('contactsModal');
    contactsModal.style.display = contactsModal.style.display === 'none' ? 'block' : 'none';
}

export { CURRENT_CHAT_ID };

// import { getChats, createChat, getContacts, deleteChat } from './chatAPI.js';
// import { createElement } from "./helpers.js";
// import { setupWebSocket } from "./wsock.js";

// import { createMessagesArea, loadMessages } from "./msgHandle.js";

// // Global state
// let CURRENT_CHAT_ID = null;
// let contacts = [];
// let activeChatElement = null; // To track the currently active chat UI element

// // Fetch contacts from backend
// async function fetchContacts() {
//     try {
//         contacts = await getContacts();
//     } catch (err) {
//         console.error("Failed to fetch contacts:", err);
//     }
// }

// // Create the chat UI
// export async function displayChat(contentContainer, isLoggedIn) {
//     contentContainer.textContent = '';

//     if (!isLoggedIn) {
//         contentContainer.textContent = 'Please log in to view chats.';
//         return;
//     }

//     // Fetch contacts from backend before building UI components that depend on them.
//     await fetchContacts();

//     const chatAppContainer = createElement('div', { id: 'chatAppContainer' });

//     // Create Sidebar and Messages Area after contacts are loaded.
//     const chatsSidebar = await createChatsSidebar();
//     const messagesArea = createMessagesArea();

//     chatAppContainer.append(chatsSidebar, messagesArea);
//     contentContainer.appendChild(chatAppContainer);

//     // Fetch chats and setup WebSocket for real-time updates.
//     fetchChats();
//     setupWebSocket();
// }

// // --------------------------
// // Chat Sidebar
// // --------------------------
// async function createChatsSidebar() {
//     const chatsSidebar = createElement('div', { id: 'chatsSidebar' });

//     // New Chat Button
//     const newChatButton = createElement('button', { id: 'newChatButton' }, 'New Chat');
//     newChatButton.addEventListener('click', toggleContactsModal);
//     chatsSidebar.appendChild(newChatButton);

//     // Chats List
//     const chatsList = createElement('ul', { id: 'chatsList' });
//     chatsSidebar.appendChild(chatsList);

//     // Contacts Modal
//     const contactsModal = await createContactsModal();
//     chatsSidebar.appendChild(contactsModal);

//     return chatsSidebar;
// }

// // Create contacts modal for selecting a contact
// async function createContactsModal() {
//     const contactsModal = createElement('div', {
//         id: 'contactsModal',
//         style: 'display: none; position: absolute; background: white; border: 1px solid #ccc; padding: 10px;'
//     });

//     contacts.forEach(contact => {
//         const contactBtn = createElement('div', {}, contact.name);
//         contactBtn.addEventListener('click', async () => {
//             await createNewChat(contact.id);
//             contactsModal.style.display = 'none';
//         });
//         contactsModal.appendChild(contactBtn);
//     });

//     return contactsModal;
// }

// // Fetch and render chat list
// async function fetchChats() {
//     try {
//         const chats = await getChats();
//         renderChats(chats);
//     } catch (err) {
//         console.error("Failed to fetch chats:", err);
//     }
// }

// // Function to handle chat deletion
// async function deleteChatHandler(chatId) {
//     if (!confirm("Are you sure you want to delete this chat?")) return;

//     try {
//         await deleteChat(chatId); // Call API to delete chat
//         removeChatFromUI(chatId); // Update UI
//     } catch (error) {
//         console.error("Failed to delete chat:", error);
//         alert("Failed to delete chat. Please try again.");
//     }
// }

// // Function to remove chat from UI
// function removeChatFromUI(chatId) {
//     const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`);
//     if (chatElement) {
//         chatElement.remove();
//     }
//     document.getElementById('messagesArea').style.display = "none"; // Hide message area on chat deletion
// }

// // Render chats in sidebar
// function renderChats(chats) {
//     const chatsList = document.getElementById('chatsList');
//     chatsList.innerHTML = '';

//     chats.forEach(chat => {
//         const li = createElement('li', { dataset: { chatId: chat.chat_id }, class: "hflex-sb chat-item" });
//         const span = createElement('span', {}, `${chat.name}: ${chat.preview}`);
//         span.addEventListener('click', () => selectChat(li, chat.chat_id));

//         // Delete button
//         const deleteBtn = createElement('button', {}, "Delete");
//         deleteBtn.addEventListener('click', (e) => {
//             e.stopPropagation(); // Prevent chat selection when deleting
//             deleteChatHandler(chat.chat_id);
//         });

//         li.append(span, deleteBtn);
//         chatsList.appendChild(li);
//     });
// }

// // Handle chat selection (toggle message area visibility and highlight active chat)
// function selectChat(chatElement, chatId) {
//     if (CURRENT_CHAT_ID === chatId) return; // If the chat is already selected, do nothing

//     // Reset previous chat's background color
//     if (activeChatElement) {
//         activeChatElement.style.backgroundColor = "";
//     }

//     // Set new chat as active
//     chatElement.style.backgroundColor = "#c7ffce";
//     activeChatElement = chatElement;
//     CURRENT_CHAT_ID = chatId;

//     // Show the messages area
//     document.getElementById('messagesArea').style.display = "flex";

//     // Load messages
//     loadMessages(chatId);
// }

// // Create new chat
// async function createNewChat(contactId) {
//     try {
//         const newChat = await createChat(contactId);
//         await fetchChats();
//         selectChat(document.querySelector(`[data-chat-id="${newChat.chat_id}"]`), newChat.chat_id);
//     } catch (err) {
//         console.error("Failed to create new chat:", err);
//     }
// }

// // Toggle contacts modal visibility
// async function toggleContactsModal() {
//     const contactsModal = document.getElementById('contactsModal');
//     contactsModal.style.display = contactsModal.style.display === 'none' ? 'flex' : 'none';
// }


// export { CURRENT_CHAT_ID };
