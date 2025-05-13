import { displayNewsPost } from "../../services/news/newsPage.js";

async function News(isLoggedIn, newsID, contentContainer) {
    contentContainer.innerHTML = '';
    displayNewsPost(contentContainer, newsID, isLoggedIn);
}

export { News };
