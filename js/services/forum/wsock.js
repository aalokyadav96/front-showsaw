import {appendMessage} from "./msgAppend";
// --------------------------
// WebSocket Setup
// --------------------------
export function setupWebSocket() {
    const ws = new WebSocket(`ws://${window.location.host}/ws/forums`);
    ws.addEventListener('message', handleWebSocketMessage);
}

function handleWebSocketMessage(event) {
    const newMsg = JSON.parse(event.data);
    if (newMsg.type === 'edit') {
        document.querySelector(`[data-message-id="${newMsg.message_id}"] .messageContent`).textContent = newMsg.new_content;
    } else if (newMsg.type === 'delete') {
        document.querySelector(`[data-message-id="${newMsg.message_id}"]`).remove();
    } else if (parseInt(newMsg.chat_id) === CURRENT_CHAT_ID) {
        appendMessage(newMsg);
    }
}
