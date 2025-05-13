import { createElement } from "../../components/createElement.js";
import { SRC_URL } from "../../state/state.js";
import { renderMessage } from "./renderMessage.js";

export function displayNewchat(contentContainer, isLoggedIn, room, currentUserId) {
    contentContainer.innerHTML = '';

    const chatBox = createElement('div', {
        style: 'display: flex; flex-direction: column; height: 100%; max-height: 600px; border: 1px solid #ccc; padding: 10px;'
    });

    const messagesContainer = createElement('div', {
        id: 'messages',
        style: 'flex: 1; overflow-y: auto; border: 1px solid #ddd; padding: 8px; margin-bottom: 10px; background: #fafafa;'
    });

    const inputRow = createElement('div', {
        style: 'display: flex; gap: 5px; margin-top: 8px;'
    });

    const inputField = createElement('input', {
        type: 'text',
        placeholder: 'Type a message...',
        style: 'flex: 1; padding: 5px; font-size: 14px;',
        id: 'messageInput'
    });

    const sendButton = createElement('button', {
        type: 'button',
        style: 'padding: 6px 12px; font-size: 14px;',
    }, ['Send']);

    const fileInput = createElement('input', {
        type: 'file',
        style: 'margin-top: 10px;',
        accept: 'image/*,video/*,audio/mp3'
    });

    const uploadButton = createElement('button', {
        type: 'button',
        style: 'margin-top: 10px; padding: 6px 12px; font-size: 14px;'
    }, ['Upload File']);

    const dropZone = createElement('div', {
        style: 'margin-top: 10px; padding: 10px; border: 2px dashed #aaa; text-align: center; color: #666;'
    }, ['Drag & drop a file here']);

    const progressBar = createElement('progress', {
        value: '0',
        max: '100',
        style: 'width: 100%; height: 12px; display: none; margin-top: 5px;'
    });

    if (!isLoggedIn) {
        chatBox.appendChild(createElement('div', {
            style: 'color: red; margin-bottom: 10px;'
        }, ['You are not logged in.']));
        inputField.disabled = true;
        sendButton.disabled = true;
        fileInput.disabled = true;
        uploadButton.disabled = true;
    }

    inputRow.appendChild(inputField);
    inputRow.appendChild(sendButton);

    chatBox.appendChild(messagesContainer);
    chatBox.appendChild(inputRow);
    chatBox.appendChild(fileInput);
    chatBox.appendChild(uploadButton);
    chatBox.appendChild(dropZone);
    chatBox.appendChild(progressBar);
    contentContainer.appendChild(chatBox);

    const protocol = location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://localhost:4000/ws/newchat/${encodeURIComponent(room)}`);

    socket.addEventListener('message', (event) => {
        try {
            const msg = JSON.parse(event.data);

            if (msg.type === 'edit') {
                const wrapper = document.getElementById(`msg-${msg.id}`);
                const span = wrapper.querySelector('.message-content');
                if (span) span.textContent = `${new Date(msg.timestamp * 1000).toLocaleTimeString()}: ${msg.content}`;
            } else if (msg.type === 'delete') {
                const wrapper = document.getElementById(`msg-${msg.id}`);
                if (wrapper) wrapper.remove();
            } else {
                renderMessage(msg, messagesContainer, currentUserId, socket);
            }
        } catch (err) {
            console.error('Invalid message:', err);
        }
    });

    // sendButton.addEventListener('click', () => {
    //     const message = inputField.value.trim();
    //     if (message && socket.readyState === WebSocket.OPEN) {
    //         socket.send(message);
    //         inputField.value = '';
    //     }
    // });

    sendButton.addEventListener('click', () => {
        const content = inputField.value.trim();
        if (!content || socket.readyState !== WebSocket.OPEN) return;
      
        socket.send(JSON.stringify({
          action: "chat",     // use "chat", not "delete"
          content: content    // send the text here
        }));
        inputField.value = '';
      });
      

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendButton.click();
    });

    function validateFile(file) {
        const allowed = ['image/', 'video/', 'audio/mp3'];
        const isValidType = allowed.some(type => file.type.startsWith(type) || file.name.endsWith('.mp3'));
        const isValidSize = file.size <= 10 * 1024 * 1024;
        return isValidType && isValidSize;
    }

    function uploadFile(file) {
        if (!validateFile(file)) return alert("Invalid file.");

        const formData = new FormData();
        formData.append('file', file);
        formData.append('room', room);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:4000/newchat/upload`);

        progressBar.style.display = 'block';
        progressBar.value = 0;

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                progressBar.value = (e.loaded / e.total) * 100;
            }
        };

        xhr.onload = () => {
            progressBar.style.display = 'none';
            if (xhr.status === 200) {
                try {
                    // const fileMsg = JSON.parse(xhr.responseText);
                    // renderMessage(fileMsg, messagesContainer, currentUserId, socket);
                    fileInput.value = '';
                } catch (e) {
                    console.error("Upload response parsing failed", e);
                }
            } else alert("Upload failed");
        };

        xhr.onerror = () => {
            progressBar.style.display = 'none';
            alert("Upload failed");
        };

        xhr.send(formData);
    }

    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) uploadFile(file);
    });

    dropZone.addEventListener('dragover', e => e.preventDefault());
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    });
}
