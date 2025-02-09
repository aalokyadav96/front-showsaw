import { apiFetch } from "../../api/api.js";
import { renderNewPost } from "./renderNewBlogPost.js";

// Function to set up event listeners for blog post creation
function setupPostCreation() {
    const postButton = document.getElementById("postButton");
    const titleInput = document.getElementById("titleInput");
    const contentInput = document.getElementById("contentInput");

    postButton.addEventListener("click", () => handlePostButtonClick(titleInput, contentInput));
}

// Function to handle the post button click
function handlePostButtonClick(titleInput, contentInput) {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // Ensure required fields are filled
    if (!title || !content) {
        alert("Title and content cannot be empty.");
        return;
    }

    // Add the blog post
    addPost(title, content);
}

// Function to add a new blog post via API and update the blog
async function addPost(title, content) {
    const payload = {
        title,
        content,
        type: "blog",  // Assuming the post type is "blog" for this case
        text: content, // Backend expects 'text' as part of the payload
    };

    try {
        const data = await apiFetch("/blog/post", "POST", JSON.stringify(payload), {
            "Content-Type": "application/json"
        });

        if (data.ok) {
            renderNewPost(data.data, 0); // Render the newly posted content
            clearPostForm();            // Clear the post form
        } else {
            alert("Failed to post. Please try again.");
        }
    } catch (error) {
        console.error("Error posting:", error);
        alert("There was an error posting your content.");
    }
}

// Function to clear the post creation form
function clearPostForm() {
    document.getElementById("titleInput").value = "";
    document.getElementById("contentInput").value = "";
}

export { setupPostCreation };