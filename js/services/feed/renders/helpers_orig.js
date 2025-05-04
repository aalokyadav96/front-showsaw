import { SRC_URL, state } from "../../../state/state.js";
import Snackbar from "../../../components/ui/Snackbar.mjs";
import { apiFetch } from "../../../api/api.js";
import { fetchFeed } from "../fetchFeed.js";

export function createPostHeader(post) {
    return `
        <div class="post-header hflex">
            <a class="user-icon" href="/user/${post.username}">
                <img loading="lazy" src="${SRC_URL}/userpic/thumb/${post.userid + ".jpg" || 'default.png'}" alt="Profile Picture" class="profile-thumb" />
            </a>
            <div class="user-time">
                <div class="username">${post.username}</div>
                <div class="timestamp">${post.timestamp}</div>
            </div>
        </div>
    `;
}

export function createActions(post, isLoggedIn, isCreator) {
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "post-actions";

    if (isLoggedIn) {
        const likeButton = document.createElement("span");
        likeButton.className = "like";
        likeButton.textContent = `Like (${post.likes})`;

        const commentButton = document.createElement("span");
        commentButton.className = "comment";
        commentButton.textContent = "Comment";

        actionsContainer.appendChild(likeButton);
        actionsContainer.appendChild(commentButton);

        if (isCreator) {
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deletePost(post.postid));
            actionsContainer.appendChild(deleteButton);
        }
    }

    return actionsContainer;
}

export function updateTimelineStyles() {
    document.querySelectorAll(".feed-item").forEach(item => {
        const profileImg = item.querySelector(".profile-thumb")?.src || "";
        item.style.setProperty("--after-bg", `url(${profileImg})`);
    });

    const style = document.createElement("style");
    style.textContent = `.feed-item::after { background-image: var(--after-bg); }`;
    document.head.appendChild(style);
}

async function deletePost(postId) {
    if (!state.token) {
        Snackbar("Please log in to delete your post.", 3000);
        return;
    }

    if (confirm("Are you sure you want to delete this post?")) {
        try {
            await apiFetch(`/feed/post/${postId}`, "DELETE");
            Snackbar("Post deleted successfully.", 3000);
            fetchFeed(); // Refresh feed
        } catch (err) {
            Snackbar(`Error deleting post: ${err.message}`, 3000);
        }
    }
}
