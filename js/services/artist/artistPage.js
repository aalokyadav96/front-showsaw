import {
    renderSongsTab,
    renderAlbumsTab,
    renderPostsTab,
    renderMerchTab,
    renderEventsTab
} from "./artistTabs.js";
import { SRC_URL, apiFetch } from "../../api/api.js";
import { createTabs } from "../../components/ui/createTabs.js"; // adjust path as needed
import { editArtistForm, deleteArtistForm } from "./editArtist.js";
import { createElement } from "../../components/ui/vidpopHelpers/helpers.js";
import { createButton, createContainer } from "../../components/eventHelper.js";
        import { reportPost } from "../reporting/reporting.js";


export async function displayArtist(contentContainer, artistID, isLoggedIn) {
    // Clear existing content
    contentContainer.innerHTML = "";

    try {
        const artist = await apiFetch(`/artists/${artistID}`);
        if (artist == null) { return }
        const isCreator = isLoggedIn && artist?.createdBy === isLoggedIn?.userid;

        const artistPics = document.createElement("div");
        artistPics.className = "hflex-sb photocon";

        if (artist.photo) {
            const artistPhoto = document.createElement("div");
            artistPhoto.className = "hflex";

            const photo = document.createElement("img");
            photo.src = `${SRC_URL}/artistpic/photo/${artist.photo}`;
            photo.alt = `${artist.name}'s photo`;
            photo.className = "artist-photo";
            artistPhoto.appendChild(photo);
            artistPics.appendChild(artistPhoto);
        }

        if (artist.banner) {
            const artistBanner = document.createElement("div");
            artistBanner.className = "hflex";

            const banner = document.createElement("img");
            banner.src = `${SRC_URL}/artistpic/banner/${artist.banner}`;
            banner.alt = `${artist.name}'s banner`;
            banner.className = "artist-banner";
            artistBanner.appendChild(banner);
            artistPics.appendChild(artistBanner);
        }

        contentContainer.appendChild(artistPics);



        // Report button
        const reportButton = document.createElement("button");
        reportButton.className = "report-btn";
        reportButton.textContent = "Report";
        reportButton.addEventListener("click", () => {
            reportPost(artistID);
        });

        contentContainer.append(createButton({ text: "Subscribe", classes: ["buttonx"] }), reportButton);


        contentContainer.appendChild(createElement('div', "editdiv", { id: "editevent" }));

        // Tab render functions
        const tabs = [
            {
                title: "Overview",
                id: "overview",
                render: (container) => renderOverviewTab(container, artist, isCreator, isLoggedIn),
            },
            {
                title: "Songs",
                id: "songs",
                render: (container) => renderSongsTab(container, artistID, isCreator),
            },
            {
                title: "Albums",
                id: "albums",
                render: (container) => renderAlbumsTab(container, artistID, isCreator),
            },
            {
                title: "Posts",
                id: "posts",
                render: (container) => renderPostsTab(container, artistID, isLoggedIn),
            },
            {
                title: "Merch",
                id: "merch",
                render: (container) => renderMerchTab(container, artistID, isCreator, isLoggedIn),
            },
            {
                title: "Events",
                id: "events",
                render: (container) => renderEventsTab(container, artistID),
            },
        ];

        const tabUI = createTabs(tabs);
        contentContainer.appendChild(tabUI);
    } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = `Error loading artist profile: ${error.message}`;
        contentContainer.appendChild(errorMessage);
    }
}

function renderOverviewTab(container, artist, isCreator, isLoggedIn) {
    const artistDiv = document.createElement("div");
    artistDiv.className = "artist-container";

    const header = document.createElement("h2");
    header.textContent = artist.name;
    artistDiv.appendChild(header);

    const details = `
        <p><strong>Artist Type:</strong> ${artist.category}</p>
        <p><strong>Biography:</strong> ${artist.bio}</p>
        <p><strong>Date of Birth:</strong> ${artist.dob}</p>
        <p><strong>Place:</strong> ${artist.place}, ${artist.country}</p>
        <p><strong>Genres:</strong> ${artist.genres.join(", ")}</p>
    `;
    artistDiv.innerHTML += details;

    // 👉 Add Band Members if any
    if (artist.members && artist.members.length > 0) {
        const membersDiv = document.createElement("div");
        membersDiv.className = "band-members";
        membersDiv.innerHTML = `<p><strong>Band Members:</strong></p>`;

        const memberList = document.createElement("ul");
        artist.members.forEach(member => {
            const li = document.createElement("li");
            li.textContent = `${member.name}${member.role ? ` - ${member.role}` : ""}${member.dob ? ` (DOB: ${member.dob})` : ""}`;
            memberList.appendChild(li);
        });

        membersDiv.appendChild(memberList);
        artistDiv.appendChild(membersDiv);
    }

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

    if (isCreator) {
        const editButton = document.createElement("button");
        editButton.textContent = "Edit Artist";
        editButton.className = "edit-artist-btn";
        editButton.addEventListener("click", () => editArtistForm(isLoggedIn, artist.artistid, isCreator));
        artistDiv.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Request Deletion";
        deleteButton.className = "del-artist-btn";
        deleteButton.addEventListener("click", () => deleteArtistForm(isLoggedIn, artist.artistid, isCreator));
        artistDiv.appendChild(deleteButton);
    }

    container.appendChild(artistDiv);

    container.appendChild(createContainer(["editform"], "editartist", "div"));
}
