
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function addEventEventListeners(eventPlaceInput, placeSuggestionsBox, createButton) {
    // Add event listener to the create button
    createButton.addEventListener("click", createEvent);

    async function fetchPlaceSuggestions() {
        const query = eventPlaceInput.value.trim();
        if (!query) {
            placeSuggestionsBox.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`/api/suggestions/places?query=${query}`);
            const suggestions = await response.json();

            placeSuggestionsBox.innerHTML = "";
            placeSuggestionsBox.style.display = suggestions.length > 0 ? "block" : "none";

            suggestions.forEach(suggestion => {
                const suggestionElement = document.createElement("div");
                suggestionElement.className = "suggestion-item";
                suggestionElement.textContent = suggestion.name;
                suggestionElement.dataset.id = suggestion.id;

                suggestionElement.addEventListener("click", () => {
                    eventPlaceInput.value = suggestion.name;
                    placeSuggestionsBox.style.display = "none";
                });

                placeSuggestionsBox.appendChild(suggestionElement);
            });
        } catch (error) {
            console.error("Error fetching place suggestions:", error);
            placeSuggestionsBox.style.display = "none";
        }
    }

    const debouncedFetchSuggestions = debounce(fetchPlaceSuggestions, 300); // Adjust delay as needed

    // Event listener for place input with debouncing
    eventPlaceInput.addEventListener("input", debouncedFetchSuggestions);

    // Close suggestions when clicking outside
    document.addEventListener("click", (event) => {
        if (!event.target.closest("#event-place") && !event.target.closest("#place-suggestions")) {
            placeSuggestionsBox.style.display = "none";
        }
    });
}
