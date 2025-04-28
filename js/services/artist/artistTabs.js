import { SRC_URL, apiFetch } from "../../api/api.js";
import { displayMerchandise } from "../merch/merchService.js";
import { displayMedia } from "../media/mediaService.js";
import MinAudio from "../../components/ui/MinAudio.mjs";
import { DEFAULT_IMAGE } from "../../state/state.js";

// async function renderSongsTab(container, artistID, isCreator) {
//     try {
//         const songs = await apiFetch(`/artists/${artistID}/songs`);
//         if (!songs.length) {
//             container.innerHTML = "<p>No songs available.</p>";
//             return;
//         }

//         const list = document.createElement("ul");

//         songs.forEach(song => {
//             if (!song.published && !isCreator) return;

//             const li = document.createElement("li");
//             li.innerHTML = `<strong>${song.title}</strong> (${song.genre}) - ${song.duration}`;
//             // Optional: audio player
//             if (song.audioUrl) {
//                 // const audio = document.createElement("audio");
//                 // audio.controls = false;
//                 // audio.src = song.audioUrl;
//                 // li.appendChild(audio);
//                 song.poster = DEFAULT_IMAGE;
//                 li.appendChild(MinAudio(song));
//             }
//             list.appendChild(li);
//         });

//         // songs.forEach(song => {
//         //     if (!song.published && !isCreator) return;

//         //     const li = document.createElement("li");
//         //     li.innerHTML = `<strong>${song.title}</strong> (${song.genre}) - ${song.duration}`;
//         //     // Optional: audio player
//         //     if (song.audioUrl) {
//         //         const audio = document.createElement("audio");
//         //         audio.controls = true;
//         //         audio.src = song.audioUrl;
//         //         li.appendChild(audio);
//         //     }
//         //     list.appendChild(li);
//         // });

//         container.appendChild(list);
//     } catch (err) {
//         container.innerHTML = "<p>Error loading songs.</p>";
//     }
// }

async function renderSongsTab(container, artistID, isCreator) {
    try {
        const songs = await apiFetch(`/artists/${artistID}/songs`);
        container.innerHTML = ""; // Clear container

        // Optional: form to add a new song (only for creators)
        if (isCreator) {
            const form = document.createElement("form");
            form.className = "song-upload-form";
            form.innerHTML = `
                <h3>Upload New Song</h3>
                <input type="text" name="title" placeholder="Song Title" required />
                <input type="text" name="genre" placeholder="Genre" required />
                <input type="text" name="duration" placeholder="Duration (e.g., 3:45)" required />
                <input type="file" name="audio" accept="audio/*" required />
                <button type="submit">Add Song</button>
                <hr/>
            `;

            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                try {
                    const response = await apiFetch(`/artists/${artistID}/songs`, "POST", formData);
                    console.log("Song added:", response);
                    await renderSongsTab(container, artistID, isCreator); // re-render
                } catch (error) {
                    console.error("Upload failed:", error);
                    alert("Failed to upload song. Try again.");
                }
            });

            container.appendChild(form);
        }

        if (!songs.length) {
            const empty = document.createElement("p");
            empty.textContent = "No songs available.";
            container.appendChild(empty);
            return;
        }

        const list = document.createElement("ul");

        songs.forEach(song => {
            if (!song.published && !isCreator) return;

            const li = document.createElement("li");
            li.innerHTML = `<strong>${song.title}</strong> (${song.genre}) - ${song.duration}`;
            if (song.audioUrl) {
                console.log(`${SRC_URL}/artistpic/${song.audioUrl}`);
                song.poster = DEFAULT_IMAGE;
                li.appendChild(MinAudio(song)); // your custom audio UI
            }
            list.appendChild(li);
        });

        container.appendChild(list);
    } catch (err) {
        container.innerHTML = "<p>Error loading songs.</p>";
    }
}


