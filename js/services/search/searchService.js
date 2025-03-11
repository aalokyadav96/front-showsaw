import { SEARCH_URL } from "../../state/state.js";
import Toast from "../../components/ui/Toast.mjs";

// Function to display search section
async function displaySearch(searchsec) {
    const srchsec = document.createElement("div");
    srchsec.id = "srch";
    searchsec.appendChild(srchsec);
    displaySearchForm(srchsec);
}

// Function to display search form and tabs
async function displaySearchForm(container) {
    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search-container");

    // Search Input Section
    const searchBar = document.createElement("div");
    searchBar.classList.add("search-bar");

    const searchInput = document.createElement("input");
    searchInput.id = "search-query";
    searchInput.placeholder = "Search anything...";
    searchInput.required = true;

    const searchButton = document.createElement("button");
    searchButton.id = "search-button";
    searchButton.textContent = "Search";

    searchBar.appendChild(searchInput);
    searchBar.appendChild(searchButton);
    searchContainer.appendChild(searchBar);

    // Tabs Section
    const tabContainer = document.createElement("div");
    tabContainer.classList.add("tab-container");

    const tabs = [
        { title: "Events", id: "events" },
        { title: "Places", id: "places" },
        { title: "Businesses", id: "businesses" },
        { title: "People", id: "people" },
    ];

    tabs.forEach((tab, index) => {
        const tabButton = document.createElement("button");
        tabButton.classList.add("tab-button");
        tabButton.textContent = tab.title;
        tabButton.dataset.type = tab.id;

        if (index === 0) {
            tabButton.classList.add("active"); // Set "Events" as default active tab
        }

        tabButton.addEventListener("click", () => switchTab(tab.id));
        tabContainer.appendChild(tabButton);
    });

    searchContainer.appendChild(tabContainer);

    // Results Section
    const searchResultsContainer = document.createElement("div");
    searchResultsContainer.id = "search-results";

    searchContainer.appendChild(searchResultsContainer);
    container.appendChild(searchContainer);

    // Attach event listener for search
    searchButton.addEventListener("click", fetchSearchResults);
}

// Function to handle tab switching
function switchTab(selectedType) {
    document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.remove("active");
    });
    document.querySelector(`[data-type="${selectedType}"]`).classList.add("active");

    // Re-fetch results for the newly selected tab if there's a search query
    if (document.getElementById("search-query").value.trim()) {
        fetchSearchResults();
    }
}

// Function to fetch search results based on the active tab
async function fetchSearchResults() {
    const query = document.getElementById("search-query").value.trim();
    const activeTab = document.querySelector(".tab-button.active").dataset.type;

    if (!query) {
        Toast("Please enter a search query.", "error");
        return;
    }

    try {
        const url = `${SEARCH_URL}/search/${activeTab}?query=${encodeURIComponent(query)}`;
        const results = await apiFetch(url);

        displaySearchResults(results);
    } catch (error) {
        Toast("Error fetching search results.", "error");
    }
}

// Function to display search results
function displaySearchResults(data) {
    const searchResultsContainer = document.getElementById("search-results");
    searchResultsContainer.innerHTML = ""; // Clear previous results

    if (data.length === 0) {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("result-card");

        const name = document.createElement("h3");
        name.textContent = item.name;
        card.appendChild(name);

        const details = document.createElement("p");
        details.innerHTML = `
            <strong>Type:</strong> ${item.type} <br>
            <strong>Location:</strong> ${item.location || "N/A"} <br>
            <strong>Category:</strong> ${item.category || "N/A"} <br>
            <strong>Date:</strong> ${item.date || "N/A"} <br>
            <strong>Price:</strong> $${item.price || "Free"} <br>
            <em>${item.description || ""}</em>
        `;
        card.appendChild(details);

        searchResultsContainer.appendChild(card);
    });
}

// Generic API fetch function
async function apiFetch(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch data");
        const text = await response.text();
        return text ? JSON.parse(text) : [];
    } catch (error) {
        console.error(`API Fetch Error: ${error}`);
        Toast(`API Fetch Error: ${error}`, "error");
        return [];
    }
}

export { displaySearch };

// import { SEARCH_URL } from "../../state/state.js";
// import Toast from "../../components/ui/Toast.mjs";

// // Function to display the search UI
// async function displaySearch(isLoggedIn, searchsec) {
//     const srchsec = document.createElement("div");
//     srchsec.id = "srch";
    
