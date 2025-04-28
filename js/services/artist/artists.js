import { SRC_URL } from "../../api/api.js";
import { apiFetch } from "../../api/api.js";
import {navigate} from "../../routes/index.js";

export async function displayArtists(container, isLoggedIn) {
    // Clear existing content
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    try {
        // Fetch all artists from the server
        const response = await apiFetch("/artists");
        // if (!response.ok) {
        //     throw new Error("Failed to fetch artists");
        // }

        // const artists = await response.json();
        const artists = await response;

        // Create a header for the artists list
        const header = document.createElement("h2");
        header.textContent = "All Artists";
        container.appendChild(header);

        // Create a grid or list container for artists
        const artistsGrid = document.createElement("div");
        artistsGrid.className = "artists-grid";

        artists.forEach(artist => {
            // Create a card for each artist
            const artistCard = document.createElement("div");
            artistCard.className = "artist-card";

            const name = document.createElement("h3");
            name.textContent = artist.name;
            artistCard.appendChild(name);

            const category = document.createElement("p");
            category.textContent = `Type: ${artist.category}`;
            artistCard.appendChild(category);

            if (artist.banner) {
                const banner = document.createElement("img");
                banner.src = `${SRC_URL}/artistpic/banner/${artist.banner}`;
                banner.alt = `${artist.name}'s banner`;
                banner.className = "artist-banner";
                artistCard.appendChild(banner);
            }

            const bio = document.createElement("p");
            bio.textContent = `${artist.bio.substring(0, 100)}...`; // Shortened bio
            artistCard.appendChild(bio);

            // Add a "View Details" button
            const viewDetailsBtn = document.createElement("button");
            viewDetailsBtn.textContent = "View Details";
            viewDetailsBtn.addEventListener("click", () => {
                navigate(`/artist/${artist.id}`); // Navigate to artist details page
            });
            artistCard.appendChild(viewDetailsBtn);

            // // Add an edit button if the user is logged in
            // if (isLoggedIn) {
            //     const editBtn = document.createElement("button");
            //     editBtn.textContent = "Edit Artist";
            //     editBtn.addEventListener("click", () => {
            //         navigate(`/artist/edit/${artist.id}`); // Navigate to edit page
            //     });
            //     artistCard.appendChild(editBtn);
            // }

            artistsGrid.appendChild(artistCard);
        });

        container.appendChild(artistsGrid);

    } catch (error) {
        // Display an error message if artists can't be fetched
        const errorMessage = document.createElement("p");
        errorMessage.textContent = `Error: ${error.message}`;
        container.appendChild(errorMessage);
    }
}
