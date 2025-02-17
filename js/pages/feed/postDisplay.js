import "../../../css/feedimages.css";
import { displayPost } from '../../services/feed/postDisplay.js';

async function Post(isLoggedIn, postid, contentContainer) {
    contentContainer.innerHTML = '';
    displayPost(isLoggedIn, postid, contentContainer)
}

export { Post };
