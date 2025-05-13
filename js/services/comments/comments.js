// comments.js

// import { reportPost } from "../reporting/reporting.js";

//         // Report button
//         const reportButton = document.createElement("button");
//         reportButton.className = "report-btn";
//         reportButton.textContent = "Report";
//         reportButton.addEventListener("click", () => {
//             reportPost(msg.message_id);
//         });
export function createCommentsSection(postId, comments = []) {
    const container = document.createElement("div");
    container.className = "comments-section";

    const list = document.createElement("div");
    list.className = "comments-list";
    container.appendChild(list);

    const form = createCommentForm(postId, newComment => {
        addCommentToDOM(list, newComment);
    });

    container.appendChild(form);

    // Load initial comments
    comments.forEach(comment => addCommentToDOM(list, comment));

    return container;
}

function createCommentForm(postId, onCommentAdded) {
    const form = document.createElement("form");
    form.className = "comment-form";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write a comment...";
    input.required = true;

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Post";

    form.appendChild(input);
    form.appendChild(submit);

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const content = input.value.trim();
        if (!content) return;

        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content })
            });
            const data = await res.json();
            input.value = "";
            onCommentAdded(data);
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    });

    return form;
}

function addCommentToDOM(container, comment) {
    const wrapper = document.createElement("div");
    wrapper.className = "comment";
    wrapper.dataset.commentId = comment._id;

    const text = document.createElement("span");
    text.textContent = comment.content;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-comment";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-comment";

    editBtn.addEventListener("click", () => handleEditComment(wrapper, comment));
    deleteBtn.addEventListener("click", () => handleDeleteComment(wrapper, comment._id));

    wrapper.appendChild(text);
    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);

    container.appendChild(wrapper);
}

async function handleEditComment(wrapper, comment) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = comment.content;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";

    wrapper.innerHTML = "";
    wrapper.appendChild(input);
    wrapper.appendChild(saveBtn);

    saveBtn.addEventListener("click", async () => {
        const newContent = input.value.trim();
        if (!newContent) return;

        try {
            const res = await fetch(`/api/comments/${comment._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newContent })
            });
            const data = await res.json();
            comment.content = data.content;

            wrapper.innerHTML = "";
            addCommentToDOM(wrapper.parentElement, comment);
            wrapper.remove(); // Remove old wrapper
        } catch (err) {
            console.error("Failed to update comment", err);
        }
    });
}

async function handleDeleteComment(wrapper, commentId) {
    try {
        await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
        wrapper.remove();
    } catch (err) {
        console.error("Failed to delete comment", err);
    }
}
