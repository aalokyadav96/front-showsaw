import { displaySearch } from "../../services/search/searchService.js";

async function Search(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displaySearch(isLoggedIn, contentContainer);
}

export { Search };
