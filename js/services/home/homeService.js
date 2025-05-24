import { AGI_URL } from "../../state/state.js";
// ============================
// Utility Functions
// ============================
function createContainer(classes = []) {
    const div = document.createElement("div");
    classes.forEach(cls => div.classList.add(cls));
    return div;
}

function createElement(tag, { id, class: classes = [] } = {}) {
    const el = document.createElement(tag);
    if (id) el.id = id;
    classes.forEach(cls => el.classList.add(cls));
    return el;
}

function createDivButton({ text, classes = [], events = {} } = {}) {
    const btn = document.createElement("button");
    btn.innerText = text;
    classes.forEach(cls => btn.classList.add(cls));
    Object.keys(events).forEach(evt => btn.addEventListener(evt, events[evt]));
    return btn;
}

// Debounce helper: delays function execution until after delay ms of inactivity.
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    }
}

// ============================
// Global Constants & State
// ============================
// const API_URL = "http://localhost:4000/feed"; // update as needed

// Each section tracks its page number, if there is more data, and loading state.
const state = {
    recommended_events: { page: 1, hasMore: true, loading: false },
    recommended_places: { page: 1, hasMore: true, loading: false },
    followed_posts: { page: 1, hasMore: true, loading: false },
    ads: { page: 1, hasMore: true, loading: false }
};

// Feed mode can be either "load_more" or "infinite". Save user's preference in localStorage.
// let feedMode = localStorage.getItem("feedMode") || "load_more";
let feedMode = localStorage.getItem("feedMode") || "infinite";

// We'll use an IntersectionObserver for lazy-loading in infinite mode.
const observers = {}; // one observer per section

function attachObserver(section, contentContainer) {
    // If an observer already exists, disconnect it.
    if (observers[section]) observers[section].disconnect();

    // Create a new observer that loads more when the last element is visible.
    observers[section] = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && state[section].hasMore && !state[section].loading) {
                debouncedLoadSection(section, contentContainer);
            }
        });
    });
    // Observe the last child of the content container.
    const lastChild = contentContainer.lastElementChild;
    if (lastChild) {
        observers[section].observe(lastChild);
    }
}

// Debounced version of loadSection (300ms delay)
const debouncedLoadSection = debounce(loadSection, 300);

// ============================
// Data Loading & Rendering
// ============================
export async function loadSection(section, contentContainer) {
    if (!state[section].hasMore) return;
    state[section].loading = true;

    const cacheKey = `feed_${section}_page_${state[section].page}`;
    let data;

    // For the first page, try sessionStorage cache.
    if (state[section].page === 1) {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
            data = JSON.parse(cachedData);
            renderSection(section, data, contentContainer);
            state[section].page++;
            state[section].loading = false;
            if (feedMode === "infinite") attachObserver(section, contentContainer);
            return;
        }
    }

    try {

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
            return;
        }

        const response = await fetch(`${AGI_URL}/home_feed_section`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user, section: section, page: state[section].page })
        });

        // const response = await fetch(`${API_URL}/${section}?page=${state[section].page}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        data = await response.json();

        // If no data, mark as finished.
        if (data.length === 0) {
            state[section].hasMore = false;
            // Hide any "Load More" button if exists.
            const loadMoreBtn = contentContainer.parentElement.querySelector(".load-more");
            if (loadMoreBtn) loadMoreBtn.style.display = "none";
        } else {
            // Cache data in sessionStorage.
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            renderSection(section, data, contentContainer);
            state[section].page++;
        }
    } catch (error) {
        console.error(`Error loading ${section}:`, error);
    } finally {
        state[section].loading = false;
        if (feedMode === "infinite") attachObserver(section, contentContainer);
    }
}

function renderSection(section, data, container) {
    data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        if (section === "recommended_events") {
            card.innerHTML = `<h3>${item.title}</h3><p>📍 ${item.location}</p>`;
        } else if (section === "recommended_places") {
            card.innerHTML = `<h3>${item.name}</h3><p>📍 ${item.location}</p>`;
        } else if (section === "followed_posts") {
            card.innerHTML = `<p><strong>${item.user}</strong>: ${item.content}</p>`;
        } else if (section === "ads") {
            card.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
        }
        container.appendChild(card);
    });
}

