import { SRC_URL, apiFetch } from "../../api/api.js";
import { displayMerchandise } from "../merch/merchService.js";
import { displayMedia } from "../media/mediaService.js";
import MinAudio from "../../components/ui/MinAudio.mjs";
import { DEFAULT_IMAGE } from "../../state/state.js";
import { createElement } from "../../components/createElement.js";
import Modal from "../../components/ui/Modal.mjs";

async function renderSongsTab(container, artistID, isCreator) {
    try {
        const songs = await apiFetch(`/artists/${artistID}/songs`);
        container.replaceChildren(); // clear safely

        if (isCreator) {
            const uploadButton = createElement("button", { class: "open-upload-modal" }, ["Upload New Song"]);
            container.appendChild(uploadButton);

            uploadButton.addEventListener("click", () => {
                const audioInput = createElement("input", { type: "file", name: "audio", accept: "audio/*", required: true });
                const audioPreview = createElement("audio", { controls: true, style: "display:none; margin-top:10px;" });

                const imageInput = createElement("input", { type: "file", name: "poster", accept: "image/*" });
                const imagePreview = createElement("img", { style: "display:none; max-height:120px; margin-top:10px;" });

                setupFilePreview(audioInput, audioPreview, "audio");
                setupFilePreview(imageInput, imagePreview, "image");

                const form = createElement("form", { class: "song-upload-form" }, [
                    createElement("input", { type: "text", name: "title", placeholder: "Song Title", required: true }),
                    createElement("input", { type: "text", name: "genre", placeholder: "Genre", required: true }),
                    createElement("input", { type: "text", name: "duration", placeholder: "Duration", required: true }),
                    createElement("input", { type: "text", name: "description", placeholder: "Description (optional)" }),
                    audioInput, audioPreview,
                    imageInput, imagePreview,
                    createElement("button", { type: "submit" }, ["Add Song"]),
                ]);

                const closeModal = () => document.getElementById('app').removeChild(modal);
                const modal = Modal({ title: "Upload New Song", content: form, onClose: closeModal });

                form.addEventListener("submit", async e => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    try {
                        await apiFetch(`/artists/${artistID}/songs`, "POST", formData);
                        closeModal();
                        await renderSongsTab(container, artistID, isCreator);
                    } catch (err) {
                        console.error("Upload failed:", err);
                        alert("Upload failed. Try again.");
                    }
                });
            });
        }

        if (!songs.length) {
            container.appendChild(createElement("p", {}, ["No songs available."]));
            return;
        }

        const list = createElement("ul");
        songs.forEach(song => {
            if (!song.published && !isCreator) return;

            const li = createElement("li");
            li.append(
                createElement("strong", {}, [song.title]),
                document.createTextNode(` (${song.genre}) - ${song.duration}`)
            );

            if (song.description) {
                li.appendChild(createElement("p", {}, [song.description]));
            }

            if (song.poster) {
                song.poster = `${SRC_URL}/artistpic/posters/${song.poster}`;
                // li.appendChild(createElement("img", {
                //     src: song.poster,
                //     alt: "Poster",
                //     style: "max-height:100px; display:block; margin:10px 0;"
                // }));
            }

            if (song.audioUrl) {
                song.audioUrl = `${SRC_URL}/artistpic/songs/${song.audioUrl}`;
                li.appendChild(MinAudio(song));
            }

            if (isCreator) {
                const actions = createElement("div", { class: "song-actions" });

                const editBtn = createElement("button", { class: "edit-song-btn buttonx" }, ["Edit"]);
                editBtn.addEventListener("click", () =>
                    openEditSongModal(song, artistID, container, isCreator)
                );

                const delBtn = createElement("button", { class: "delete-song-btn buttonx" }, ["Delete"]);
                delBtn.addEventListener("click", async () => {
                    if (!confirm(`Delete "${song.title}"?`)) return;
                    try {
                        await apiFetch(
                            `/artists/${artistID}/songs/${encodeURIComponent(song.songid)}`,
                            "DELETE"
                        );
                        await renderSongsTab(container, artistID, isCreator);
                    } catch (err) {
                        console.error("Delete failed:", err);
                        alert("Delete failed.");
                    }
                });

                actions.append(editBtn, delBtn);
                li.appendChild(actions);
            }

            list.appendChild(li);
        });

        container.appendChild(list);
    } catch (err) {
        console.error(err);
        container.replaceChildren(createElement("p", {}, ["Error loading songs."]));
    }
}

