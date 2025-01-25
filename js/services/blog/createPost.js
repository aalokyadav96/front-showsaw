import { apiFetch } from "../../api/api.js";
import { renderNewPost } from "./renderNewBlogPost.js";

// Function to set up event listeners for blog post creation
function setupPostCreation() {
    const postButton = document.getElementById("postButton");
    const titleInput = document.getElementById("titleInput");
    const contentInput = document.getElementById("contentInput");
    const categorySelector = document.getElementById("categorySelector");

    postButton.addEventListener("click", () => handlePostButtonClick(titleInput, contentInput, categorySelector));
}

// Function to handle the post button click
function handlePostButtonClick(titleInput, contentInput, categorySelector) {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const category = categorySelector.value;

    // Ensure required fields are filled
    if (!title || !content) {
        alert("Title and content cannot be empty.");
        return;
    }

    // Add the blog post
    addPost(title, content, category);
}

// Function to add a new blog post via API and update the blog
async function addPost(title, content, category) {
    const payload = {
        title,
        content,
        category,
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
    document.getElementById("categorySelector").selectedIndex = 0;
}

export { setupPostCreation };


// import { apiFetch } from "../../api/api.js";
// import { renderNewPost } from "./renderNewBlogPost.js";

// // Function to set up event listeners for blog post creation
// function setupPostCreation() {
//     const postButton = document.getElementById("postButton");
//     const titleInput = document.getElementById("titleInput");
//     const contentInput = document.getElementById("contentInput");
//     const categorySelector = document.getElementById("categorySelector");

//     postButton.addEventListener("click", () => handlePostButtonClick(titleInput, contentInput, categorySelector));
// }

// // Function to handle the post button click
// function handlePostButtonClick(titleInput, contentInput, categorySelector) {
//     const title = titleInput.value.trim();
//     const content = contentInput.value.trim();
//     const category = categorySelector.value;

//     // Ensure required fields are filled
//     if (!title || !content) {
//         alert("Title and content cannot be empty.");
//         return;
//     }

//     // Add the blog post
//     addPost(title, content, category);
// }

// // Function to add a new blog post via API and update the blog
// async function addPost(title, content, category) {
//     const payload = {
//         title,
//         content,
//         category,
//     };

//     try {
//         const data = await apiFetch("/blog/post", "POST", JSON.stringify(payload), {
//             "Content-Type": "application/json"
//         });

//         if (data.ok) {
//             renderNewPost(data.data, 0); // Render the newly posted content
//             clearPostForm();            // Clear the post form
//         } else {
//             alert("Failed to post. Please try again.");
//         }
//     } catch (error) {
//         console.error("Error posting:", error);
//         alert("There was an error posting your content.");
//     }
// }

// // Function to clear the post creation form
// function clearPostForm() {
//     document.getElementById("titleInput").value = "";
//     document.getElementById("contentInput").value = "";
//     document.getElementById("categorySelector").selectedIndex = 0;
// }

// export { setupPostCreation };
