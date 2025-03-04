import { createElement } from "../../components/createElement.js";
import SnackBar from '../../components/ui/Snackbar.mjs';
import { navigate } from "../../routes/index.js";
import { apiFetch } from "../../api/api.js";
import { state } from "../../state/state.js";

async function createEventForm(isLoggedIn, content) {
    const createSection = document.createElement('div');
    createSection.className = "create-section";

    if (!isLoggedIn) {
        SnackBar("Please log in to create an event.", 3000);
        navigate('/login');
        return;
    }

    // Create and append the header
    const header = document.createElement("h2");
    header.textContent = "Create Event";
    createSection.appendChild(header);

    // Define form fields
    const formFields = [
        {
            type: "select",
            id: "category",
            required: true,
            options: [
                { value: "", label: "Select a category" },
                { value: "conference", label: "Conference" },
                { value: "concert", label: "Concert" },
                { value: "sports", label: "Sports" },
                { value: "festival", label: "Festival" },
                { value: "meetup", label: "Meetup" },
                { value: "workshop", label: "Workshop" },
                { value: "theater", label: "Theater" },
                { value: "other", label: "Other" }
            ]
        },
        { type: "text", id: "event-title", placeholder: "Event Title", required: true },
        { type: "textarea", id: "event-description", placeholder: "Event Description", required: true },
        { type: "text", id: "event-place", placeholder: "Event Place", required: true },
        { type: "text", id: "event-location", placeholder: "Event Location", required: true },
        { type: "date", id: "event-date", required: true },
        { type: "time", id: "event-time", required: true },
        { type: "text", id: "organizer-name", placeholder: "Organizer Name", required: true },
        { type: "text", id: "organizer-contact", placeholder: "Organizer Contact", required: true },
        { type: "number", id: "total-capacity", placeholder: "Total Capacity", required: true },
        { type: "url", id: "website-url", placeholder: "Website URL" },
        { type: "file", id: "event-banner", accept: "image/*" },
    ];

    // Create the form with a proper submission callback
    const form = createForm(formFields, async (formData) => {
        return await createEvent(formData); // Send the formData to the event creation function
    });

    createSection.appendChild(form);
    content.appendChild(createSection);

    // Add place suggestions box
    const eventPlaceInput = createSection.querySelector("#event-place");
    const placeSuggestionsBox = document.createElement("div");
    placeSuggestionsBox.id = "place-suggestions";
    placeSuggestionsBox.className = "suggestions-dropdown";
    createSection.appendChild(placeSuggestionsBox);

    // Add event listeners
    addEventEventListeners(eventPlaceInput, placeSuggestionsBox);
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function addEventEventListeners(eventPlaceInput, placeSuggestionsBox) {
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

    const debouncedFetchSuggestions = debounce(fetchPlaceSuggestions, 300);

    // Event listener for place input with debouncing
    eventPlaceInput.addEventListener("input", debouncedFetchSuggestions);

    // Close suggestions when clicking outside
    document.addEventListener("click", (event) => {
        if (!event.target.closest("#event-place") && !event.target.closest("#place-suggestions")) {
            placeSuggestionsBox.style.display = "none";
        }
    });
}

async function createEvent(formData) {
    if (state.user) {
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

export { createEventForm };

// Helper function to create a form dynamically
function createForm(fields, onSubmit) {
    const form = createElement('form');

    async function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(form);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Error creating event:", error);
            SnackBar("Failed to create event. Please try again.", 3000);
        }
    }

    form.addEventListener('submit', handleFormSubmit);

    fields.forEach(field => {
        const formGroup = createElement('div', { class: 'form-group' });

        // Create label
        if (field.label) {
            const label = createElement('label', { for: field.id }, [field.label]);
            formGroup.appendChild(label);
        }

        let inputElement;
        if (field.type === 'select') {
            inputElement = createElement('select', { id: field.id, name: field.id, required: field.required },
                field.options.map(option =>
                    createElement('option', { value: option.value }, [option.label])
                )
            );
        } else {
            inputElement = createElement(field.type === 'textarea' ? 'textarea' : 'input', {
                id: field.id,
                name: field.id,
                type: field.type || 'text',
                placeholder: field.placeholder || '',
                ...(field.required ? { required: true } : {}),
                ...(field.type === 'file' && field.accept ? { accept: field.accept } : {}),
                ...(field.min ? { min: field.min } : {}),
            });
        }

        formGroup.appendChild(inputElement);
        form.appendChild(formGroup);
    });

    form.appendChild(createElement('button', { type: 'submit' }, ["Create Event"]));
    return form;
}