function openEditSongModal(song, artistID, container, isCreator) {
    const audioInput = createElement("input", { type: "file", name: "audio", accept: "audio/*" });
    const audioPreview = createElement("audio", { controls: true, style: "display:none; margin-top:10px;" });

    const imageInput = createElement("input", { type: "file", name: "poster", accept: "image/*" });
    const imagePreview = createElement("img", { style: "display:none; max-height:120px; margin-top:10px;" });

    setupFilePreview(audioInput, audioPreview, "audio");
    setupFilePreview(imageInput, imagePreview, "image");

    const form = createElement("form", { class: "song-edit-form" }, [
        createElement("input", { type: "text", name: "title", value: song.title, placeholder: "Song Title", required: true }),
        createElement("input", { type: "text", name: "genre", value: song.genre, placeholder: "Genre", required: true }),
        createElement("input", { type: "text", name: "duration", value: song.duration, placeholder: "Duration", required: true }),
        createElement("input", { type: "text", name: "description", value: song.description || "", placeholder: "Description (optional)" }),
        audioInput, audioPreview,
        imageInput, imagePreview,
        createElement("button", { type: "submit" }, ["Save Changes"]),
    ]);

    const closeModal = () => document.getElementById('app').removeChild(modal);
    const modal = Modal({ title: `Edit Song: ${song.title}`, content: form, onClose: closeModal });

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);
        try {
            await apiFetch(
                `/artists/${artistID}/songs/${encodeURIComponent(song.songid)}/edit`,
                "POST",
                formData
            );
            closeModal();
            await renderSongsTab(container, artistID, isCreator);
        } catch (err) {
            console.error("Edit failed:", err);
            alert("Failed to update song.");
        }
    });
}

function setupFilePreview(input, preview, type) {
    input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) {
            preview.style.display = "none";
            return;
        }
        const url = URL.createObjectURL(file);
        if (type === "audio" && file.type.startsWith("audio/")) {
            preview.src = url; preview.load(); preview.style.display = "block";
        }
        if (type === "image" && file.type.startsWith("image/")) {
            preview.src = url; preview.style.display = "block";
        }
    });
}



// async function renderSongsTab(container, artistID, isCreator) {
//     try {
//         const songs = await apiFetch(`/artists/${artistID}/songs`);
//         container.innerHTML = ""; // Clear container

//         // Upload Button (for creators)
//         if (isCreator) {
//             const uploadButton = createElement("button", { class: "open-upload-modal" }, ["Upload New Song"]);
//             container.appendChild(uploadButton);

//             uploadButton.addEventListener("click", () => {
//                 const form = createElement("form", { class: "song-upload-form" }, [
//                     createElement("input", { type: "text", name: "title", placeholder: "Song Title", required: true }),
//                     createElement("input", { type: "text", name: "genre", placeholder: "Genre", required: true }),
//                     createElement("input", { type: "text", name: "duration", placeholder: "Duration (e.g., 3:45)", required: true }),
//                     createElement("input", { type: "file", name: "audio", accept: "audio/*" }),
//                     createElement("button", { type: "submit" }, ["Add Song"]),
//                 ]);

//                 const closeModal = () => document.getElementById('app').removeChild(modal);

//                 const modal = Modal({
//                     title: "Upload New Song",
//                     content: form,
//                     onClose: closeModal,
//                 });

//                 form.addEventListener("submit", async (e) => {
//                     e.preventDefault();
//                     const formData = new FormData(form);
//                     try {
//                         await apiFetch(`/artists/${artistID}/songs`, "POST", formData);
//                         closeModal();
//                         await renderSongsTab(container, artistID, isCreator); // re-render
//                     } catch (error) {
//                         console.error("Upload failed:", error);
//                         alert("Failed to upload song. Try again.");
//                     }
//                 });
//             });
//         }

//         if (!songs.length) {
//             container.appendChild(createElement("p", {}, ["No songs available."]));
//             return;
//         }

//         const list = createElement("ul");

//         songs.forEach(song => {
//             if (!song.published && !isCreator) return;

//             const li = createElement("li");

//             const title = createElement("strong", {}, [song.title]);
//             const meta = document.createTextNode(` (${song.genre}) - ${song.duration}`);
//             li.append(title, meta);

//             // Fallback for poster
//             const poster = song.poster || DEFAULT_IMAGE;
//             song.poster = poster;

//             if (song.audioUrl) {
//                 li.appendChild(MinAudio(song));
//             }

//             // Edit and Delete buttons (for creator)
//             if (isCreator) {
//                 const actions = createElement("div", { class: "song-actions" });

//                 const editButton = createElement("button", { class: "edit-song-btn" }, ["Edit"]);
//                 editButton.addEventListener("click", () => openEditSongModal(song, artistID, container, isCreator));

//                 const deleteButton = createElement("button", { class: "delete-song-btn" }, ["Delete"]);
//                 deleteButton.addEventListener("click", async () => {
//                     if (confirm(`Are you sure you want to delete "${song.title}"?`)) {
//                         try {
//                             await apiFetch(`/artists/${artistID}/songs/delete?songId=${encodeURIComponent(song.audioUrl)}`, "DELETE");
//                             await renderSongsTab(container, artistID, isCreator);
//                         } catch (error) {
//                             console.error("Delete failed:", error);
//                             alert("Failed to delete song.");
//                         }
//                     }
//                 });

