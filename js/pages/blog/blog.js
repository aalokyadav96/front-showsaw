import { displayBlog } from "../../services/blog/blogService.js";

async function Blog(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayBlog(isLoggedIn, contentContainer);
}

export { Blog };
