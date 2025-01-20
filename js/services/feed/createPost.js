import { apiFetch } from "../../api/api.js";
import { renderNewPost } from "./renderNewPost.js";

// Function to set up event listeners for post creation and media upload
function setupPostCreation() {
    const postButton = document.getElementById("postButton");
    const imageUpload = document.getElementById("imageUpload");
    const videoUpload = document.getElementById("videoUpload");
    const mediaPreview = document.getElementById("mediaPreview");
    const postTypeSelector = document.getElementById("postType");

    let uploadedImages = []; // Track uploaded image URLs to prevent duplicates

    // Change media input based on post type
    postTypeSelector.addEventListener('change', (e) => handlePostTypeChange(e, imageUpload, videoUpload, mediaPreview));

    postButton.addEventListener('click', () => handlePostButtonClick(postTypeSelector, mediaPreview, imageUpload, videoUpload, uploadedImages));

    // Handle media file previews
    imageUpload.addEventListener('change', (event) => handleMediaFileChange(event, imageUpload, mediaPreview, uploadedImages, 'image'));
    videoUpload.addEventListener('change', (event) => handleMediaFileChange(event, videoUpload, mediaPreview, uploadedImages, 'video'));

    // Allow image paste into the media preview area
    mediaPreview.addEventListener('paste', (event) => handleImagePaste(event, imageUpload, uploadedImages));
}

// Function to handle post type change
function handlePostTypeChange(event, imageUpload, videoUpload, mediaPreview) {
    const type = event.target.value;
    imageUpload.style.display = type === 'image' ? 'block' : 'none';
    videoUpload.style.display = type === 'video' ? 'block' : 'none';
    mediaPreview.innerHTML = ''; // Clear preview when changing type
}

// Function to handle the post button click
function handlePostButtonClick(postTypeSelector, mediaPreview, imageUpload, videoUpload, uploadedImages) {
    const content = "";
    const selectedType = postTypeSelector.value;

    // Only proceed if there's content or media
    if (content || mediaPreview.querySelector('img') || mediaPreview.querySelector('video')) {
        let files = [];
        if (selectedType === 'image') {
            files = Array.from(imageUpload.files);
        } else if (selectedType === 'video') {
            files = Array.from(videoUpload.files);
        }
        addPost(selectedType, content, files);
    }
}

// Function to handle media file change (image/video)
function handleMediaFileChange(event, uploadElement, mediaPreview, uploadedImages, mediaType) {
    Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const mediaSrc = e.target.result;

            // Check for duplicates
            if (uploadedImages.includes(mediaSrc)) {
                alert(`This ${mediaType} has already been uploaded.`);
                return;
            }

            const mediaElement = createMediaElement(mediaSrc, mediaType);
            const mediaWrapper = createMediaWrapper(mediaElement, mediaType);

            mediaPreview.appendChild(mediaWrapper);
            uploadedImages.push(mediaSrc);
        };
        reader.readAsDataURL(file);
    });
}

// Function to create media element (image/video)
function createMediaElement(src, type) {
    let mediaElement;
    if (type === 'image') {
        mediaElement = new Image();
        mediaElement.src = src;
    } else if (type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.src = src;
        mediaElement.controls = true;
    }
    return mediaElement;
}

// Function to create a media wrapper (with remove button)
function createMediaWrapper(mediaElement, mediaType) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('media-preview-item');

    const removeButton = document.createElement('button');
    removeButton.textContent = 'R';
    removeButton.classList.add('remove-btn');
    removeButton.addEventListener('click', () => handleRemoveMedia(wrapper, mediaElement, mediaType));

    wrapper.appendChild(mediaElement);
    wrapper.appendChild(removeButton);
    return wrapper;
}

// Function to handle removing a media item
function handleRemoveMedia(wrapper, mediaElement, mediaType) {
    wrapper.remove();
    uploadedImages = uploadedImages.filter(image => image !== mediaElement.src);

    // Handle file removal from input
    removeFileFromInput(mediaType === 'image' ? imageUpload : videoUpload, mediaElement);
}

// Function to handle pasting images into the media preview area
function handleImagePaste(event, imageUpload, uploadedImages) {
    const clipboardData = event.clipboardData;
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.indexOf('image') === 0) {
            const blob = item.getAsFile();
            const reader = new FileReader();

            reader.onload = (e) => {
                const imgSrc = e.target.result;

                // Prevent duplicate image paste
                if (uploadedImages.includes(imgSrc)) {
                    alert("This image has already been uploaded.");
                    return;
                }

                const img = new Image();
                img.src = imgSrc;

                // // Create a wrapper for the image and a remove button
                // const imgWrapper = createMediaWrapper(img, 'image');

                // Add image to the uploaded images tracker
                uploadedImages.push(imgSrc);

                // Convert base64 image to File object and add to FormData (for saving)
                const byteCharacters = atob(imgSrc.split(',')[1]);
                const byteArray = new Uint8Array(byteCharacters.length);

                for (let i = 0; i < byteCharacters.length; i++) {
                    byteArray[i] = byteCharacters.charCodeAt(i);
                }

                const file = new File([byteArray], "pasted-image.png", { type: 'image/png' });

                // Append the file to the image input for upload
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                imageUpload.files = dataTransfer.files;
            };

            reader.readAsDataURL(blob);
            event.preventDefault(); // Prevent default paste handling
        }
    }
}

// Helper function to remove the file from the file input list
function removeFileFromInput(inputElement, fileToRemove) {
    const fileList = Array.from(inputElement.files);
    const index = fileList.indexOf(fileToRemove);

    if (index !== -1) {
        fileList.splice(index, 1);  // Remove the file from the list
        // Recreate the FileList and update the input element
        const dataTransfer = new DataTransfer();
        fileList.forEach(file => dataTransfer.items.add(file));
        inputElement.files = dataTransfer.files;
    }
}

// Function to add a new post via API and update the feed
async function addPost(type, content, files) {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('text', content);

    files.forEach(file => formData.append(type === 'image' ? 'images' : 'videos', file));

    try {
        const data = await apiFetch('/feed/post', 'POST', formData);
        if (data.ok) {
            renderNewPost(data.data, 0);  // Render the newly posted content
            clearPostForm();             // Clear the post form
        } else {
            alert('Failed to post');
        }
    } catch (error) {
        console.error('Error posting:', error);
        alert('There was an error posting your content.');
    }
}

// Function to clear the post creation form
function clearPostForm() {
    document.getElementById("mediaPreview").innerHTML = '';
    document.getElementById("imageUpload").value = '';
    document.getElementById("videoUpload").value = '';
}

export { setupPostCreation };