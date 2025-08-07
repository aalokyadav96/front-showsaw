import { createPost } from "../../services/posts/createPost.js";

async function CreatePost(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    createPost(isLoggedIn, contentContainer);
}

export { CreatePost };
