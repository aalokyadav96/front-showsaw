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

function addEventEventListeners(eventPlaceInput, createButton) {
    createButton.addEventListener("click", createEvent);
    addAutoConListeners(eventPlaceInput);
}

function addAutoConListeners(eventPlaceInput) {

    async function fetchPlaceSuggestions() {
        const query = eventPlaceInput.value.trim();
        const autocompleteList = document.getElementById("ac-list");

        if (query.length < 1) {
            autocompleteList.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(`/api/suggestions/places?query=${query}`);
            const suggestions = await response.json();

            autocompleteList.innerHTML = "";
            suggestions.forEach((suggestion) => {
                const item = document.createElement("li");
                item.classList.add("ac-item");
                item.textContent = suggestion.name;
                eventPlaceInput.dataset.id = suggestion.id;
                item.addEventListener("click", () => {
                    eventPlaceInput.value = suggestion.name;
                    eventPlaceInput.dataset.id = suggestion.id;
                    autocompleteList.innerHTML = "";
                });
                autocompleteList.appendChild(item);
            });

            if (suggestions.length > 0) {
                autocompleteList.style.display = "block";
            } else {
                autocompleteList.style.display = "none";
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
        }
    }

    const debouncedFetchSuggestions = debounce(fetchPlaceSuggestions, 300);
    eventPlaceInput.addEventListener("input", debouncedFetchSuggestions);

    // Handle keyboard navigation
    eventPlaceInput.addEventListener("keydown", (event) => handleKeyboardNav(event, eventPlaceInput));

    // // Hide suggestions when clicking outside
    // document.addEventListener("click", (event) => {
    //     if (!event.target.closest(".suggestions-container")) {
    //         document.getElementById("ac-list").style.display = "none";
    //     }
    // });
}

// Handle keyboard navigation in autocomplete
function handleKeyboardNav(event, eventPlaceInput) {
    const autocompleteList = document.getElementById("ac-list");
    const items = autocompleteList.querySelectorAll(".ac-item");

    if (items.length === 0) return;

    let index = Array.from(items).findIndex((item) => item.classList.contains("selected"));

    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (index < items.length - 1) index++;
        else index = 0;
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (index > 0) index--;
        else index = items.length - 1;
    } else if (event.key === "Enter") {
        event.preventDefault();
        if (index >= 0) {
            eventPlaceInput.value = items[index].textContent;
            autocompleteList.innerHTML = "";
        }
        return;
    } else {
        return;
    }

    items.forEach((item) => item.classList.remove("selected"));
    items[index].classList.add("selected");
}


async function createEvent(isLoggedIn) {
    if (isLoggedIn && state.user) {
        const title = document.getElementById("event-title").value.trim();
        const date = document.getElementById("event-date").value;
        const time = document.getElementById("event-time").value;
        // const place = document.getElementById("event-place").value.trim();
        const location = document.getElementById("event-location").value.trim();
        const description = document.getElementById("event-description").value.trim();
        const category = document.getElementById("category").value;
        const bannerFile = document.getElementById("event-banner").files[0];
        const seatingPlanFile = document.getElementById("event-seating").files[0];
        const place = document.getElementById("event-place");
        const placeID = place.dataset.id || ""; // Get stored placeID
        const placeName = place.value; // Get place name (displayed to user)

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
            // place,
            placeID,
            placeName,
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

            // if (success) {
            //     logActivity("event_created", { eventId: eventData.id, category: eventData.category });
            // }
            SnackBar(`Event created successfully: ${result.title}`, 3000);
            navigate('/event/' + result.eventid);
        } catch (error) {
            SnackBar(`Error creating event: ${error.message}`, 3000);
        }
    } else {
        navigate('/login');
    }
}

export { createFormField, addEventEventListeners, addAutoConListeners, handleKeyboardNav };