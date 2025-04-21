import { SRC_URL, apiFetch } from "../../api/api";
import { editArtistForm, deleteArtistForm } from "./editArtist";

export async function displayArtist(contentContainer, artistID, isLoggedIn) {
    // Clear existing content
    while (contentContainer.firstChild) {
        contentContainer.removeChild(contentContainer.firstChild);
    }
    
    let isCreator = true;

    // Create a container for the artist information
    const artistDiv = document.createElement("div");
    artistDiv.className = "artist-container";

    try {
        // Fetch artist details from the server
        const response = await apiFetch(`/artists/${artistID}`);
        // if (!response.ok) {
        //     throw new Error("Failed to fetch artist details");
        // }

        // const artist = await response.json();
        const artist = await response;

        // Create and display artist details
        const header = document.createElement("h2");
        header.textContent = artist.name;
        artistDiv.appendChild(header);

        // Add artist photo
        if (artist.photo) {
            const photo = document.createElement("img");
            photo.src = `${SRC_URL}/artistpic/photo/${artist.photo}`;
            photo.alt = `${artist.name}'s photo`;
            photo.className = "artist-photo";
            artistDiv.appendChild(photo);
        }

        // Add artist banner
        if (artist.banner) {
            const banner = document.createElement("img");
            banner.src = `${SRC_URL}/artistpic/banner/${artist.banner}`;
            banner.alt = `${artist.name}'s banner`;
            banner.className = "artist-banner";
            artistDiv.appendChild(banner);
        }

        const artistDetails = `
            <p><strong>Artist Type:</strong> ${artist.category}</p>
            <p><strong>Biography:</strong> ${artist.bio}</p>
            <p><strong>Date of Birth:</strong> ${artist.dob}</p>
            <p><strong>Place:</strong> ${artist.place}, ${artist.country}</p>
            <p><strong>Genres:</strong> ${artist.genres.join(", ")}</p>
        `;
        artistDiv.innerHTML += artistDetails;

        // Add socials (if available)
        if (artist.socials) {
            const socialsDiv = document.createElement("div");
            socialsDiv.className = "socials";
            socialsDiv.innerHTML = `<p><strong>Socials:</strong></p>`;
            for (const [platform, url] of Object.entries(artist.socials)) {
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.textContent = platform;
                socialsDiv.appendChild(link);
            }
            artistDiv.appendChild(socialsDiv);
        }

        let editartist = document.createElement('div');
        editartist.id = 'editartist';
        artistDiv.appendChild(editartist);

        // Add an edit button if the user is logged in
        if (isCreator) {
            const editButton = document.createElement("button");
            editButton.textContent = "Edit Artist";
            editButton.className = "edit-artist-btn";
            // editButton.addEventListener("click", () => navigate(`/artists/edit/${artistID}`));
            editButton.addEventListener("click", () => editArtistForm(isLoggedIn, artist.id, isCreator));
            artistDiv.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Request Deletion";
            deleteButton.className = "del-artist-btn";
            deleteButton.addEventListener("click", () => deleteArtistForm(isLoggedIn, artist.id, isCreator));
            artistDiv.appendChild(deleteButton);
        }
    } catch (error) {
        // Display error message if the artist details could not be fetched
        const errorMessage = document.createElement("p");
        errorMessage.textContent = `Error: ${error.message}`;
        artistDiv.appendChild(errorMessage);
    }

    // Append the artist information to the content container
    contentContainer.appendChild(artistDiv);
}
