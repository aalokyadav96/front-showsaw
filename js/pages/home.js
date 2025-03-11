import "../../css/home.css";
import { navigate } from "../routes/index.js";

let currentPage = 1;
const pageLimit = 5;
let isLoading = false;

/**
 * Fetches feed data from the backend.
 * @param {HTMLElement} content - The container element.
 * @param {boolean} append - Whether to append data or replace existing content.
 */
async function loadFeed(content, append = false) {
    if (isLoading || currentPage > pageLimit) return;
    isLoading = true;

    // Get the user ID from localStorage
    const user = localStorage.getItem("user");
    if (!user) {
        navigate("/login");
        return;
    }
    const userId = user; // Assuming user is stored as a simple string

    try {
        const response = await fetch("http://localhost:5000/api/home_feed", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id: userId, page: currentPage })
        });
        if (!response.ok) throw new Error("Failed to fetch data");

        const feedData = await response.json();
        renderFeed(content, feedData, append);
        currentPage++;
    } catch (error) {
        console.error("Error fetching home feed:", error);
        displayHomeDummyData(content);
    } finally {
        isLoading = false;
    }
}

/**
 * Renders the feed data into the page.
 * @param {HTMLElement} content - The container element.
 * @param {Object} feedData - Data fetched from the backend.
 * @param {boolean} append - Whether to append to existing content.
 */
function renderFeed(content, feedData, append) {
    if (!append) {
        content.innerHTML = "";
    }

    const pageSection = document.createElement("div");
    pageSection.classList.add("home-container");

    // Create a heading
    const heading = document.createElement("h2");
    heading.dataset.i18n = "welcome"; // Translatable key
    pageSection.appendChild(heading);

    // Define sections and their respective data
    const sections = {
        "Recommended Events": feedData.recommended_events,
        "Recommended Places": feedData.recommended_places,
        "Followed Posts": feedData.followed_posts,
        "Advertisements": feedData.ads
    };

    for (const [sectionTitle, items] of Object.entries(sections)) {
        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("feed-section");

        const sectionHeading = document.createElement("h3");
        sectionHeading.textContent = sectionTitle;
        sectionDiv.appendChild(sectionHeading);

        if (items && items.length > 0) {
            items.forEach(item => {
                const card = document.createElement("div");
                card.classList.add("feed-card");

                // Render based on the type of data
                if (item.title) {
                    // For events and ads
                    card.innerHTML = `<h4>${item.title}</h4>
                                      <p>${item.location || item.description}</p>`;
                } else if (item.name) {
                    // For places
                    card.innerHTML = `<h4>${item.name}</h4>
                                      <p>${item.location}</p>`;
                } else if (item.user && item.content) {
                    // For posts
                    card.innerHTML = `<p><strong>${item.user}:</strong> ${item.content}</p>`;
                }
                sectionDiv.appendChild(card);
            });
        } else {
            sectionDiv.innerHTML += `<p>No ${sectionTitle.toLowerCase()} available.</p>`;
        }
        pageSection.appendChild(sectionDiv);
    }

    content.appendChild(pageSection);
}

/**
 * Displays a dummy message if data cannot be loaded.
 * @param {HTMLElement} container - The container element.
 */
function displayHomeDummyData(container) {
    container.innerHTML = "Something went wrong, homepage is not available. Maybe browse or search instead.";
}

/**
 * Main Home function. Initializes the feed and sets up lazy loading.
 * @param {boolean} isLoggedIn - User's login status.
 * @param {HTMLElement} content - The container element for the feed.
 */
function Home(isLoggedIn, content) {
    // Reset pagination for a fresh load
    currentPage = 1;
    isLoading = false;
    
    // Initial feed load
    loadFeed(content);

    // Set up lazy loading: load more when scrolling near the bottom
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadFeed(content, true);
        }
    });
}

export { Home };

// import "../../css/home.css";
// import {navigate} from "../routes/index.js";

