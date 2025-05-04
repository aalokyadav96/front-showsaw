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
// Tabs UI Component
// ============================
export function createTabs(tabs) {
    const tabContainer = createContainer(["tabs-container"]);
    const tabButtons = createContainer(["tab-buttons"]);
    const tabContents = createContainer(["tab-contents"]);

    // Create individual tab content containers.
    const tabContentContainers = tabs.map(({ id }) =>
        createElement("article", { id, class: ["tab-content"] })
    );

    tabs.forEach(({ title, id, render }, index) => {
        const tabButton = createDivButton({
            text: title,
            classes: ["tab-button"],
            events: { click: () => activateTab(id, render, tabContentContainers[index]) },
        });

        // Mark the first tab as active.
        if (index === 0) {
            tabButton.classList.add("active");
        }

        tabButtons.appendChild(tabButton);
        tabContents.appendChild(tabContentContainers[index]);
    });

    tabContainer.appendChild(tabButtons);
    tabContainer.appendChild(tabContents);

    function activateTab(tabId, renderContent, contentContainer) {
        // Update active button styles.
        document.querySelectorAll(".tab-button").forEach((btn, idx) => {
            btn.classList.toggle("active", tabs[idx].id === tabId);
        });

        // Show/hide the appropriate tab content.
        document.querySelectorAll(".tab-content").forEach(content => {
            content.classList.toggle("active", content.id === tabId);
        });

        // Render content if it hasn’t been rendered yet.
        if (contentContainer && !contentContainer.innerHTML.trim()) {
            renderContent(contentContainer);
        }
    }

    // Activate the first tab by default.
    if (tabs.length > 0) {
        const firstTab = tabs[0];
        activateTab(firstTab.id, firstTab.render, tabContentContainers[0]);
        tabContentContainers[0].classList.add("active");
    }

    return tabContainer;
}

