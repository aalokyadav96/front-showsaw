import { apiFetch } from "../../api/api.js";
import Tooltip from "../../components/ui/Tooltip.mjs";
import Toast from "../../components/ui/Toast.mjs";

// Function to display the search section
async function displaySearch(isLoggedIn, searchsec) {
    const srchsec = document.createElement("div");
    srchsec.id = "srch";
    searchsec.appendChild(srchsec);
    displaySearchForm(srchsec);
}

async function displaySearchForm(container) {
    // Create search container
    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search-container");

    // Heading
    const heading = document.createElement("h1");
    heading.textContent = "Search for Events, Places, Businesses, and People";
    searchContainer.appendChild(heading);

    // Search input
    const searchInput = document.createElement("input");
    searchInput.id = "search-query";
    searchInput.placeholder = "Search by name, keyword, or category...";
    searchInput.required = true;
    searchContainer.appendChild(searchInput);

    // Filter options container
    const filters = document.createElement("div");
    filters.id = "filters";

    // Search type filter
    const searchTypeFilter = document.createElement("select");
    searchTypeFilter.id = "search-type-filter";
    searchTypeFilter.innerHTML = `
        <option value="">Select Type</option>
        <option value="events">Events</option>
        <option value="places">Places</option>
        <option value="businesses">Businesses</option>
        <option value="people">People</option>
    `;
    searchTypeFilter.required = true;
    filters.appendChild(searchTypeFilter);

    // Location filter
    const locationFilter = document.createElement("input");
    locationFilter.type = "text";
    locationFilter.id = "location-filter";
    locationFilter.placeholder = "Enter location...";
    locationFilter.required = true;
    filters.appendChild(locationFilter);

    // Price range
    const priceRange = document.createElement("input");
    priceRange.type = "range";
    priceRange.id = "price-range";
    priceRange.min = 0;
    priceRange.max = 1000;
    priceRange.step = 10;
    filters.appendChild(priceRange);

    const priceValue = document.createElement("span");
    priceValue.id = "price-value";
    priceValue.textContent = "$0 - $1000";
    filters.appendChild(priceValue);

    // Tooltip for assistance
    const tooltip = Tooltip("Use filters to refine your search.");
    filters.appendChild(tooltip);

    // Apply filters button
    const applyFiltersButton = document.createElement("button");
    applyFiltersButton.id = "apply-filters";
    applyFiltersButton.textContent = "Apply Filters";
    filters.appendChild(applyFiltersButton);

    searchContainer.appendChild(filters);

    // Search results container
    const searchResultsContainer = document.createElement("div");
    searchResultsContainer.id = "search-results";
    searchContainer.appendChild(searchResultsContainer);

    container.appendChild(searchContainer);

    initializeSearchListeners();
}

function initializeSearchListeners() {
    const searchInput = document.getElementById("search-query");
    const searchTypeFilter = document.getElementById("search-type-filter");
    const locationFilter = document.getElementById("location-filter");
    const priceRange = document.getElementById("price-range");
    const priceValue = document.getElementById("price-value");
    const applyFiltersButton = document.getElementById("apply-filters");
    const searchResultsContainer = document.getElementById("search-results");

    // Display price range dynamically
    priceRange.addEventListener("input", () => {
        priceValue.textContent = `$0 - $${priceRange.value}`;
    });

    // Validate inputs
    function validateInputs() {
        let isValid = true;

        if (!searchInput.value.trim()) {
            isValid = false;
            searchInput.classList.add("error");
        } else {
            searchInput.classList.remove("error");
        }

        if (!searchTypeFilter.value) {
            isValid = false;
            searchTypeFilter.classList.add("error");
        } else {
            searchTypeFilter.classList.remove("error");
        }

        if (!locationFilter.value.trim()) {
            isValid = false;
            locationFilter.classList.add("error");
        } else {
            locationFilter.classList.remove("error");
        }

        return isValid;
    }

    // Fetch results from backend
    async function fetchSearchResults() {
        if (!validateInputs()) {
            Toast("Please fill out all required fields.", "error");
            return;
        }

        const queryParams = {
            query: searchInput.value,
            type: searchTypeFilter.value,
            location: locationFilter.value,
            maxPrice: priceRange.value,
        };
        const searchParams = new URLSearchParams(queryParams);
        const data = await apiFetch(`/search/${queryParams.type}?${searchParams.toString()}`);
        displaySearchResults(data);
    }

    // Display search results
    function displaySearchResults(data) {
        searchResultsContainer.innerHTML = ""; // Clear old results

        if (data && data.length > 0) {
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
                    <strong>Price:</strong> $${item.price || "Free"}
                `;
                card.appendChild(details);

                searchResultsContainer.appendChild(card);
            });
        } else {
            const noResults = document.createElement("p");
            noResults.textContent = "No results found. Try refining your search.";
            searchResultsContainer.appendChild(noResults);
        }
    }

    // Add event listeners
    applyFiltersButton.addEventListener("click", fetchSearchResults);
    searchInput.addEventListener("input", () => searchInput.classList.remove("error"));
    searchTypeFilter.addEventListener("change", () => searchTypeFilter.classList.remove("error"));
    locationFilter.addEventListener("input", () => locationFilter.classList.remove("error"));
}

export { displaySearch, displaySearchForm };
