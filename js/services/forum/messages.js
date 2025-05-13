import {  editMessage, deleteMessage } from './chatAPI.js';

async function handleEditMessage(chatID, messageId, oldContent) {
  const newContent = prompt('Edit your message:', oldContent);
  if (newContent === null || newContent.trim() === '') return;

  try {
    const updatedMessage = await editMessage(chatID, messageId, newContent);
    const msgDiv = document.querySelector(`[data-message-id="${messageId}"] .messageContent`);
    if (msgDiv) msgDiv.textContent = updatedMessage.content;
  } catch (err) {
    console.error('Failed to edit message:', err);
  }
}

async function handleDeleteMessage(messageId, chatId) {
  if (!confirm('Are you sure you want to delete this message?')) return;

  try {
    await deleteMessage(messageId, chatId);
    const msgDiv = document.querySelector(`[data-message-id="${messageId}"]`);
    if (msgDiv) msgDiv.remove();
  } catch (err) {
    console.error('Failed to delete message:', err);
  }
}

async function handleSearchMessages () {}



export {handleDeleteMessage, handleEditMessage, handleSearchMessages  };