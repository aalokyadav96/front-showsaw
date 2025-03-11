import { state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import { navigate } from "../../routes/index.js";
import SnackBar from '../../components/ui/Snackbar.mjs';

// Function to create form fields
function createFormField(field) {
    const formGroup = document.createElement("div");
    formGroup.className = "form-group";

    // Create label if applicable
    if (field.label) {
        const label = document.createElement("label");
        label.setAttribute("for", field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);
    }

    let inputElement;
    if (field.type === "textarea") {
        inputElement = document.createElement("textarea");
    } else if (field.type === "select") {
        inputElement = document.createElement("select");
        field.options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            inputElement.appendChild(optionElement);
        });
    } else {
        inputElement = document.createElement("input");
        inputElement.type = field.type;
    }

    inputElement.id = field.id;
    if (field.required) inputElement.required = true;
    if (field.accept) inputElement.accept = field.accept;

    formGroup.appendChild(inputElement);
    return formGroup;
}

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


async function createEvent(isLoggedIn) {
    if (isLoggedIn && state.user) {
        const title = document.getElementById("event-title").value.trim();
        const date = document.getElementById("event-date").value;
        const time = document.getElementById("event-time").value;
        const place = document.getElementById("event-place").value.trim();
        const location = document.getElementById("event-location").value.trim();
        const description = document.getElementById("event-description").value.trim();
        const category = document.getElementById("category").value;
        const bannerFile = document.getElementById("event-banner").files[0];
        const seatingPlanFile = document.getElementById("event-seating").files[0];

        if (!title || !date || !time || !place || !location || !description || !category) {
            SnackBar("Please fill in all required fields.", 3000);
            return;
        }

        // Properly format date as an ISO string
        const eventDate = new Date(`${date}T${time}:00`); // Browser automatically adjusts for local time
        console.log("Event Date (Local Time):", eventDate.toString());
        console.log("Event Date (UTC Format):", eventDate.toISOString());

        const formData = new FormData();
        formData.append('event', JSON.stringify({
            title,
            date: eventDate.toISOString(), // Ensure proper formatting
            location,
            place,
            description,
            category
        }));
        if (bannerFile) {
            formData.append('banner', bannerFile);
        }
        if (seatingPlanFile) {
            formData.append('event-seating', seatingPlanFile);
        }

        try {
            const result = await apiFetch('/events/event', 'POST', formData);
            SnackBar(`Event created successfully: ${result.title}`, 3000);
            navigate('/event/' + result.eventid);
        } catch (error) {
            SnackBar(`Error creating event: ${error.message}`, 3000);
        }
    } else {
        navigate('/login');
    }
}

export { createFormField, addEventEventListeners };