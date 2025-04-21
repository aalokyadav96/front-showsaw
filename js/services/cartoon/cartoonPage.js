import { SRC_URL, apiFetch } from "../../api/api";
import { editCartoonForm, deleteCartoonForm } from "./editCartoon";

export async function displayCartoon(contentContainer, cartoonID, isLoggedIn) {
    // Clear existing content
    while (contentContainer.firstChild) {
        contentContainer.removeChild(contentContainer.firstChild);
    }
    
    let isCreator = true;

    // Create a container for the cartoon information
    const cartoonDiv = document.createElement("div");
    cartoonDiv.className = "cartoon-container";

    try {
        // Fetch cartoon details from the server
        const response = await apiFetch(`/cartoons/${cartoonID}`);
        // if (!response.ok) {
        //     throw new Error("Failed to fetch cartoon details");
        // }

        // const cartoon = await response.json();
        const cartoon = await response;

        // Create and display cartoon details
        const header = document.createElement("h2");
        header.textContent = cartoon.name;
        cartoonDiv.appendChild(header);

        const cartoonDetails = `
            <p><strong>Cartoon Type:</strong> ${cartoon.category}</p>
            <p><strong>Biography:</strong> ${cartoon.bio}</p>
            <p><strong>Date of Birth:</strong> ${cartoon.dob}</p>
            <p><strong>Place:</strong> ${cartoon.place}, ${cartoon.country}</p>
            <p><strong>Genres:</strong> ${cartoon.genres.join(", ")}</p>
        `;
        cartoonDiv.innerHTML += cartoonDetails;

        // Add socials (if available)
        if (cartoon.socials) {
            const socialsDiv = document.createElement("div");
            socialsDiv.className = "socials";
            socialsDiv.innerHTML = `<p><strong>Socials:</strong></p>`;
            for (const [platform, url] of Object.entries(cartoon.socials)) {
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.textContent = platform;
                socialsDiv.appendChild(link);
            }
            cartoonDiv.appendChild(socialsDiv);
        }

        // Add cartoon photo
        if (cartoon.photo) {
            const photo = document.createElement("img");
            photo.src = `${SRC_URL}/cartoonpic/photo/${cartoon.photo}`;
            photo.alt = `${cartoon.name}'s photo`;
            photo.className = "cartoon-photo";
            cartoonDiv.appendChild(photo);
        }

        // Add cartoon banner
        if (cartoon.banner) {
            const banner = document.createElement("img");
            banner.src = `${SRC_URL}/cartoonpic/banner/${cartoon.banner}`;
            banner.alt = `${cartoon.name}'s banner`;
            banner.className = "cartoon-banner";
            cartoonDiv.appendChild(banner);
        }

        let editcartoon = document.createElement('div');
        editcartoon.id = 'editcartoon';
        cartoonDiv.appendChild(editcartoon);

        // Add an edit button if the user is logged in
        if (isCreator) {
            const editButton = document.createElement("button");
            editButton.textContent = "Edit Cartoon";
            editButton.className = "edit-cartoon-btn";
            // editButton.addEventListener("click", () => navigate(`/cartoons/edit/${cartoonID}`));
            editButton.addEventListener("click", () => editCartoonForm(isLoggedIn, cartoon.id, isCreator));
            cartoonDiv.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Request Deletion";
            deleteButton.className = "del-cartoon-btn";
            deleteButton.addEventListener("click", () => deleteCartoonForm(isLoggedIn, cartoon.id, isCreator));
            cartoonDiv.appendChild(deleteButton);
        }
    } catch (error) {
        // Display error message if the cartoon details could not be fetched
        const errorMessage = document.createElement("p");
        errorMessage.textContent = `Error: ${error.message}`;
        cartoonDiv.appendChild(errorMessage);
    }

    // Append the cartoon information to the content container
    contentContainer.appendChild(cartoonDiv);
}