// async function Home(isLoggedIn, content) {
//     // Clear existing content
//     content.innerHTML = "";

//     // Fetch user ID from localStorage
//     const user = localStorage.getItem("user");
//     if (!user) {
//         navigate("/login");
//         // console.error("No user ID found in localStorage");
//         return;
//     }

//     // const userId = JSON.parse(user).id; // Assuming stored as JSON { "id": "12345" }
//     const userId = user;

//     // Fetch data from backend
//     let feedData;
//     try {
//         // const response = await fetch("http://127.0.0.1:5000/api/home_feed", {
//         const response = await fetch("http://localhost:5000/api/home_feed", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ user_id: userId })
//         });

//         if (!response.ok) throw new Error("Failed to fetch data");
//         feedData = await response.json();
//     } catch (error) {
//         console.error("Error fetching home feed:", error);
//         displayHomeDummyData(content);
//         return;
//     }

//     // Create Page Section
//     const PageSection = document.createElement("div");
//     PageSection.classList.add("home-container");

//     // **🔹 Add Heading**
//     const heading = document.createElement("h2");
//     heading.dataset.i18n = "welcome"; // Translatable key
//     PageSection.appendChild(heading);

//     // **🔹 Create Event List**
//     const eventList = document.createElement("div");
//     eventList.classList.add("event-list");

//     if (feedData.recommended_events.length > 0) {
//         feedData.recommended_events.forEach(event => {
//             const eventCard = document.createElement("div");
//             eventCard.classList.add("event-card");
//             eventCard.innerHTML = `<h3>${event.title}</h3><p>${event.location}</p>`;
//             eventList.appendChild(eventCard);
//         });
//     } else {
//         eventList.innerHTML = "<p>No events available.</p>";
//     }

//     // **🔹 Create Recommended Places Section**
//     const placesSection = document.createElement("div");
//     placesSection.classList.add("places-list");

//     if (feedData.recommended_places.length > 0) {
//         feedData.recommended_places.forEach(place => {
//             const placeCard = document.createElement("div");
//             placeCard.classList.add("place-card");
//             placeCard.innerHTML = `<h3>${place.name}</h3><p>${place.location}</p>`;
//             placesSection.appendChild(placeCard);
//         });
//     } else {
//         placesSection.innerHTML = "<p>No places available.</p>";
//     }

//     // **🔹 Create Followed Posts Section**
//     const postsSection = document.createElement("div");
//     postsSection.classList.add("posts-list");

//     if (feedData.followed_posts.length > 0) {
//         feedData.followed_posts.forEach(post => {
//             const postCard = document.createElement("div");
//             postCard.classList.add("post-card");
//             postCard.innerHTML = `<strong>${post.user}:</strong> <p>${post.content}</p>`;
//             postsSection.appendChild(postCard);
//         });
//     } else {
//         postsSection.innerHTML = "<p>No followed posts available.</p>";
//     }

//     // **🔹 Create Ads Section**
//     const adsSection = document.createElement("div");
//     adsSection.classList.add("ads-list");

//     if (feedData.ads.length > 0) {
//         feedData.ads.forEach(ad => {
//             const adCard = document.createElement("div");
//             adCard.classList.add("ad-card");
//             adCard.innerHTML = `<h3>${ad.title}</h3><p>${ad.description}</p>`;
//             adsSection.appendChild(adCard);
//         });
//     } else {
//         adsSection.innerHTML = "<p>No ads available.</p>";
//     }

//     // **🔹 Append Elements**
//     PageSection.appendChild(eventList);
//     PageSection.appendChild(placesSection);
//     PageSection.appendChild(postsSection);
//     PageSection.appendChild(adsSection);

//     // **🔹 Add Page Section to Content**
//     content.appendChild(PageSection);
// }

// function displayHomeDummyData(container) {
//     container.innerHTML="Something went wrong, homepage is not available,  maybe browse or search instead";
// }

// export { Home };