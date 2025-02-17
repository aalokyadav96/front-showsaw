import "../../../css/feedimages.css";
import "../../../css/feedpage.css";
import { displayFeed } from "../../services/feed/feedService.js";

async function Feed(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayFeed(isLoggedIn, contentContainer);
}

export { Feed };