//                 actions.append(editButton, deleteButton);
//                 li.appendChild(actions);
//             }

//             list.appendChild(li);
//         });

//         container.appendChild(list);
//     } catch (err) {
//         console.error(err);
//         container.innerHTML = "<p>Error loading songs.</p>";
//     }
// }

// function openEditSongModal(song, artistID, container, isCreator) {
//     const form = createElement("form", { class: "song-edit-form" }, [
//         createElement("input", { type: "text", name: "title", value: song.title, placeholder: "Song Title", required: true }),
//         createElement("input", { type: "text", name: "genre", value: song.genre, placeholder: "Genre", required: true }),
//         createElement("input", { type: "text", name: "duration", value: song.duration, placeholder: "Duration", required: true }),
//         createElement("input", { type: "file", name: "audio", accept: "audio/*" }), // Optional new audio
//         createElement("button", { type: "submit" }, ["Save Changes"]),
//     ]);

//     const closeModal = () => document.getElementById('app').removeChild(modal);

//     const modal = Modal({
//         title: `Edit Song: ${song.title}`,
//         content: form,
//         onClose: closeModal,
//     });

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const formData = new FormData(form);
//         try {
//             await apiFetch(`/artists/${artistID}/songs/edit?songId=${encodeURIComponent(song.audioUrl)}`, "POST", formData);
//             closeModal();
//             await renderSongsTab(container, artistID, isCreator);
//         } catch (error) {
//             console.error("Edit failed:", error);
//             alert("Failed to update song.");
//         }
//     });
// }



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
        container.appendChild(createElement('div', {"id":"edittabs"}));
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



async function renderEventsTab(container, artistID) {
    try {
        const events = await apiFetch(`/artists/${artistID}/events`);

        // Clear container
        container.innerHTML = "";

        // Create New Event Button
        const createEventBtn = createElement("button", { class: "create-event-btn" }, ["Create New Event"]);
        createEventBtn.addEventListener("click", () => openEventModal(artistID));
        container.appendChild(createEventBtn);

        // Events List
        if (events.length === 0) {
            container.appendChild(createElement("p", {}, ["No upcoming events."]));
            return;
        }

        const ul = createElement("ul");
        events.forEach(eventx => {
            const li = createElement("li", {}, [
                createElement("strong", {}, [eventx.title]),
                createElement("br"),
                `${eventx.date} at ${eventx.venue} — ${eventx.city}, ${eventx.country}`,
                createElement("br"),
                eventx.eventid ? createElement("a", { href: `/event/${eventx.eventid}/tickets`, target: "_blank" }, ["Tickets"]) : ""
            ]);
            ul.appendChild(li);
        });

        container.appendChild(ul);
    } catch (err) {
        container.appendChild(createElement("p", {}, ["Error loading events."]));
    }
}

// Open Event Creation Modal
function openEventModal(artistID) {
    const form = document.createElement("form");
    form.className = "event-form";

    const fields = [
        { type: "text", name: "title", placeholder: "Event Title", required: true },
        { type: "date", name: "date", required: true },
        { type: "text", name: "venue", placeholder: "Venue", required: true },
        { type: "text", name: "city", placeholder: "City", required: true },
        { type: "text", name: "country", placeholder: "Country", required: true },
        { type: "url", name: "ticketUrl", placeholder: "Ticket URL (optional)" }
    ];

    fields.forEach(field => {
        const input = document.createElement("input");
        Object.entries(field).forEach(([key, value]) => input[key] = value);
        form.appendChild(input);
    });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Create Event";
    form.appendChild(submitButton);

    // form.addEventListener("submit", async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData(form);
    //     const eventData = Object.fromEntries(formData);

    //     console.log(eventData);

    //     try {
    //         await apiFetch(`/artists/${artistID}/events`, "POST", eventData);
    //         alert("Event created successfully!");
    //         document.getElementById("app").removeChild(modal);
    //         renderEventsTab(document.getElementById("events-container"), artistID);
    //     } catch (error) {
    //         console.error("Failed to create event:", error);
    //         alert("Error creating event. Please try again.");
    //     }
    // });


    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const eventData = Object.fromEntries(formData);

        try {
            await apiFetch(`/artists/${artistID}/events`, "POST", eventData);
            alert("Event created successfully!");
            document.getElementById("app").removeChild(modal);

            // Re-fetch events and re-render using the actual container
            const eventsContainer = document.getElementById("events-container");
            if (eventsContainer) {
                await renderEventsTab(eventsContainer, artistID);
            }
        } catch (error) {
            console.error("Failed to create event:", error);
            alert("Error creating event. Please try again.");
        }
    });


    const modal = Modal({ title: "Create New Event", content: form, onClose: () => document.getElementById("app").removeChild(modal) });
}


export {
    renderSongsTab,
    renderAlbumsTab,
    renderPostsTab,
    renderMerchTab,
    renderEventsTab
};