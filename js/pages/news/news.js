import { displayNews } from "../../services/news/news.js";

async function News(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayNews(contentContainer, isLoggedIn);
}

export { News };
