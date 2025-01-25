import { state } from "../../state/state.js";
import { createElement } from "../../components/createElement.js";
import Snackbar from "../../components/ui/Snackbar.mjs";
import { renderPost } from "./renderNewBlogPost.js";
import { apiFetch } from "../../api/api.js";

async function displayPost(isLoggedIn, postId, contentContainer) {

    try {
        const postData = await apiFetch(`/blog/post/${postId}`);
        const isCreator = isLoggedIn && state.user === postData.createdBy;

        if (!contentContainer) {
            contentContainer = document.getElementById("content");
        }
        contentContainer.innerHTML = "";

        renderPost(postData, contentContainer, 0)

    } catch (error) {
        contentContainer.innerHTML = "";
        contentContainer.appendChild(
            createElement("h1", {}, [`Error loading post details: ${error.message}`])
        );
        Snackbar("Failed to load post details. Please try again later.", 3000);
    }
}

export { displayPost };
