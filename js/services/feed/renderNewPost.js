import { SRC_URL, state } from "../../state/state.js";
// import AudioPlayer from '../../components/ui/AudioPlayer.mjs';
import SnackBar from '../../components/ui/Snackbar.mjs';
import { apiFetch } from "../../api/api.js";
import { fetchFeed } from "./fetchFeed.js";
import {RenderImagePost} from "./renderImagePost.js";
import {RenderVideoPost} from "./renderVideoPost.js";


function renderNewPost(post, i) {
    const postsContainer = document.getElementById("postsContainer");
    renderPost(post, postsContainer, i);
}


// Create Post Header
function createPostHeader(post) {
    return `
        <div class="post-header hflex">
            <a class="user-icon" href="/user/${post.username}">
                <img src="${SRC_URL}/userpic/thumb/${post.userid + ".jpg" || 'default.png'}" alt="Profile Picture" class="profile-thumb" />
            </a>
            <div class="user-time">
                <div class="username">${post.username}</div>
                <div class="timestamp">${post.timestamp}</div>
            </div>
        </div>
    `;
}


// Create Media Content
function createMediaContent(post, media) {
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'post-media';

    if (post.type === "image" && media.length > 0) {
        RenderImagePost(mediaContainer,media, post.media_url);
    } else if (post.type === "video" && media.length > 0) {
        RenderVideoPost(mediaContainer,media,post.media_url, post.resolution);
    }

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
    const media = Array.isArray(post.media) ? post.media : [];
    const isLoggedIn = state.token;
    const isCreator = isLoggedIn && state.user === post.userid;

    const postElement = document.createElement('article');
    postElement.classList.add('timeline-item');
    postElement.setAttribute("href", "./post/" + post.postid);
    postElement.setAttribute('date-is', new Date(post.timestamp).toLocaleString());

    postElement.innerHTML = createPostHeader(post);

    // if (post.type === "text") {
    //     postElement.innerHTML += `<div class="post-text">${post.text}</div>`;
    // } else if (post.type === "audio") {
    //     postElement.innerHTML += `<div class="post-text">${post.text}</div>`;
    //     const audio = AudioPlayer({ src: '#' });
    //     postElement.appendChild(audio);
    // } else {
        const mediaContent = createMediaContent(post, media);
        postElement.appendChild(mediaContent);
    // }

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
            await apiFetch(`/feed/post/${postId}`, 'DELETE');
            SnackBar("Post deleted successfully.", 3000);
            fetchFeed(); // Refresh the feed after deleting
        } catch (error) {
            SnackBar(`Error deleting post: ${error.message}`, 3000);
        }
    }
}


export { renderNewPost, renderPost };