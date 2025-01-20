import { SRC_URL, state } from "../../state/state.js";
import VideoPlayer from '../../components/ui/VideoPlayer.mjs';
import AudioPlayer from '../../components/ui/AudioPlayer.mjs';
import SnackBar from '../../components/ui/Snackbar.mjs';
import {opensLightbox, closesLightbox, changesImage} from "./lightbox.js";
import { apiFetch } from "../../api/api.js";
import { fetchFeed } from "./fetchFeed.js";

function renderNewPost( post, i) {
    const postsContainer = document.getElementById("postsContainer");
    const media = Array.isArray(post.media) ? post.media : [];
    const isLoggedIn = state.token;
    const isCreator = isLoggedIn && state.user === post.userid;

    // Append the Lightbox HTML only once
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

        // Attach lightbox navigation and close events
        document.getElementById("lightbox-close").addEventListener("click", closesLightbox);
        document.getElementById("lightbox-prev").addEventListener("click", () => changesImage(-1));
        document.getElementById("lightbox-next").addEventListener("click", () => changesImage(1));
    }

    // Create the post element
    const postElement = document.createElement('article');
    postElement.classList.add('timeline-item');
    postElement.setAttribute('date-is', new Date(post.timestamp).toLocaleString());

    // Post header
    postElement.innerHTML = `
        <div class="post-header hflex">
            <a class="uzthcon" href="/user/${post.username}">
                <img src="${SRC_URL}/userpic/thumb/${post.userid + ".jpg" || 'default.png'}" alt="Profile Picture" class="profile-thumb" />
            </a>
            <div class="usertim">
            <div class="username">${post.username}</div>
            </div>
        </div>
    `;

    // Handle text posts
    if (post.type === "text") {
        postElement.innerHTML += `<div class="post-text">${post.text}</div>`;
    }

    // Handle audio posts
    if (post.type === "audio") {
        postElement.innerHTML += `<div class="post-text">${post.text}</div>`;

        const audio = AudioPlayer({
            src: '#',
        });

        postElement.appendChild(audio);
    }

    // Handle image posts
    if (post.type === "image" && media.length > 0) {
        const mediaClasses = [
            'PostPreviewImageView_-one__-6MMx',
            'PostPreviewImageView_-two__WP8GL',
            'PostPreviewImageView_-three__HLsVN',
            'PostPreviewImageView_-four__fYIRN',
            'PostPreviewImageView_-five__RZvWx',
            'PostPreviewImageView_-six__EG45r',
            'PostPreviewImageView_-seven__65gnj',
            'PostPreviewImageView_-eight__SoycA'
        ];

        const classIndex = Math.min(media.length - 1, mediaClasses.length - 1);
        const assignedClass = mediaClasses[classIndex];

        const imageList = document.createElement('ul');
        imageList.className = `preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- ${assignedClass}`;
        media.forEach((img, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'PostPreviewImageView_image_item__dzD2P';

            const image = document.createElement('img');
            image.src = `${SRC_URL+img}`;
            // image.src = `./postpic/${img}.jpg`;
            image.alt = "Post Image";
            image.className = 'post-image PostPreviewImageView_post_image__zLzXH';
            image.addEventListener("click", () => opensLightbox(img, media.length, index, media));

            listItem.appendChild(image);
            imageList.appendChild(listItem);
        });

        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'post-media';
        mediaContainer.appendChild(imageList);

        postElement.appendChild(mediaContainer);
    }

    // Handle video posts
    if (post.type === "video" && media.length > 0) {
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'post-media';

        media.forEach(videoSrc => {
            const videox = VideoPlayer({
                src: `${SRC_URL}${videoSrc}`,
                className: 'post-video',
                muted: true,
                poster: '',
                controls: false,
            });

            mediaContainer.appendChild(videox);
        });
        postElement.appendChild(mediaContainer);
    }

    // Actions
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
            deleteButton.addEventListener("click", () => deletePost(post.id));

            actionsContainer.appendChild(deleteButton);
        }
    }

    postElement.appendChild(actionsContainer);

    // Append the post
    i ? postsContainer.appendChild(postElement) : postsContainer.prepend(postElement);

    after();
}

function after() {
    document.querySelectorAll('.timeline-item').forEach(item => {
        // Find the src of the profile image inside the item
        const profileImg = item.querySelector('.profile-thumb').src;
        // Add a custom CSS variable to the element
        item.style.setProperty('--after-bg', `url(${profileImg})`);
    });

    // Update the CSS to use the custom property
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item::after {
          background-image: var(--after-bg);
        }
      `;
    document.head.appendChild(style);
}



// Function to delete a post
async function deletePost(postId) {
    // if (!isLoggedIn) {
    //     SnackBar("Please log in to delete your post.", 3000);
    //     return;
    // }

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


export { renderNewPost };