async function renderAlbumsTab(container, artistID, isCreator) {
    try {
        const albums = await apiFetch(`/artists/${artistID}/albums`);
        if (!albums.length) {
            container.innerHTML = "<p>No albums available.</p>";
            return;
        }

        albums.forEach(album => {
            if (!album.published && !isCreator) return;

            const div = document.createElement("div");
            div.className = "album-block";
            div.innerHTML = `
                <h3>${album.title}</h3>
                <p><strong>Release:</strong> ${album.releaseDate}</p>
                <p>${album.description}</p>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = "<p>Error loading albums.</p>";
    }
}

async function renderPostsTab(container, artistID, isLoggedIn) {
    try {
        // const posts = await apiFetch(`/artists/${artistID}/posts`);
        // if (!posts.length) {
        //     container.innerHTML = "<p>No posts yet.</p>";
        //     return;
        // }

        displayMedia(container, "artist", artistID, isLoggedIn);

        // posts.forEach(post => {
        //     if (!post.published && !isCreator) return;

        //     const div = document.createElement("div");
        //     div.className = "post-block";
        //     div.innerHTML = `
        //         <h4>${post.title}</h4>
        //         <p>${post.content}</p>
        //         <p><em>Posted on ${post.createdAt}</em></p>
        //     `;
        //     container.appendChild(div);
        // });
    } catch (err) {
        container.innerHTML = "<p>Error loading posts.</p>";
    }
}

async function renderMerchTab(container, artistID, isCreator, isLoggedIn) {
    try {
        const merchItems = await apiFetch(`/artists/${artistID}/merch`);
        // if (!merchItems.length) {
        //     container.innerHTML = "<p>No merch available.</p>";
        //     return;
        // }
        displayMerchandise(container, merchItems, "artist", artistID, isCreator, isLoggedIn);
        // merchItems.forEach(item => {
        //     if (!item.visible && !isCreator) return;

        //     const div = document.createElement("div");
        //     div.className = "merch-item";
        //     div.innerHTML = `
        //         <h4>${item.name}</h4>
        //         <p>Price: $${item.price}</p>
        //         <p>${item.description}</p>
        //         ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : ""}
        //     `;
        //     container.appendChild(div);
        // });
    } catch (err) {
        container.innerHTML = "<p>Error loading merch.</p>";
    }
}

// async function renderMerchTab(container, artistID, isCreator) {
//     try {
//         const merchItems = await apiFetch(`/artists/${artistID}/merch`);
//         if (!merchItems.length) {
//             container.innerHTML = "<p>No merch available.</p>";
//             return;
//         }

//         merchItems.forEach(item => {
//             if (!item.visible && !isCreator) return;

//             const div = document.createElement("div");
//             div.className = "merch-item";
//             div.innerHTML = `
//                 <h4>${item.name}</h4>
//                 <p>Price: $${item.price}</p>
//                 <p>${item.description}</p>
//                 ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : ""}
//             `;
//             container.appendChild(div);
//         });
//     } catch (err) {
//         container.innerHTML = "<p>Error loading merch.</p>";
//     }
// }

async function renderEventsTab(container, artistID) {
    try {
        const events = await apiFetch(`/artists/${artistID}/events`);
        if (!events.length) {
            container.innerHTML = "<p>No upcoming events.</p>";
            return;
        }

        const ul = document.createElement("ul");
        events.forEach(event => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${event.title}</strong><br>
                ${event.date} at ${event.venue} — ${event.city}, ${event.country}
                ${event.ticketUrl ? `<br><a href="${event.ticketUrl}" target="_blank">Tickets</a>` : ""}
            `;
            ul.appendChild(li);
        });

        container.appendChild(ul);
    } catch (err) {
        container.innerHTML = "<p>Error loading events.</p>";
    }
}

// async function renderEventsTab(container, artistID) {
//     try {
//         const events = await apiFetch(`/artists/${artistID}/events`);
//         if (!events.length) {
//             container.innerHTML = "<p>No upcoming events.</p>";
//             return;
//         }

//         const ul = document.createElement("ul");
//         events.forEach(event => {
//             const li = document.createElement("li");
//             li.innerHTML = `
//                 <strong>${event.title}</strong><br>
//                 ${event.date} at ${event.venue} — ${event.city}, ${event.country}
//                 ${event.ticketUrl ? `<br><a href="${event.ticketUrl}" target="_blank">Tickets</a>` : ""}
//             `;
//             ul.appendChild(li);
//         });

//         container.appendChild(ul);
//     } catch (err) {
//         container.innerHTML = "<p>Error loading events.</p>";
//     }
// }

export {
    renderSongsTab,
    renderAlbumsTab,
    renderPostsTab,
    renderMerchTab,
    renderEventsTab
};