import { SRC_URL, state } from "../../state/state.js";
import VideoPlayer from '../../components/ui/VideoPlayer.mjs';
import AudioPlayer from '../../components/ui/AudioPlayer.mjs';
import SnackBar from '../../components/ui/Snackbar.mjs';
import { opensLightbox, closesLightbox, changesImage } from "./lightbox.js";
import { apiFetch } from "../../api/api.js";
import { fetchBlog } from "./fetchBlog.js";


function renderNewPost(post, i) {
    const postsContainer = document.getElementById("postsContainer");
    renderPost(post, postsContainer, i);
}


// Initialize Lightbox
function initializeLightbox(postsContainer) {
    if (!document.getElementById("lightbox")) {
        postsContainer.insertAdjacentHTML('beforebegin', `
            <div id="lightbox" class="lightbox" style="display: none;">
                <span id="lightbox-close" class="close">&times;</span>
                <div class="lightbox-content">
                    <img id="lightbox-image" src="" alt="Lightbox Image" />
                    <div id="lightbox-caption" class="lightbox-caption"></div>
                </div>
                <button id="lightbox-prev" class="prev">❮</button>
                <button id="lightbox-next" class="next">❯</button>
            </div>
        `);

        document.getElementById("lightbox-close").addEventListener("click", closesLightbox);
        document.getElementById("lightbox-prev").addEventListener("click", () => changesImage(-1));
        document.getElementById("lightbox-next").addEventListener("click", () => changesImage(1));
    }
}

// Create Post Header
function createPostHeader(post) {
    return `
        <div class="post-header hflex">
            <a class="uzthcon" href="/user/${post.username}">
                <img src="${SRC_URL}/userpic/thumb/${post.userid + ".jpg" || 'default.png'}" alt="Profile Picture" class="profile-thumb" />
            </a>
            <div class="usertim">
                <div class="username">${post.username}</div>
            </div>
        </div>
    `;
}

function createMediaContent(post) {
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'post-media';

    const blogtit = document.createElement('h3');
    blogtit.innerText = post.title;
    const blogcunt = document.createElement('div');
    blogcunt.innerText = post.content;


    mediaContainer.appendChild(blogtit);
    mediaContainer.appendChild(blogcunt);
    return mediaContainer;
}



// Create Actions
function createActions(post, isLoggedIn, isCreator) {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'post-actions';

    if (isLoggedIn) {
        const likeButton = document.createElement('span');
        likeButton.className = 'like';
        likeButton.textContent = `Like (${post.likes})`;

        const commentButton = document.createElement('span');
        commentButton.className = 'comment';
        commentButton.textContent = "Comment";

        actionsContainer.appendChild(likeButton);
        actionsContainer.appendChild(commentButton);

        if (isCreator) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deletePost(post.postid, isLoggedIn));

            actionsContainer.appendChild(deleteButton);
        }
    }
    return actionsContainer;
}

// Update Timeline Styles
function updateTimelineStyles() {
    document.querySelectorAll('.timeline-item').forEach(item => {
        const profileImg = item.querySelector('.profile-thumb').src;
        item.style.setProperty('--after-bg', `url(${profileImg})`);
    });

    const style = document.createElement('style');
    style.textContent = `
        .timeline-item::after {
          background-image: var(--after-bg);
        }
      `;
    document.head.appendChild(style);
}

// Main Render Post Function
function renderPost(post, postsContainer, i) {
    // const media = Array.isArray(post.media) ? post.media : [];
    const isLoggedIn = state.token;
    const isCreator = isLoggedIn && state.user === post.userid;

    initializeLightbox(postsContainer);

    const postElement = document.createElement('article');
    postElement.classList.add('timeline-item');
    postElement.setAttribute("href", "./post/" + post.postid);
    postElement.setAttribute('date-is', new Date(post.timestamp).toLocaleString());

    postElement.innerHTML = createPostHeader(post);

    const mediaContent = createMediaContent(post);
    postElement.appendChild(mediaContent);


    const actions = createActions(post, isLoggedIn, isCreator);
    postElement.appendChild(actions);

    i ? postsContainer.appendChild(postElement) : postsContainer.prepend(postElement);

    updateTimelineStyles();
}



// Function to delete a post
async function deletePost(postId, isLoggedIn) {
    if (!isLoggedIn) {
        SnackBar("Please log in to delete your post.", 3000);
        return;
    }

    if (confirm("Are you sure you want to delete this post?")) {
        try {
            await apiFetch(`/blog/post/${postId}`, 'DELETE');
            SnackBar("Post deleted successfully.", 3000);
            fetchBlog(); // Refresh the blog after deleting
        } catch (error) {
            SnackBar(`Error deleting post: ${error.message}`, 3000);
        }
    }
}


export { renderNewPost, renderPost };