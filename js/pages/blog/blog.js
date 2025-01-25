import { displayBlog } from "../../services/blog/blogService.js";

function Blog(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayBlog(isLoggedIn, contentContainer);
}

export { Blog };
