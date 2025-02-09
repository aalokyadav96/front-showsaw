import { displayPost } from '../../services/blog/postDisplay.js';

async function Post(isLoggedIn, postid, contentContainer) {
    contentContainer.innerHTML = '';
    displayPost(isLoggedIn, postid, contentContainer)
}

export { Post };
