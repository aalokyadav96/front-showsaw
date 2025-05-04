import {createTabs, loadSection, feedMode} from "../services/home/homeService.js"; 

// ============================
// Main Home Function
// ============================
function Home(isLoggedIn, container) {
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

export { Home };