// ============================
// Htabs UI Component
// ============================
export function createHtabs(htabs) {
    const htabContainer = createContainer(["htabs-container"]);
    const htabButtons = createContainer(["htab-buttons"]);
    const htabContents = createContainer(["htab-contents"]);

    // Create individual htab content containers.
    const htabContentContainers = htabs.map(({ id }) =>
        createElement("article", { id, class: ["htab-content"] })
    );

    htabs.forEach(({ title, id, render }, index) => {
        const htabButton = createDivButton({
            text: title,
            classes: ["htab-button"],
            events: { click: () => activateHtab(id, render, htabContentContainers[index]) },
        });

        // Mark the first htab as active.
        if (index === 0) {
            htabButton.classList.add("active");
        }

        htabButtons.appendChild(htabButton);
        htabContents.appendChild(htabContentContainers[index]);
    });

    htabContainer.appendChild(htabButtons);
    htabContainer.appendChild(htabContents);

    function activateHtab(htabId, renderContent, contentContainer) {
        // Update active button styles.
        document.querySelectorAll(".htab-button").forEach((btn, idx) => {
            btn.classList.toggle("active", htabs[idx].id === htabId);
        });

        // Show/hide the appropriate htab content.
        document.querySelectorAll(".htab-content").forEach(content => {
            content.classList.toggle("active", content.id === htabId);
        });

        // Render content if it hasn’t been rendered yet.
        if (contentContainer && !contentContainer.innerHTML.trim()) {
            renderContent(contentContainer);
        }
    }

    // Activate the first htab by default.
    if (htabs.length > 0) {
        const firstHtab = htabs[0];
        activateHtab(firstHtab.id, firstHtab.render, htabContentContainers[0]);
        htabContentContainers[0].classList.add("active");
    }

    return htabContainer;
}

function HomeX(isLoggedIn, container) {
    container.innerHTML = ""; // Clear previous content

    if (!isLoggedIn) {
        const message = document.createElement("p");
        message.innerText = "you need to Log in";
        container.appendChild(message);
        return;
    }

    // Set up htab configuration for each feed section.
    const htabsConfig = [
        {
            id: "recommended_events",
            // title: "🎉 Recommended Events",
            title: "🎉 Events",
            render: (contentContainer) => {
                // For Load More mode, add the button.
                if (feedMode === "load_more") {
                    const btn = document.createElement("button");
                    btn.innerText = "Load More";
                    btn.classList.add("load-more");
                    btn.addEventListener("click", () => loadSection("recommended_events", contentContainer));
                    contentContainer.parentElement.appendChild(btn);
                }
                loadSection("recommended_events", contentContainer);
            }
        },
        {
            id: "recommended_places",
            // title: "📍 Recommended Places",
            title: "📍 Places",
            render: (contentContainer) => {
                if (feedMode === "load_more") {
                    const btn = document.createElement("button");
                    btn.innerText = "Load More";
                    btn.classList.add("load-more");
                    btn.addEventListener("click", () => loadSection("recommended_places", contentContainer));
                    contentContainer.parentElement.appendChild(btn);
                }
                loadSection("recommended_places", contentContainer);
            }
        },
        {
            id: "followed_posts",
            // title: "📝 Followed Posts",
            title: "📝 Posts",
            render: (contentContainer) => {
                if (feedMode === "load_more") {
                    const btn = document.createElement("button");
                    btn.innerText = "Load More";
                    btn.classList.add("load-more");
                    btn.addEventListener("click", () => loadSection("followed_posts", contentContainer));
                    contentContainer.parentElement.appendChild(btn);
                }
                loadSection("followed_posts", contentContainer);
            }
        },
        {
            id: "ads",
            // title: "🛍️ Sponsored Ads",
            title: "🛍️ Ads",
            render: (contentContainer) => {
                if (feedMode === "load_more") {
                    const btn = document.createElement("button");
                    btn.innerText = "Load More";
                    btn.classList.add("load-more");
                    btn.addEventListener("click", () => loadSection("ads", contentContainer));
                    contentContainer.parentElement.appendChild(btn);
                }
                loadSection("ads", contentContainer);
            }
        }
    ];

    // Create the htabs UI and append it.
    const htabsComponent = createHtabs(htabsConfig);
    container.appendChild(htabsComponent);
}
export { HomeX };
