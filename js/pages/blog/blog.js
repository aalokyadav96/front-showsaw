import { displayBlog } from "../../services/blog/blog.js";

async function Blog(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayBlog(contentContainer, isLoggedIn);
}

export { Blog };
