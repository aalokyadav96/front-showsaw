import { createElement } from "./helpers.js";
import { handleEditMessage, handleDeleteMessage } from "./messages.js";
import { createChatContent } from "./mediaRender.js";
import { state, SRC_URL } from '../../state/state.js';

export function appendMessage(msg) {
    let isCreator = false;
    const messagesList = document.getElementById('messagesList');
    if (state.user == msg.sender) {
        isCreator = true;
    }
    // Create main message container
    const msgDiv = createElement('div', {
        class: 'message',
        dataset: { messageId: msg.message_id },
    });

    // Header: Sender
    const header = createElement('div', { class: 'messageHeader' });
    const sender = createElement('strong', {}, `${msg.sender}:`);
    header.appendChild(sender);
    msgDiv.appendChild(header);

    // Content text
    if (msg.content) {
        const content = createElement('div', { class: 'messageContent' }, msg.content);
        msgDiv.appendChild(content);
    }

    // Media (images/videos)
    if (Array.isArray(msg.filename) && msg.filename.length > 0) {
        const extn = Array.isArray(msg.filetype) ? msg.filetype[0] : msg.filetype;
        const post = { type: isFileType(extn) };

        const media = msg.filename.map(filename => `${SRC_URL}/chatpic/${filename}.${msg.filetype}`);
        const mediaContent = createChatContent(post, media);
        msgDiv.appendChild(mediaContent);
    }

    if (isCreator) {
        // Action buttons (Edit / Delete)
        const actionsDiv = createElement('div', { class: 'hflex messageActions' });

        const actions = [
            {
                className: 'editBtn',
                label: 'Edit',
                onClick: () => handleEditMessage(msg.chat_id, msg.message_id, msg.content),
            },
            {
                className: 'deleteBtn',
                label: 'Delete',
                onClick: () => handleDeleteMessage(msg.message_id, msg.chat_id),
            },
        ];

        actions.forEach(({ className, label, onClick }) => {
            const button = createElement('button', { class: className }, label);
            button.addEventListener('click', onClick);
            actionsDiv.appendChild(button);
        });

        msgDiv.appendChild(actionsDiv);
    }
    messagesList.appendChild(msgDiv);
}

function isFileType(extn) {
    const map = {
        "mp4": "video",
        "mp3": "audio",
        "m4a": "audio",
        "webm": "video",
        "png": "image",
        "jpg": "image",
        "jpeg": "image",
        "gif": "image",
        // "svg": "image",
        "": "",
    };
    return map[extn.toLowerCase()] || "";
}
