import { secnav } from "../../components/secNav.js";

export async function displayClips(contentContainer, isLoggedIn) {
    if (!contentContainer) {
        console.error("Content container not found!");
        return;
    }

    const clipsSection = document.createElement("section");
    clipsSection.classList.add("clips-section");

    const clipsContainer = document.createElement("div");
    clipsContainer.classList.add("clips-container");

    const clipsData = {
        Videos: [
            {
                title: "Exploring the Mountains",
                creator: "NatureGuy",
                date: "May 1, 2025",
                src: "#",
                thumbnail: "https://via.placeholder.com/300x170?text=Video+1"
            },
            {
                title: "Cooking the Perfect Steak",
                creator: "ChefMaria",
                date: "May 3, 2025",
                src: "#",
                thumbnail: "https://via.placeholder.com/300x170?text=Video+2"
            }
        ],
        Livestreams: [
            {
                title: "Live Coding Session",
                creator: "DevStream",
                live: true,
                src: "#",
                thumbnail: "https://via.placeholder.com/300x170?text=Live+Now"
            },
            {
                title: "Gaming Stream at 8 PM",
                creator: "ProGamer",
                live: false,
                scheduled: "Today 8 PM",
                src: "",
                thumbnail: "https://via.placeholder.com/300x170?text=Scheduled"
            }
        ],
        Quickies: [
            {
                title: "5-sec Meme",
                creator: "LaughHub",
                date: "May 5, 2025",
                src: "#",
                thumbnail: "https://via.placeholder.com/300x170?text=Quickie+1"
            },
            {
                title: "Fast Trick Shot",
                creator: "ShotMaster",
                date: "May 6, 2025",
                src: "#",
                thumbnail: "https://via.placeholder.com/300x170?text=Quickie+2"
            }
        ],
        Highlights: [
            {
                title: "Top Goals of the Week",
                creator: "SportsCentral",
                date: "May 2, 2025",
                src: "#",
                thumbnail: "https://via.placeholder.com/300x170?text=Highlight+1"
            }
        ]
    };

    function showCategory(category) {
        clipsContainer.innerHTML = "";

        if (!clipsData[category]) return;

        clipsData[category].forEach(clip => {
            const card = document.createElement("div");
            card.classList.add("clip-card");

            const thumbnail = document.createElement("img");
            thumbnail.src = clip.thumbnail;
            thumbnail.alt = clip.title;
            thumbnail.classList.add("clip-thumbnail");
            card.appendChild(thumbnail);

            if (clip.src) {
                const video = document.createElement("video");
                video.src = clip.src;
                video.controls = true;
                video.classList.add("clip-video");
                card.appendChild(video);
            }

            const title = document.createElement("h3");
            title.textContent = clip.title;
            card.appendChild(title);

            const meta = document.createElement("p");
            meta.className = "clip-meta";
            meta.textContent = `By ${clip.creator}` + 
                (clip.date ? ` | ${clip.date}` : '') + 
                (clip.live ? ' | 🔴 Live' : clip.scheduled ? ` | Scheduled: ${clip.scheduled}` : '');
            card.appendChild(meta);

            clipsContainer.appendChild(card);
        });
    }

    const categories = [
        { label: "Quickies", callback: showCategory }, // or rename to "Shorts"
        { label: "Livestreams", callback: showCategory },
        { label: "Videos", callback: showCategory },
        { label: "Highlights", callback: showCategory }
    ];

    const secondaryNav = secnav(categories);
    if (secondaryNav) clipsSection.appendChild(secondaryNav);

    showCategory("Videos"); // default

    clipsSection.appendChild(clipsContainer);
    contentContainer.appendChild(clipsSection);
}
