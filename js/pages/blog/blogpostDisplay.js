import { displayPost } from '../../services/feed/postDisplay.js';

function Post(isLoggedIn, postid, contentContainer) {
    contentContainer.innerHTML = '';
    displayPost(isLoggedIn, postid, contentContainer)
}

export { Post };
