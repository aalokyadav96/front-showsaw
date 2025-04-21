import { renderPost } from "./renderPost.js";

export function renderNewPost(post, i) {
    const postsContainer = document.getElementById("postsContainer");
    renderPost(post, postsContainer, i);
}
