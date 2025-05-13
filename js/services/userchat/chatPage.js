import { apiFetch } from "../../api/api.js";
import { navigate } from "../../routes/index.js";
import { getState } from "../../state/state.js";

// export async function displayChat(contentContainer, chatid, isLoggedIn) {
//     contentContainer.innerHTML = "";

//     const chatContainer = document.createElement("div");
//     chatContainer.id = "chat-container";

//     const messagesList = document.createElement("ul");
//     messagesList.id = "messages-list";

//     const inputForm = createMessageForm(chatid, messagesList);
//     chatContainer.appendChild(messagesList);
//     chatContainer.appendChild(inputForm);
//     contentContainer.appendChild(chatContainer);

//     try {
//         const data = await apiFetch(`/chat/${chatid}`);
//         data.messages.forEach((msg) => {
//             addMessageToList(msg, chatid, messagesList);
//         });
//     } catch (err) {
//         console.error(err);
//         alert("Could not load chat.");
//     }
// }

export async function displayChat(chatContainer, chatid, isLoggedIn) {
    chatContainer.innerHTML = ""; // Only clear the right side

    const chatWrapper = document.createElement("div");
    chatWrapper.id = "chat-container";
    chatWrapper.style.display = "flex";
    chatWrapper.style.flexDirection = "column";
    chatWrapper.style.height = "100%";

    const messagesList = document.createElement("ul");
    messagesList.id = "messages-list";
    messagesList.style.flex = "1";
    messagesList.style.overflowY = "auto";
    messagesList.style.margin = "0";
    messagesList.style.padding = "1rem";

    const inputForm = createMessageForm(chatid, messagesList);
    chatWrapper.appendChild(messagesList);
    chatWrapper.appendChild(inputForm);
    chatContainer.appendChild(chatWrapper);

    try {
        const data = await apiFetch(`/chat/${chatid}`);
        data.messages.forEach((msg) => {
            addMessageToList(msg, chatid, messagesList);
        });
    } catch (err) {
        console.error(err);
        chatContainer.innerHTML = "<p style='padding: 1rem;'>Could not load chat.</p>";
    }
}

export function createMessageForm(chatid, messagesList) {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const sendBtn = document.createElement("button");

    input.type = "text";
    input.placeholder = "Type a message...";
    input.required = true;

    sendBtn.type = "submit";
    sendBtn.textContent = "Send";

    form.appendChild(input);
    form.appendChild(sendBtn);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        try {
            const res = await apiFetch(
                `/chat/${chatid}/message`,
                "POST",
                JSON.stringify({ text })
            );

            const message = await res;
            addMessageToList(message, chatid, messagesList);
            input.value = "";
        } catch (err) {
            console.error(err);
            if (err.status === 403) {
                alert("You are not a participant of this chat.");
            } else if (err.status === 401) {
                alert("You must be logged in to send messages.");
            } else {
                alert("Failed to send message.");
            }
        }
    });

    return form;
}

export function addMessageToList(message, chatid, list) {
    const li = document.createElement("li");
    li.dataset.id = message._id;

    const span = document.createElement("span");
    span.textContent = message.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    editBtn.onclick = () => editMessage(chatid, message._id, span);
    deleteBtn.onclick = () => deleteMessage(chatid, message._id, li);

    li.appendChild(span);

    if(isSender(message)) {
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
    }

    list.appendChild(li);
}

async function editMessage(chatid, messageid, spanEl) {
    const newText = prompt("Edit message:", spanEl.textContent);
    if (newText === null || newText.trim() === "") return;

    try {
        await apiFetch(
            `/chat/${chatid}/message/${messageid}`,
            "PUT",
            JSON.stringify({ text: newText })
        );
        spanEl.textContent = newText;
    } catch (err) {
        console.error(err);
        alert("Could not edit message.");
    }
}

async function deleteMessage(chatid, messageid, liEl) {
    if (!confirm("Delete this message?")) return;

    try {
        await apiFetch(`/chat/${chatid}/message/${messageid}`, "DELETE");
        liEl.remove();
    } catch (err) {
        console.error(err);
        alert("Could not delete message.");
    }
}

export async function userChatInit(targetUserId) {
    try {
        // const currentUserId = localStorage.getItem("user");
        const currentUserId = getState("user");
        if (!currentUserId || !targetUserId) {
            throw new Error("Missing user IDs");
        }

        const payload = {
            userA: currentUserId,
            userB: targetUserId,
        };

        const data = await apiFetch('/chats/init', 'POST', JSON.stringify(payload));

        if (!data.chatId) {
            throw new Error('Chat ID missing in response.');
        }

        navigate(`/chat/${data.chatId}`);
    } catch (err) {
        console.error(err);
        alert('Unable to start or find chat.');
    }
}

