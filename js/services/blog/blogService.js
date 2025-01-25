import { navigate } from "../../routes/index.js";
import { opensLightbox, closesLightbox, changesImage } from "./lightbox.js";
import { setupPostCreation } from "./createPost.js";
import { fetchBlog } from "./fetchBlog.js";

async function displayBlog(isLoggedIn, blogsec) {
    if (!isLoggedIn) {
        navigate('/login');
        return;
    }

    blogsec.appendChild(generateBlogHTML());

    // Set up event listeners for post creation
    setupPostCreation();
    fetchBlog();
}

function generateBlogHTML() {
    // Create the container div
    const container = document.createElement('div');
    container.className = 'container';

    // Create the main blog section
    const main = document.createElement('main');
    main.className = 'blog';

    // Create the post-compose div
    const postCompose = document.createElement('div');
    postCompose.className = 'post-compose';

    // Create the post header div with the input elements
    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';

    const titleInput = document.createElement('input');
    titleInput.id = 'titleInput';
    titleInput.className = 'post-title-input';
    titleInput.type = 'text';
    titleInput.placeholder = 'Enter post title';

    const categorySelector = document.createElement('select');
    categorySelector.id = 'categorySelector';
    categorySelector.className = 'category-selector';

    const defaultOption = new Option('Select Category', '');
    const techOption = new Option('Tech', 'tech');
    const lifestyleOption = new Option('Lifestyle', 'lifestyle');
    const travelOption = new Option('Travel', 'travel');

    categorySelector.add(defaultOption);
    categorySelector.add(techOption);
    categorySelector.add(lifestyleOption);
    categorySelector.add(travelOption);

    postHeader.appendChild(titleInput);
    postHeader.appendChild(categorySelector);

    // Create the content input area
    const contentInput = document.createElement('textarea');
    contentInput.id = 'contentInput';
    contentInput.className = 'content-input';
    contentInput.placeholder = 'Write your post here...';

    // Create the post button
    const postButton = document.createElement('button');
    postButton.id = 'postButton';
    postButton.className = 'post-button';
    postButton.textContent = 'Post';

    // Assemble the post-compose section
    postCompose.appendChild(postHeader);
    postCompose.appendChild(contentInput);
    postCompose.appendChild(postButton);

    // Create the posts container section
    const postsContainer = document.createElement('section');
    postsContainer.id = 'postsContainer';
    postsContainer.className = 'container';

    // Assemble the main section
    main.appendChild(postCompose);
    main.appendChild(postsContainer);

    // Add the main section to the container
    container.appendChild(main);

    // Append the container to the body or desired parent
    return container;
}

export { displayBlog, opensLightbox, closesLightbox, changesImage, generateBlogHTML };
