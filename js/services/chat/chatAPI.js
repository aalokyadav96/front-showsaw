import { apixFetch } from "../../api/api.js";
import {CHAT_URL} from "../../state/state.js";
// chatAPI.js
// export const CHAT_URL = "http://localhost:8080";
export {CHAT_URL};

export async function getContacts() {
  const response = await apixFetch(`${CHAT_URL}/contacts`);
  return response;
}

export async function getChats() {
  const response = await apixFetch(`${CHAT_URL}/chats`);
  return response;
}

export async function getMessages(chatId) {
  const response = await apixFetch(`${CHAT_URL}/messages?chat_id=${chatId}`);
  return response;
}

export async function sendMessage(formData) {
  const response = await apixFetch(`${CHAT_URL}/messages/send`, 'POST', formData);
  return response;
}

export async function createChat(contactId) {
  const response = await apixFetch(`${CHAT_URL}/chats/create`, 'POST', JSON.stringify({ contact_id: contactId }));
  return response;
}

export async function deleteChat(chatId) {
  const response = await apixFetch(`${CHAT_URL}/chats/${chatId}`, 'DELETE');
  if (!response.deleted) throw new Error("Chat deletion failed");
}


export async function editMessage(chatID, messageId, newContent) {
  const response = await apixFetch(`${CHAT_URL}/messages/edit`, 'PUT', JSON.stringify({ chat_id: chatID, message_id: messageId, new_content: newContent }));
  return response;
}

export async function deleteMessage(messageId, chatId) {
  const response = await apixFetch(`${CHAT_URL}/messages/delete`, 'DELETE', JSON.stringify({ chat_id: chatId, message_id: messageId }));
  return response;
}