function isSender(message) {
    let user = getState("user");
    if (message.userid == user) {
        return true
    }
    return false
}

// import { apiFetch } from "../../api/api.js";
// import { navigate } from "../../routes/index.js";

// export async function displayChat(contentContainer, chatid, isLoggedIn) {
//     contentContainer.innerHTML = ""; // clear the container

//     const chatContainer = document.createElement("div");
//     chatContainer.id = "chat-container";

//     const messagesList = document.createElement("ul");
//     messagesList.id = "messages-list";

//     const inputForm = createMessageForm(chatid, messagesList);
//     chatContainer.appendChild(messagesList);
//     chatContainer.appendChild(inputForm);

//     contentContainer.appendChild(chatContainer);

//     try {
//         const res = await apiFetch(`/chat/${chatid}`);
//         // if (!res.ok) throw new Error("Failed to load chat.");

//         // const data = await res.json();
//         const data = await res;
//         data.messages.forEach((msg) => {
//             addMessageToList(msg, chatid, messagesList);
//         });
//     } catch (err) {
//         console.error(err);
//         alert("Could not load chat.");
//     }
// }

// function createMessageForm(chatid, messagesList) {
//     const form = document.createElement("form");
//     const input = document.createElement("input");
//     const sendBtn = document.createElement("button");

//     input.type = "text";
//     input.placeholder = "Type a message...";
//     input.required = true;

//     sendBtn.type = "submit";
//     sendBtn.textContent = "Send";

//     form.appendChild(input);
//     form.appendChild(sendBtn);

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const text = input.value.trim();
//         if (!text) return;

//         try {
//             // const res = await fetch(`/chat/${chatid}/message`, {
//             //     method: "POST",
//             //     headers: { "Content-Type": "application/json" },
//             //     body: JSON.stringify({ text }),
//             // });

//             // if (!res.ok) throw new Error("Failed to send message.");

//             // const message = await res.json(); 
            
//             const res = await apiFetch(`/chat/${chatid}/message`, "POST", JSON.stringify({ text }),
//             );

//             const message = await res;
//             addMessageToList(message, chatid, messagesList);
//             input.value = "";
//         } catch (err) {
//             console.error(err);
//             alert("Failed to send message.");
//         }
//     });

//     return form;
// }

// function addMessageToList(message, chatid, list) {
//     const li = document.createElement("li");
//     li.dataset.id = message._id;

//     const span = document.createElement("span");
//     span.textContent = message.text;

//     const editBtn = document.createElement("button");
//     editBtn.textContent = "Edit";

//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "Delete";

//     editBtn.onclick = () => editMessage(chatid, message._id, span);
//     deleteBtn.onclick = () => deleteMessage(chatid, message._id, li);

//     li.appendChild(span);
//     li.appendChild(editBtn);
//     li.appendChild(deleteBtn);

//     list.appendChild(li);
// }

// async function editMessage(chatid, messageid, spanEl) {
//     const newText = prompt("Edit message:", spanEl.textContent);
//     if (newText === null || newText.trim() === "") return;

//     try {
//         // const res = await fetch(`/chat/${chatid}/message/${messageid}`, {
//         //     method: "PUT",
//         //     headers: { "Content-Type": "application/json" },
//         //     body: JSON.stringify({ text: newText }),
//         // });

//         // if (!res.ok) throw new Error("Failed to edit message.");
//         const res = await apiFetch(`/chat/${chatid}/message/${messageid}`, "PUT",JSON.stringify({ text: newText }));
//         console.log(res);
//         spanEl.textContent = newText;
//     } catch (err) {
//         console.error(err);
//         alert("Could not edit message.");
//     }
// }

// async function deleteMessage(chatid, messageid, liEl) {
//     if (!confirm("Delete this message?")) return;

//     try {
//         const res = await apiFetch(`/chat/${chatid}/message/${messageid}`,"DELETE");

//         // if (!res.ok) throw new Error("Failed to delete message.");
//         liEl.remove();
//     } catch (err) {
//         console.error(err);
//         alert("Could not delete message.");
//     }
// }


// export async function userChatInit(targetUserId) {
//     alert(targetUserId);
//     try {
//         const currentUserId = localStorage.getItem("user"); // or however you're storing it
//         if (!currentUserId || !targetUserId) {
//             throw new Error("Missing user IDs");
//         }

//         const payload = {
//             userA: currentUserId,
//             userB: targetUserId,
//         };

//         const data = await apiFetch('/chats/init', 'POST', JSON.stringify(payload));

//         if (!data.chatId) {
//             throw new Error('Chat ID missing in response.');
//         }

//         navigate(`/chat/${data.chatId}`);
//     } catch (err) {
//         console.error(err);
//         alert('Unable to start or find chat.');
//     }
// }