//     // Search Bar
//     const searchContainer = document.createElement("div");
//     searchContainer.classList.add("search-container");

//     const searchInput = document.createElement("input");
//     searchInput.id = "search-query";
//     searchInput.placeholder = "Search events, places, businesses, people...";
//     searchInput.required = true;

//     const searchButton = document.createElement("button");
//     searchButton.textContent = "Search";
//     searchButton.addEventListener("click", fetchSearchResults);

//     searchContainer.appendChild(searchInput);
//     searchContainer.appendChild(searchButton);
//     srchsec.appendChild(searchContainer);

//     // Results Container (will be updated dynamically)
//     const resultsContainer = document.createElement("div");
//     resultsContainer.id = "results-container";
//     srchsec.appendChild(resultsContainer);

//     searchsec.appendChild(srchsec);
// }

// // Function to fetch and display search results in tabs
// async function fetchSearchResults() {
//     const query = document.getElementById("search-query").value.trim();
//     if (!query) {
//         Toast("Please enter a search term.", "error");
//         return;
//     }

//     try {
//         const searchParams = new URLSearchParams({ query });
//         let data = await apiFetch(`${SEARCH_URL}/search?${searchParams.toString()}`);

//         if (!data || Object.keys(data).length === 0) {
//             Toast("No results found.", "warning");
//             return;
//         }

//         displaySearchResults(data);
//     } catch (error) {
//         Toast("Error fetching results.", "error");
//         console.error("Search Error:", error);
//     }
// }

// // Function to display results in tabs
// function displaySearchResults(results) {
//     const resultsContainer = document.getElementById("results-container");
//     resultsContainer.innerHTML = ""; // Clear previous results

//     const tabs = [];

//     if (results.events && results.events.length > 0) {
//         tabs.push({
//             title: "Events",
//             id: "event-results-tab",
//             render: (container) => displayEventResults(container, results.events),
//         });
//     }
//     if (results.places && results.places.length > 0) {
//         tabs.push({
//             title: "Places",
//             id: "places-results-tab",
//             render: (container) => displayPlaceResults(container, results.places),
//         });
//     }
//     if (results.businesses && results.businesses.length > 0) {
//         tabs.push({
//             title: "Businesses",
//             id: "businesses-results-tab",
//             render: (container) => displayBusinessResults(container, results.businesses),
//         });
//     }
//     if (results.people && results.people.length > 0) {
//         tabs.push({
//             title: "People",
//             id: "people-results-tab",
//             render: (container) => displayPeopleResults(container, results.people),
//         });
//     }

//     if (tabs.length === 0) {
//         resultsContainer.innerHTML = "<p>No results found.</p>";
//         return;
//     }

//     // Create tabbed interface
//     const tabContainer = createTabs(tabs);
//     resultsContainer.appendChild(tabContainer);
// }

// // Example result display functions
// function displayEventResults(container, events) {
//     container.innerHTML = events.map(event => `
//         <div class="result-card">
//             <h3>${event.name}</h3>
//             <p>${event.location} | ${event.date}</p>
//             <p>${event.description}</p>
//         </div>
//     `).join("");
// }

// function displayPlaceResults(container, places) {
//     container.innerHTML = places.map(place => `
//         <div class="result-card">
//             <h3>${place.name}</h3>
//             <p>${place.location}</p>
//             <p>${place.description}</p>
//         </div>
//     `).join("");
// }

// function displayBusinessResults(container, businesses) {
//     container.innerHTML = businesses.map(business => `
//         <div class="result-card">
//             <h3>${business.name}</h3>
//             <p>${business.location}</p>
//             <p>${business.description}</p>
//         </div>
//     `).join("");
// }

// function displayPeopleResults(container, people) {
//     container.innerHTML = people.map(person => `
//         <div class="result-card">
//             <h3>${person.name}</h3>
//             <p>${person.occupation}</p>
//             <p>${person.bio}</p>
//         </div>
//     `).join("");
// }

// // API Fetch function
// async function apiFetch(endpoint) {
//     try {
//         const response = await fetch(endpoint);
//         if (response.ok) {
//             const text = await response.text();
//             return text ? JSON.parse(text) : null;
//         } else {
//             throw new Error(await response.text() || "Unknown error");
//         }
//     } catch (error) {
//         console.error(`Error fetching ${endpoint}:`, error);
//         throw error;
//     }
// }

// export { displaySearch };
