import { createElement } from "./helpers.js";
import { handleEditMessage, handleDeleteMessage } from "./messages.js";
import { createChatContent } from "./mediaRender.js";
import { state, SRC_URL } from '../../state/state.js';
import { reportPost } from "../reporting/reporting.js";

// export function appendMessage(msg) {
//     let isCreator = false;
//     const messagesList = document.getElementById('messagesList');
//     if (state.user == msg.sender) {
//         isCreator = true;
//     }
//     // Create main message container
//     const msgDiv = createElement('div', {
//         class: 'message',
//         dataset: { messageId: msg.message_id },
//     });

//     // Header: Sender
//     const header = createElement('div', { class: 'messageHeader' });
//     const sender = createElement('strong', {}, `${msg.sender}:`);
//     header.appendChild(sender);
//     msgDiv.appendChild(header);

//     // // Content text
//     // if (msg.content) {
//     //     const content = createElement('div', { class: 'messageContent' }, msg.content);
//     //     msgDiv.appendChild(content);
//     // }
//     // Content text
//     if (msg.content) {
//         const contentDiv = createElement('div', { class: 'messageContent' });

//         // Convert @userMention and #hashtag into links
//         const formattedContent = msg.content.replace(/@(\w+)/g, '<a href="/user/$1">@$1</a>')
//             .replace(/#(\w+)/g, '<a href="/hashtag/$1">#$1</a>');

//         contentDiv.innerHTML = formattedContent;
//         msgDiv.appendChild(contentDiv);
//     }

//     // Media (images/videos)
//     if (Array.isArray(msg.filename) && msg.filename.length > 0) {
//         const extn = Array.isArray(msg.filetype) ? msg.filetype[0] : msg.filetype;
//         const post = { type: isFileType(extn) };

//         const media = msg.filename.map(filename => `${SRC_URL}/chatpic/${filename}.${msg.filetype}`);
//         const mediaContent = createChatContent(post, media);
//         msgDiv.appendChild(mediaContent);
//     }

//     if (isCreator) {
//         // Action buttons (Edit / Delete)
//         const actionsDiv = createElement('div', { class: 'hflex messageActions' });

//         const actions = [
//             {
//                 className: 'editBtn',
//                 label: 'Edit',
//                 onClick: () => handleEditMessage(msg.chat_id, msg.message_id, msg.content),
//             },
//             {
//                 className: 'deleteBtn',
//                 label: 'Delete',
//                 onClick: () => handleDeleteMessage(msg.message_id, msg.chat_id),
//             },
//         ];

//         actions.forEach(({ className, label, onClick }) => {
//             const button = createElement('button', { class: className }, label);
//             button.addEventListener('click', onClick);
//             actionsDiv.appendChild(button);
//         });

//         msgDiv.appendChild(actionsDiv);
//     }

//     // Report button
//     const reportButton = document.createElement("button");
//     reportButton.className = "report-btn";
//     reportButton.textContent = "Report";
//     reportButton.addEventListener("click", () => {
//         reportPost(msg.message_id, "message", "forum", msg.chat_id);
//     });

//     msgDiv.appendChild(reportButton);

//     messagesList.appendChild(msgDiv);
// }

export function appendMessage(msg) {
    const isCreator = state.user === msg.sender;
    const messagesList = document.getElementById('messagesList');

    // Main container
    const msgDiv = createElement('div', {
        class: 'message',
        dataset: { messageId: msg.message_id },
    });

    // Header: sender + actions
    const header = createElement('div', { class: 'messageHeader hflex-sb' });
    const sender = createElement('strong', {}, `${msg.sender}:`);
    header.appendChild(sender);

    // Three-dot menu button
    const moreWrapper = createElement('div', { class: 'more-wrapper' });
    const moreBtn = createElement('button', { class: 'more-btn' }, '⋮');
    const dropdown = createElement('div', { class: 'dropdown hidden' });

    if (isCreator) {
        const editBtn = createElement('button', { class: 'editBtn' }, 'Edit');
        editBtn.addEventListener('click', () =>
            handleEditMessage(msg.chat_id, msg.message_id, msg.content)
        );

        const deleteBtn = createElement('button', { class: 'deleteBtn' }, 'Delete');
        deleteBtn.addEventListener('click', () =>
            handleDeleteMessage(msg.message_id, msg.chat_id)
        );

        dropdown.append(editBtn, deleteBtn);
    }

    const reportBtn = createElement('button', { class: 'reportBtn' }, 'Report');
    reportBtn.addEventListener('click', () =>
        reportPost(msg.message_id, 'message', 'forum', msg.chat_id)
    );
    dropdown.appendChild(reportBtn);

    moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
    });

    moreWrapper.append(moreBtn, dropdown);
    header.appendChild(moreWrapper);
    msgDiv.appendChild(header);

    // Content text
    if (msg.content) {
        const contentDiv = createElement('div', { class: 'messageContent' });
        const formattedContent = msg.content
            .replace(/@(\w+)/g, '<a href="/user/$1">@$1</a>')
            .replace(/#(\w+)/g, '<a href="/hashtag/$1">#$1</a>');

        contentDiv.innerHTML = formattedContent;
        msgDiv.appendChild(contentDiv);
    }

    // Media attachments
    if (Array.isArray(msg.filename) && msg.filename.length > 0) {
        const extn = Array.isArray(msg.filetype) ? msg.filetype[0] : msg.filetype;
        const post = { type: isFileType(extn) };

        const media = msg.filename.map(
            (filename) => `${SRC_URL}/chatpic/${filename}.${msg.filetype}`
        );
        const mediaContent = createChatContent(post, media);
        msgDiv.appendChild(mediaContent);
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
