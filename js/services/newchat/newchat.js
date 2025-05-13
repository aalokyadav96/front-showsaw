export {displayNewchat} from "./displayNewchat";
// import { createElement } from "../../components/createElement.js";
// import {SRC_URL} from "../../state/state.js";

// /**
//  * Renders the chat UI for a specific room.
//  * @param {HTMLElement} contentContainer
//  * @param {boolean} isLoggedIn
//  * @param {string} room - Chat room name
//  */
// export function displayNewchat(contentContainer, isLoggedIn, room) {
//     contentContainer.innerHTML = ''; // Clear container

//     const chatBox = createElement('div', {
//         style: 'display: flex; flex-direction: column; height: 100%; max-height: 600px; border: 1px solid #ccc; padding: 10px;'
//     });

//     const messagesContainer = createElement('div', {
//         id: 'messages',
//         style: 'flex: 1; overflow-y: auto; border: 1px solid #ddd; padding: 8px; margin-bottom: 10px; background: #fafafa;'
//     });

//     const inputRow = createElement('div', {
//         style: 'display: flex; gap: 5px; margin-top: 8px;'
//     });

//     const inputField = createElement('input', {
//         type: 'text',
//         placeholder: 'Type a message...',
//         style: 'flex: 1; padding: 5px; font-size: 14px;',
//         id: 'messageInput'
//     });

//     const sendButton = createElement('button', {
//         type: 'button',
//         style: 'padding: 6px 12px; font-size: 14px;',
//     }, ['Send']);

//     const fileInput = createElement('input', {
//         type: 'file',
//         style: 'margin-top: 10px;',
//         accept: 'image/*,video/*,audio/mp3'
//     });

//     const uploadButton = createElement('button', {
//         type: 'button',
//         style: 'margin-top: 10px; padding: 6px 12px; font-size: 14px;'
//     }, ['Upload File']);

//     const dropZone = createElement('div', {
//         style: 'margin-top: 10px; padding: 10px; border: 2px dashed #aaa; text-align: center; color: #666;'
//     }, ['Drag & drop a file here']);

//     const progressBar = createElement('progress', {
//         value: '0',
//         max: '100',
//         style: 'width: 100%; height: 12px; display: none; margin-top: 5px;'
//     });

//     if (!isLoggedIn) {
//         const warning = createElement('div', {
//             style: 'color: red; margin-bottom: 10px;'
//         }, ['You are not logged in. You cannot send messages or upload files.']);
//         chatBox.appendChild(warning);
//         inputField.disabled = true;
//         sendButton.disabled = true;
//         fileInput.disabled = true;
//         uploadButton.disabled = true;
//     }

//     inputRow.appendChild(inputField);
//     inputRow.appendChild(sendButton);

//     chatBox.appendChild(messagesContainer);
//     chatBox.appendChild(inputRow);
//     chatBox.appendChild(fileInput);
//     chatBox.appendChild(uploadButton);
//     chatBox.appendChild(dropZone);
//     chatBox.appendChild(progressBar);
//     contentContainer.appendChild(chatBox);

//     const protocol = location.protocol === "https:" ? "wss" : "ws";
//     const socket = new WebSocket(`${protocol}://localhost:4000/ws/newchat/${encodeURIComponent(room)}`);

//     function appendMessage(msg) {
//         const time = new Date(msg.timestamp * 1000).toLocaleTimeString(); // Convert Unix timestamp
//         let contentElement;

//         if (msg.path) {
//             const fileUrl = "/" + msg.path;
//             if (/\.(jpe?g|png|gif|webp)$/i.test(msg.filename)) {
//                 const img = createElement('img', {
//                     src: SRC_URL+"/newchatpic"+fileUrl,
//                     alt: msg.filename,
//                     style: 'max-width: 200px; max-height: 150px; display: block;'
//                 });
//                 contentElement = createElement('div', {}, [`${time}: `, img]);
//             } else {
//                 const link = createElement('a', {
//                     href: fileUrl,
//                     download: msg.filename,
//                     target: '_blank'
//                 }, [msg.filename]);
//                 contentElement = createElement('div', {}, [`${time}: `, link]);
//             }
//         } else {
//             contentElement = createElement('div', {
//                 style: 'margin-bottom: 4px; font-family: monospace;'
//             }, [`${time}: ${msg.content}`]);
//         }

//         messagesContainer.appendChild(contentElement);
//         messagesContainer.scrollTop = messagesContainer.scrollHeight;
//     }

//     socket.addEventListener('message', (event) => {
//         try {
//             const msg = JSON.parse(event.data);
//             appendMessage(msg);
//         } catch (err) {
//             console.error('Failed to parse message:', err);
//         }
//     });

//     sendButton.addEventListener('click', () => {
//         const message = inputField.value.trim();
//         if (message && socket.readyState === WebSocket.OPEN) {
//             socket.send(message);
//             inputField.value = '';
//         }
//     });

//     inputField.addEventListener('keydown', (e) => {
//         if (e.key === 'Enter') {
//             sendButton.click();
//         }
//     });

//     function validateFile(file) {
//         const allowed = ['image/', 'video/', 'audio/mp3'];
//         const isValidType = allowed.some(type => file.type.startsWith(type) || file.name.endsWith('.mp3'));
//         const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
//         return isValidType && isValidSize;
//     }

//     function uploadFile(file) {
//         if (!validateFile(file)) {
//             alert("Invalid file. Only images, videos, and mp3 under 10MB allowed.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('room', room);

//         progressBar.style.display = 'block';
//         progressBar.value = 0;
        
//         let API_URL = "http://localhost:4000";

//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', `${API_URL}/newchat/upload`);

//         xhr.upload.onprogress = (e) => {
//             if (e.lengthComputable) {
//                 progressBar.value = (e.loaded / e.total) * 100;
//             }
//         };

//         xhr.onload = () => {
//             progressBar.style.display = 'none';
//             if (xhr.status === 200) {
//                 try {
//                     const fileMsg = JSON.parse(xhr.responseText);
//                     appendMessage(fileMsg);
//                     fileInput.value = '';
//                 } catch (e) {
//                     console.error("Upload response parsing failed", e);
//                 }
//             } else {
//                 alert("Upload failed");
//             }
//         };

//         xhr.onerror = () => {
//             progressBar.style.display = 'none';
//             alert("Upload failed");
//         };

//         xhr.send(formData);
//     }

//     uploadButton.addEventListener('click', () => {
//         const file = fileInput.files[0];
//         if (file) uploadFile(file);
//     });

//     dropZone.addEventListener('dragover', (e) => {
//         e.preventDefault();
//         dropZone.style.backgroundColor = "#eee";
//     });

//     dropZone.addEventListener('dragleave', () => {
//         dropZone.style.backgroundColor = "";
//     });

//     dropZone.addEventListener('drop', (e) => {
//         e.preventDefault();
//         dropZone.style.backgroundColor = "";
//         const file = e.dataTransfer.files[0];
//         if (file) uploadFile(file);
//     });
// }
