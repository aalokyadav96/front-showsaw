import { getMessages, sendMessage } from './chatAPI.js';
import { createElement } from "./helpers.js";
import { handleSearchMessages } from "./messages.js";
import { appendMessage } from "./msgAppend";
import { CURRENT_CHAT_ID } from './chatUI.js';

// --------------------------
// Messages Area
// --------------------------
export function createMessagesArea() {
    const messagesArea = createElement('div', { id: 'messagesArea', style: 'display: none;' });

    const searchInput = createElement('input', { id: 'searchInput', placeholder: 'Search messages' });
    searchInput.addEventListener('input', handleSearchMessages);
    messagesArea.appendChild(searchInput);

    const messagesList = createElement('div', { id: 'messagesList' });
    messagesArea.appendChild(messagesList);

    const messageForm = createMessageForm();
    messagesArea.appendChild(messageForm);

    return messagesArea;
}

// Create message form
function createMessageForm() {
    const form = createElement('form', { id: 'messageForm' });

    const messageInput = createElement('input', {
        type: 'text',
        id: 'messageInput',
        placeholder: 'Type your message',
        required: true,
    });

    const fileInput = createElement('input', {
        type: 'file',
        id: 'fileInput',
        multiple: true, // allow multiple file selection
    });

    const sendButton = createElement('button', { type: 'submit' }, 'Send');

    form.append(fileInput, messageInput, sendButton);
    form.addEventListener('submit', handleSendMessage);

    return form;
}

// --------------------------
// Message Handling
// --------------------------

export async function loadMessages(chatId) {
    try {
        const messages = await getMessages(chatId);
        renderMessages(messages);
    } catch (err) {
        console.error("Failed to load messages:", err);
    }
}

// async function handleSendMessage(e) {
//     e.preventDefault();

//     if (!CURRENT_CHAT_ID) {
//         alert('Please select a chat first.');
//         return;
//     }

//     const messageInput = document.getElementById('messageInput');
//     const fileInput = document.getElementById('fileInput');
//     const files = Array.from(fileInput.files);

//     // Limit checks
//     if (files.length > 6) {
//         alert("You can only upload a maximum of 6 files.");
//         return;
//     }

//     const oversizedFiles = files.filter(file => file.size > 2 * 1024 * 1024);
//     if (oversizedFiles.length > 0) {
//         alert("Each file must be less than 2MB.");
//         return;
//     }

//     const formData = new FormData();
//     formData.append('content', messageInput.value);
//     formData.append('chat_id', CURRENT_CHAT_ID);

//     files.forEach(file => {
//         formData.append('files', file); // assuming backend accepts `files` as array
//     });

//     try {
//         const result = await sendMessage(formData);
//         clearForm();
//         appendMessage(result);
//     } catch (err) {
//         console.error("Failed to send message:", err);
//     }
// }

async function handleSendMessage(e) {
    e.preventDefault();

    if (!CURRENT_CHAT_ID) {
        alert('Please select a chat first.');
        return;
    }

    const messageInput = document.getElementById('messageInput');
    const fileInput = document.getElementById('fileInput');
    const files = Array.from(fileInput.files);
    const messageText = messageInput.value.trim();

    if (!messageText && files.length === 0) {
        alert("Please enter a message or attach files.");
        return;
    }

    if (files.length > 6) {
        alert("You can only upload a maximum of 6 files.");
        return;
    }

    const oversizedFiles = files.filter(file => file.size > 8 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
        alert("Each file must be less than 8MB.");
        return;
    }

    const sendButton = e.target.querySelector('button[type="submit"]');
    sendButton.disabled = true;

    const formData = new FormData();
    formData.append('content', messageText);
    formData.append('chat_id', CURRENT_CHAT_ID);

    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const result = await sendMessage(formData);
        clearForm();
        appendMessage(result);
    } catch (err) {
        console.error("Failed to send message:", err);
        alert("Failed to send message.");
    } finally {
        sendButton.disabled = false;
    }
}

function renderMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';

    messages.forEach(msg => {
        appendMessage(msg);
    });
}

function clearForm() {
    document.getElementById('messageInput').value = "";
    document.getElementById('fileInput').value = "";
}

export { CURRENT_CHAT_ID };

// import { getMessages, sendMessage } from './chatAPI.js';
// import { createElement } from "./helpers.js";
// import { handleSearchMessages } from "./messages.js";
// import {appendMessage} from "./msgAppend";
// import { CURRENT_CHAT_ID } from './chatUI.js';

// // --------------------------
// // Messages Area
// // --------------------------
// export function createMessagesArea() {
//     const messagesArea = createElement('div', { id: 'messagesArea', style: 'display: none;' });

//     // Search Input
//     const searchInput = createElement('input', { id: 'searchInput', placeholder: 'Search messages' });
//     searchInput.addEventListener('input', handleSearchMessages);
//     messagesArea.appendChild(searchInput);

//     // Messages List
//     const messagesList = createElement('div', { id: 'messagesList' });
//     messagesArea.appendChild(messagesList);

//     // Message Form
//     const messageForm = createMessageForm();
//     messagesArea.appendChild(messageForm);

//     return messagesArea;
// }

// // Create message form
// function createMessageForm() {
//     const form = createElement('form', { id: 'messageForm' });

//     const messageInput = createElement('input', { type: 'text', id: 'messageInput', placeholder: 'Type your message', required: true });
//     const fileInput = createElement('input', { type: 'file', id: 'fileInput' });
//     const sendButton = createElement('button', { type: 'submit' }, 'Send');

//     form.append(messageInput, fileInput, sendButton);
//     form.addEventListener('submit', handleSendMessage);

//     return form;
// }

// // --------------------------
// // Message Handling
// // --------------------------

// // Load messages for selected chat
// export async function loadMessages(chatId) {
//     try {
//         const messages = await getMessages(chatId);
//         renderMessages(messages);
//     } catch (err) {
//         console.error("Failed to load messages:", err);
//     }
// }

// // Handle sending a new message
// async function handleSendMessage(e) {
//     e.preventDefault();
//     if (!CURRENT_CHAT_ID) {
//         alert('Please select a chat first.');
//         return;
//     }

//     const formData = new FormData();
//     formData.append('content', document.getElementById('messageInput').value);
//     formData.append('chat_id', CURRENT_CHAT_ID);
//     if (document.getElementById('fileInput').files[0]) {
//         formData.append('file', document.getElementById('fileInput').files[0]);
//     }

//     try {
//         const result = await sendMessage(formData);
//         clearForm();
//         appendMessage(result);
//     } catch (err) {
//         console.error("Failed to send message:", err);
//     }
// }


// // Render messages in messages list
// function renderMessages(messages) {
//     const messagesList = document.getElementById('messagesList');
//     messagesList.innerHTML = '';

//     messages.forEach((msg) => {
//         appendMessage(msg);
//     });
// }

// function clearForm() {
//     document.getElementById('messageInput').value = "";
//     document.getElementById('fileInput').value = "";
// }


// export { CURRENT_CHAT_ID };
