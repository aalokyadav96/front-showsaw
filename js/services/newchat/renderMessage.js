import { createElement } from "../../components/createElement.js";
import { SRC_URL } from "../../state/state.js";
import { setupMessageActions } from "./actions.js";

/**
 * Renders a chat message DOM node.
 * @param {Object} msg
 * @param {HTMLElement} container
 * @param {string} currentUserId
 * @param {WebSocket} socket
 */
export function renderMessage(msg, container, currentUserId, socket) {
    const time = new Date(msg.timestamp * 1000).toLocaleTimeString();
    const messageId = msg.id || msg.messageid;

    const wrapper = createElement('div', {
        style: 'margin-bottom: 6px; font-family: monospace; position: relative;',
        id: `msg-${messageId}`
    });

    let contentNode;
    if (msg.path) {
        const fileUrl = SRC_URL + "/newchatpic/" + msg.path;
        const ext = msg.filename.split('.').pop().toLowerCase();

        if (/\.(jpe?g|png|gif|webp)$/i.test(msg.filename)) {
            const img = createElement('img', {
                src: fileUrl,
                alt: msg.filename,
                style: 'max-width: 200px; max-height: 150px; display: block;'
            });
            contentNode = createElement('div', {}, [`${time}: `, img]);

        } else if (['mp4', 'webm', 'ogg'].includes(ext)) {
            const video = createElement('video', {
                src: fileUrl,
                controls: true,
                style: 'max-width: 300px; max-height: 200px; display: block;'
            });
            contentNode = createElement('div', {}, [`${time}: `, video]);

        } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
            const audio = createElement('audio', {
                src: fileUrl,
                controls: true,
                style: 'display: block;'
            });
            contentNode = createElement('div', {}, [`${time}: `, audio]);

        } else {
            const link = createElement('a', {
                href: fileUrl,
                download: msg.filename,
                target: '_blank',
                style: 'text-decoration: underline;'
            }, [msg.filename]);
            contentNode = createElement('div', {}, [`${time}: `, link]);
        }

    } else {
        contentNode = createElement('span', { class: 'message-content' }, [
            `${time}: ${msg.content}`
        ]);
    }

    wrapper.appendChild(contentNode);

    if (msg.senderId === currentUserId || msg.userId === currentUserId) {
        const actions = setupMessageActions(msg, socket);
        wrapper.appendChild(actions);
    }

    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}


// import { createElement } from "../../components/createElement.js";
// import { SRC_URL } from "../../state/state.js";
// import { setupMessageActions } from "./actions.js";

// /**
//  * Renders a chat message DOM node.
//  * @param {Object} msg
//  * @param {HTMLElement} container
//  * @param {string} currentUserId
//  * @param {WebSocket} socket
//  */
// export function renderMessage(msg, container, currentUserId, socket) {
//     const time = new Date(msg.timestamp * 1000).toLocaleTimeString();
//     const wrapper = createElement('div', {
//         style: 'margin-bottom: 6px; font-family: monospace; position: relative;',
//         id: `msg-${msg.id}`
//     });

//     let contentNode;

//     if (msg.path) {
//         const fileUrl = "/" + msg.path;
//         if (/\.(jpe?g|png|gif|webp)$/i.test(msg.filename)) {
//             const img = createElement('img', {
//                 src: SRC_URL + "/newchatpic" + fileUrl,
//                 alt: msg.filename,
//                 style: 'max-width: 200px; max-height: 150px; display: block;'
//             });
//             contentNode = createElement('div', {}, [`${time}: `, img]);
//         } else {
//             const link = createElement('a', {
//                 href: fileUrl,
//                 download: msg.filename,
//                 target: '_blank'
//             }, [msg.filename]);
//             contentNode = createElement('div', {}, [`${time}: `, link]);
//         }
//     } else {
//         contentNode = createElement('span', { class: 'message-content' }, [`${time}: ${msg.content}`]);
//     }

//     wrapper.appendChild(contentNode);

//     if (msg.userId === currentUserId) {
//         const actions = setupMessageActions(msg, socket);
//         wrapper.appendChild(actions);
//     }

//     container.appendChild(wrapper);
//     container.scrollTop = container.scrollHeight;
// }
