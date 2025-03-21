import { SEARCH_URL, SRC_URL } from "../../state/state.js";
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
  searchBar.classList.add("search-bar", "d3");

  const searchInput = document.createElement("input");
  searchInput.id = "search-query";
  searchInput.className = "search-field";
  searchInput.placeholder = "Search anything...";
  searchInput.required = true;

  const searchButton = document.createElement("button");
  searchButton.id = "search-button";
  searchButton.className = "search-btn";
  searchButton.innerHTML = `
    <span style="margin-right: 0.5rem;font-size: 1rem;">Search</span>
    <svg class="srchicon" viewBox="0 0 24 24" width="100%" height="100%" role="img" stroke="#000000">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>`;

  searchBar.appendChild(searchInput);
  searchBar.appendChild(searchButton);
  searchContainer.appendChild(searchBar);

  // Tabs Section
  const tabContainer = document.createElement("div");
  tabContainer.classList.add("tabs-container", "R6-Wf");

  const tabButtonCon = document.createElement("div");
  tabButtonCon.classList.add("tab-buttons");

  const tabs = [
    { title: "All", id: "all" },
    { title: "Events", id: "events" },
    { title: "Places", id: "places" },
    // Additional tabs can be added here
  ];

  tabs.forEach((tab, index) => {
    const tabButton = document.createElement("div");
    tabButton.classList.add("tab-button");
    tabButton.textContent = tab.title;
    tabButton.dataset.type = tab.id;

    // Set first tab as active by default
    if (index === 0) {
      tabButton.classList.add("active");
    }

    tabButton.addEventListener("click", () => switchTab(tab.id));
    tabButtonCon.appendChild(tabButton);
  });

  tabContainer.appendChild(tabButtonCon);
  searchContainer.appendChild(tabContainer);

  // Results Section
  const searchResultsContainer = document.createElement("div");
  searchResultsContainer.id = "search-results";
  searchResultsContainer.className = "hvflex";
  searchContainer.appendChild(searchResultsContainer);

  container.appendChild(searchContainer);

  // Attach event listener for search button
  searchButton.addEventListener("click", fetchSearchResults);
}

// Function to handle tab switching
function switchTab(selectedType) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelector(`[data-type="${selectedType}"]`).classList.add("active");

  // Re-fetch results if there's an active search query
  if (document.getElementById("search-query").value.trim()) {
    fetchSearchResults();
  }
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
    displaySearchResults(activeTab, results);
  } catch (error) {
    Toast("Error fetching search results.", "error");
  }
}

// Helper function to create a result card element
function createCard(entityType, item) {
  const card = document.createElement("div");
  card.classList.add("result-card", entityType);

  // Header (Image + Info)
  const header = document.createElement("div");
  header.classList.add("result-header");

  // Image (if exists)
  let imageSrc = "";
  let altText = "";
  if (entityType === "events") {
    imageSrc = `${SRC_URL}/eventpic/${item.eventid}.jpg`;
    altText = item.title || "Event";
  } else if (entityType === "places") {
    imageSrc = `${SRC_URL}/placepic/${item.placeid}.webp`;
    altText = item.name || "Place";
  }
  if (imageSrc) {
    const image = document.createElement("img");
    image.src = imageSrc;
    image.loading = "lazy";
    image.alt = altText;
    image.classList.add("result-image");
    header.appendChild(image);
  }

  // Info section
  const info = document.createElement("div");
  info.classList.add("result-info");
  if (entityType === "events") {
    const title = document.createElement("h3");
    title.textContent = item.title || "No Title";
    info.appendChild(title);
  } else if (entityType === "places") {
    const name = document.createElement("h3");
    name.textContent = item.name || "No Name";
    info.appendChild(name);
  }
  if (item.category) {
    const category = document.createElement("p");
    category.classList.add("category");
    category.textContent = `🏷️ ${item.category}`;
    info.appendChild(category);
  }
  header.appendChild(info);
  card.appendChild(header);

  // Details section
  const details = document.createElement("div");
  details.classList.add("result-details");
  if (entityType === "events") {
    details.innerHTML = `
      <strong>Location:</strong> ${item.location || "N/A"} 
      <br>
      <strong>Date:</strong> ${item.date ? new Date(item.date).toLocaleString() : "N/A"} 
      <br>
      <em>${item.description || "No description available."}</em>
    `;
  } else if (entityType === "places") {
    details.innerHTML = `
      <strong>Address:</strong> ${item.address || "N/A"} 
      <br>
      <strong>Rating:</strong> ${item.rating || "Not Rated"} 
      <br>
      <em>Description: ${item.description || "No description available."}</em>
    `;
  }
  card.appendChild(details);

  // Footer (Buttons)
  const footer = document.createElement("div");
  footer.classList.add("result-footer");
  if (entityType === "events" && item.eventid) {
    const cta = document.createElement("a");
    cta.href = `/event/${item.eventid}`;
    cta.textContent = "View Details";
    cta.classList.add("btn");
    cta.target = "_blank";
    footer.appendChild(cta);
  } else if (entityType === "places" && item.placeid) {
    const cta = document.createElement("a");
    cta.href = `/place/${item.placeid}`;
    cta.textContent = "View on Map";
    cta.classList.add("btn");
    cta.target = "_blank";
    footer.appendChild(cta);
  }
  if (footer.children.length > 0) {
    card.appendChild(footer);
  }
  return card;
}

// Function to display search results
function displaySearchResults(entityType, data) {
  const searchResultsContainer = document.getElementById("search-results");
  searchResultsContainer.innerHTML = ""; // Clear previous results

  // Handle the "all" tab, which returns an object with both events and places
  if (entityType === "all" && typeof data === "object" && !Array.isArray(data)) {
    // Display events if available
    if (data.events && data.events.length > 0) {
      const eventsHeader = document.createElement("h2");
      eventsHeader.textContent = "Events";
      searchResultsContainer.appendChild(eventsHeader);
      data.events.forEach((item) => {
        const card = createCard("events", item);
        searchResultsContainer.appendChild(card);
      });
    }

    // Display places if available
    if (data.places && data.places.length > 0) {
      const placesHeader = document.createElement("h2");
      placesHeader.textContent = "Places";
      searchResultsContainer.appendChild(placesHeader);
      data.places.forEach((item) => {
        const card = createCard("places", item);
        searchResultsContainer.appendChild(card);
      });
    }

    // If neither events nor places have results, show a message
    if (
      (!data.events || data.events.length === 0) &&
      (!data.places || data.places.length === 0)
    ) {
      searchResultsContainer.innerHTML = "<p>No results found.</p>";
    }
  }
  // Otherwise, assume data is an array (for "events" or "places" tabs)
  else if (Array.isArray(data)) {
    if (data.length === 0) {
      searchResultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }
    data.forEach((item) => {
      const card = createCard(entityType, item);
      searchResultsContainer.appendChild(card);
    });
  } else {
    searchResultsContainer.innerHTML = "<p>No results found.</p>";
  }
}

export { displaySearch };
