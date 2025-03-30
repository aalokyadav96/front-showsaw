import { apiFetch } from "../../api/api.js";
import { renderNewPost } from "./renderNewPost.js";
import { CheckFile, GetFileHash } from "../../utils/getFileHash.js";
import { createElement } from "../../components/createElement.js";

export function setupPostCreation() {
    // Get DOM elements
    const postButton = document.getElementById("postButton");
    const imageUpload = document.getElementById("imageUpload");
    const videoUpload = document.getElementById("videoUpload");
    const mediaPreview = document.getElementById("mediaPreview");
    const postTypeSelector = document.getElementById("postType");

    // State to track uploaded media items.
    // Each item is an object: { src, file, type }
    let uploadedMedia = [];

    // Event listeners
    postTypeSelector.addEventListener("change", handlePostTypeChange);
    postButton.addEventListener("click", handlePostButtonClick);
    imageUpload.addEventListener("change", (e) =>
        handleMediaFileChange(e, imageUpload, "image")
    );
    videoUpload.addEventListener("change", (e) =>
        handleMediaFileChange(e, videoUpload, "video")
    );

    // Change the visible file input based on selected post type
    function handlePostTypeChange(e) {
        const type = e.target.value;
        imageUpload.style.display = type === "image" ? "block" : "none";
        videoUpload.style.display = type === "video" ? "block" : "none";
        mediaPreview.innerHTML = ""; // Clear preview when type changes
        uploadedMedia = [];
    }

    // Handle the post button click by preparing files and sending a request
    async function handlePostButtonClick() {
        const type = postTypeSelector.value;
        const content = ""; // You can add a text field value if needed

        // Disable the post button while processing
        postButton.disabled = true;
        postButton.style.display = "none";

        // Proceed if there's text or any media element previewed
        if (
            content ||
            mediaPreview.querySelector("img") ||
            mediaPreview.querySelector("video")
        ) {
            let files = [];
            if (type === "image") {
                files = Array.from(imageUpload.files);
            } else if (type === "video") {
                files = Array.from(videoUpload.files);
            }
            await addPost(type, content, files);
        }
    }

    // Process media files: validate, read, check duplicates, and render preview
    async function handleMediaFileChange(event, inputElement, mediaType) {
        Array.from(event.target.files).forEach(async (file) => {
            // Validate the file before processing
            if (!validateFile(file, mediaType)) {
                alert(
                    `Invalid ${mediaType} file. Please ensure it is a ${mediaType === "image" ? "image" : "video"
                    } and its size is between 10KB and 1GB.`
                );
                return;
            }

            let res = await CheckFile(file);
            console.log("diskchk : ", res.exists);
            if (res.exists == true) {
                alert(`You already uploaded the file ${res.url}`);
                console.log("diskchk : ", res.url);
            }
            if (res.postid) {
                mediaPreview.appendChild(createElement('a', { href: `/post/${res.postid}` }, ["Go To Post"]));
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const mediaSrc = e.target.result;

                // Check for duplicates using the file's data URL
                if (uploadedMedia.some((item) => item.src === mediaSrc)) {
                    alert(`This ${mediaType} has already been uploaded.`);
                    return;
                }

                // Create the media element and its preview wrapper
                const mediaElement = createMediaElement(mediaSrc, mediaType);
                const mediaWrapper = createMediaWrapper(
                    mediaElement,
                    mediaType,
                    file,
                    inputElement
                );
                mediaPreview.appendChild(mediaWrapper);

                // Track the file so we can avoid duplicate uploads and later remove it
                uploadedMedia.push({ src: mediaSrc, file, type: mediaType });
            };
            reader.readAsDataURL(file);
        });
    }

    // Create an image or video element based on mediaType
    function createMediaElement(src, mediaType) {
        if (mediaType === "image") {
            const img = new Image();
            img.src = src;
            return img;
        } else if (mediaType === "video") {
            const video = document.createElement("video");
            video.src = src;
            video.controls = true;
            return video;
        }
    }

    // Create a wrapper element for the media element with a remove button
    function createMediaWrapper(mediaElement, mediaType, file, inputElement) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("media-preview-item");

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-btn");
        removeButton.addEventListener("click", () => {
            wrapper.remove();
            // Remove from the uploadedMedia array using the data URL as identifier
            uploadedMedia = uploadedMedia.filter(
                (item) => item.src !== mediaElement.src
            );
            // Remove file from the corresponding file input element
            removeFileFromInput(inputElement, file);
        });

        wrapper.appendChild(mediaElement);
        wrapper.appendChild(removeButton);
        return wrapper;
    }

    // Remove a file from an input element using DataTransfer to rebuild the FileList
    function removeFileFromInput(inputElement, fileToRemove) {
        const dt = new DataTransfer();
        Array.from(inputElement.files)
            .filter((file) => file !== fileToRemove)
            .forEach((file) => dt.items.add(file));
        inputElement.files = dt.files;
    }

    // Validate file type and size (between 10KB and 1GB)
    function validateFile(file, mediaType) {
        if (mediaType === "image" && !file.type.startsWith("image/")) return false;
        if (mediaType === "video" && !file.type.startsWith("video/")) return false;
        const minSize = 10 * 1024; // 10KB
        const maxSize = 1024 * 1024 * 1024; // 1GB
        if (file.size < minSize || file.size > maxSize) return false;
        return true;
    }

    // Add a new post by sending a FormData request via API
    // async function addPost(type, content, files) {
    //     const formData = new FormData();
    //     formData.append("type", type);
    //     formData.append("text", content);
    //     files.forEach((file) =>
    //         formData.append(type === "image" ? "images" : "videos", file)
    //     );

    //     try {
    //         const data = await apiFetch("/feed/post", "POST", formData);
    //         if (data.ok) {
    //             renderNewPost(data.data, 0);
    //             clearPostForm();
    //         } else {
    //             alert("Failed to post");
    //         }
    //     } catch (error) {
    //         console.error("Error posting:", error);
    //         alert("There was an error posting your content.");
    //     }
    // }

    async function addPost(type, content, files) {
        const formData = new FormData();
        formData.append("type", type);
        formData.append("text", content);
        files.forEach((file) => {
            const fileHash = GetFileHash(file);
            console.log("File Hash:", fileHash);
            formData.append("hash", fileHash);
            formData.append(type === "image" ? "images" : "videos", file)
        });

        try {
            const data = await apiFetch("/feed/post", "POST", formData);
            if (data.ok) {
                renderNewPost(data.data, 0);
                clearPostForm();
            } else {
                alert("Failed to post");
            }
        } catch (error) {
            console.error("Error posting:", error);
            alert("There was an error posting your content.");
        }
    }

    // Clear the post creation form and reset state
    function clearPostForm() {
        mediaPreview.innerHTML = "";
        imageUpload.value = "";
        videoUpload.value = "";
        uploadedMedia = [];
    }
}