function HomeX(isLoggedIn, container) {
    container.innerHTML = ""; // Clear previous content

    if (!isLoggedIn) {
        const message = document.createElement("p");
        message.innerText = "you need to Log in";
        container.appendChild(message);
        return;
    }

    // Create header with title and feed mode toggle.
    const header = document.createElement("header");
    header.classList.add("header");

    const title = document.createElement("p");
    title.innerText = "Personalized Feed";
    header.appendChild(title);

    // Feed toggle: Switch between Infinite Scroll and Load More.
    const toggleContainer = document.createElement("div");
    toggleContainer.classList.add("feed-toggle");
    const toggleLabel = document.createElement("label");
    toggleLabel.innerText = "Infinite Scroll:";
    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = (feedMode === "infinite");
    toggleInput.addEventListener("change", () => {
        feedMode = toggleInput.checked ? "infinite" : "load_more";
        localStorage.setItem("feedMode", feedMode);
        // Reload active tab content with new mode.
        document.querySelectorAll(".tab-content.active").forEach(activeContent => {
            activeContent.innerHTML = "";
            const activeTabId = activeContent.id;
            // Reset state for the active tab.
            state[activeTabId].page = 1;
            state[activeTabId].hasMore = true;
            loadSection(activeTabId, activeContent);
            // If in load_more mode, ensure a Load More button is visible.
            if (feedMode === "load_more") {
                let btn = activeContent.parentElement.querySelector(".load-more");
                if (!btn) {
                    btn = document.createElement("button");
                    btn.innerText = "Load More";
                    btn.classList.add("load-more");
                    btn.addEventListener("click", () => loadSection(activeTabId, activeContent));
                    activeContent.parentElement.appendChild(btn);
                } else {
                    btn.style.display = "block";
                }
            } else {
                // In infinite mode, hide the button.
                const btn = activeContent.parentElement.querySelector(".load-more");
                if (btn) btn.style.display = "none";
            }
        });
    });
    toggleLabel.appendChild(toggleInput);
    toggleContainer.appendChild(toggleLabel);
    header.appendChild(toggleContainer);

    container.appendChild(header);

    // Set up tab configuration for each feed section.
    const tabsConfig = [
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

    // Create the tabs UI and append it.
    const tabsComponent = createTabs(tabsConfig);
    container.appendChild(tabsComponent);
}
// ============================
// Main Home Function
// ============================
// function Home(isLoggedIn, container) {
//     container.innerHTML = ""; // Clear previous content

//     if (!isLoggedIn) {
//         const message = document.createElement("p");
//         message.innerText = "you need to Log in";
//         container.appendChild(message);
//         return;
//     }

//     // Create header with title and feed mode toggle.
//     const header = document.createElement("header");
//     header.classList.add("header");

//     const title = document.createElement("p");
//     title.innerText = "Personalized Feed";
//     header.appendChild(title);

//     // Feed toggle: Switch between Infinite Scroll and Load More.
//     const toggleContainer = document.createElement("div");
//     toggleContainer.classList.add("feed-toggle");
//     const toggleLabel = document.createElement("label");
//     toggleLabel.innerText = "Infinite Scroll:";
//     const toggleInput = document.createElement("input");
//     toggleInput.type = "checkbox";
//     toggleInput.checked = (feedMode === "infinite");
//     toggleInput.addEventListener("change", () => {
//         feedMode = toggleInput.checked ? "infinite" : "load_more";
//         localStorage.setItem("feedMode", feedMode);
//         // Reload active tab content with new mode.
//         document.querySelectorAll(".tab-content.active").forEach(activeContent => {
//             activeContent.innerHTML = "";
//             const activeTabId = activeContent.id;
//             // Reset state for the active tab.
//             state[activeTabId].page = 1;
//             state[activeTabId].hasMore = true;
//             loadSection(activeTabId, activeContent);
//             // If in load_more mode, ensure a Load More button is visible.
//             if (feedMode === "load_more") {
//                 let btn = activeContent.parentElement.querySelector(".load-more");
//                 if (!btn) {
//                     btn = document.createElement("button");
//                     btn.innerText = "Load More";
//                     btn.classList.add("load-more");
//                     btn.addEventListener("click", () => loadSection(activeTabId, activeContent));
//                     activeContent.parentElement.appendChild(btn);
//                 } else {
//                     btn.style.display = "block";
//                 }
//             } else {
//                 // In infinite mode, hide the button.
//                 const btn = activeContent.parentElement.querySelector(".load-more");
//                 if (btn) btn.style.display = "none";
//             }
//         });
//     });
//     toggleLabel.appendChild(toggleInput);
//     toggleContainer.appendChild(toggleLabel);
//     header.appendChild(toggleContainer);

//     container.appendChild(header);

//     // Set up tab configuration for each feed section.
//     const tabsConfig = [
//         {
//             id: "recommended_events",
//             title: "🎉 Recommended Events",
//             render: (contentContainer) => {
//                 // For Load More mode, add the button.
//                 if (feedMode === "load_more") {
//                     const btn = document.createElement("button");
//                     btn.innerText = "Load More";
//                     btn.classList.add("load-more");
//                     btn.addEventListener("click", () => loadSection("recommended_events", contentContainer));
//                     contentContainer.parentElement.appendChild(btn);
//                 }
//                 loadSection("recommended_events", contentContainer);
//             }
//         },
//         {
//             id: "recommended_places",
//             title: "📍 Recommended Places",
//             render: (contentContainer) => {
//                 if (feedMode === "load_more") {
//                     const btn = document.createElement("button");
//                     btn.innerText = "Load More";
//                     btn.classList.add("load-more");
//                     btn.addEventListener("click", () => loadSection("recommended_places", contentContainer));
//                     contentContainer.parentElement.appendChild(btn);
//                 }
//                 loadSection("recommended_places", contentContainer);
//             }
//         },
//         {
//             id: "followed_posts",
//             title: "📝 Followed Posts",
//             render: (contentContainer) => {
//                 if (feedMode === "load_more") {
//                     const btn = document.createElement("button");
//                     btn.innerText = "Load More";
//                     btn.classList.add("load-more");
//                     btn.addEventListener("click", () => loadSection("followed_posts", contentContainer));
//                     contentContainer.parentElement.appendChild(btn);
//                 }
//                 loadSection("followed_posts", contentContainer);
//             }
//         },
//         {
//             id: "ads",
//             title: "🛍️ Sponsored Ads",
//             render: (contentContainer) => {
//                 if (feedMode === "load_more") {
//                     const btn = document.createElement("button");
//                     btn.innerText = "Load More";
//                     btn.classList.add("load-more");
//                     btn.addEventListener("click", () => loadSection("ads", contentContainer));
//                     contentContainer.parentElement.appendChild(btn);
//                 }
//                 loadSection("ads", contentContainer);
//             }
//         }
//     ];

//     // Create the tabs UI and append it.
//     const tabsComponent = createTabs(tabsConfig);
//     container.appendChild(tabsComponent);
// }

export { HomeX };
