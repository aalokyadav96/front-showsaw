import { apiFetch } from "../../api/api.js";
import {navigate} from "../../routes/index.js";
export async function displayCartoons(container, isLoggedIn) {
    // Clear existing content
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    try {
        // Fetch all cartoons from the server
        const response = await apiFetch("/cartoons");
        // if (!response.ok) {
        //     throw new Error("Failed to fetch cartoons");
        // }

        // const cartoons = await response.json();
        const cartoons = await response;

        // Create a header for the cartoons list
        const header = document.createElement("h2");
        header.textContent = "All Cartoons";
        container.appendChild(header);

        // Create a grid or list container for cartoons
        const cartoonsGrid = document.createElement("div");
        cartoonsGrid.className = "cartoons-grid";

        cartoons.forEach(cartoon => {
            // Create a card for each cartoon
            const cartoonCard = document.createElement("div");
            cartoonCard.className = "cartoon-card";

            const name = document.createElement("h3");
            name.textContent = cartoon.name;
            cartoonCard.appendChild(name);

            const category = document.createElement("p");
            category.textContent = `Type: ${cartoon.category}`;
            cartoonCard.appendChild(category);

            if (cartoon.photo) {
                const photo = document.createElement("img");
                photo.src = cartoon.photo;
                photo.alt = `${cartoon.name}'s photo`;
                photo.className = "cartoon-photo";
                cartoonCard.appendChild(photo);
            }

            const bio = document.createElement("p");
            bio.textContent = `${cartoon.bio.substring(0, 100)}...`; // Shortened bio
            cartoonCard.appendChild(bio);

            // Add a "View Details" button
            const viewDetailsBtn = document.createElement("button");
            viewDetailsBtn.textContent = "View Details";
            viewDetailsBtn.addEventListener("click", () => {
                navigate(`/cartoon/${cartoon.id}`); // Navigate to cartoon details page
            });
            cartoonCard.appendChild(viewDetailsBtn);

            // Add an edit button if the user is logged in
            if (isLoggedIn) {
                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit Cartoon";
                editBtn.addEventListener("click", () => {
                    navigate(`/cartoon/edit/${cartoon.id}`); // Navigate to edit page
                });
                cartoonCard.appendChild(editBtn);
            }

            cartoonsGrid.appendChild(cartoonCard);
        });

        container.appendChild(cartoonsGrid);

    } catch (error) {
        // Display an error message if cartoons can't be fetched
        const errorMessage = document.createElement("p");
        errorMessage.textContent = `Error: ${error.message}`;
        container.appendChild(errorMessage);
    }
}
