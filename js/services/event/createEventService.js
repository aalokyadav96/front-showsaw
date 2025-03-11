import { navigate } from "../../routes/index.js";
import SnackBar from '../../components/ui/Snackbar.mjs';
import { createFormField, addEventEventListeners } from "./createEventHelpers.js";

async function createEventForm(isLoggedIn, content) {
    const createSection = document.createElement("div");
    createSection.className = "create-section";

    if (isLoggedIn) {
        // Create and append the header
        const header = document.createElement("h2");
        header.textContent = "Create Event";
        createSection.appendChild(header);

        // Define form fields
        const formFields = [
            { type: "text", id: "event-title", label: "Event Title", required: true },
            { type: "textarea", id: "event-description", label: "Event Description", required: true },
            { type: "text", id: "event-place", label: "Event Place", required: true },
            { type: "text", id: "event-location", label: "Event Location", required: true },
            { type: "date", id: "event-date", label: "Select a Date", required: true },
            { type: "time", id: "event-time", label: "Select a Time", required: true },
            { type: "text", id: "organizer-name", label: "Organizer Name", required: true },
            { type: "text", id: "organizer-contact", label: "Organizer Contact", required: true },
            { type: "number", id: "total-capacity", label: "Total Capacity", required: true },
            { type: "url", id: "website-url", label: "Website URL" },
            {
                type: "select", id: "category", label: "Event Category", required: true,
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
            { type: "file", id: "event-banner", label: "Event Banner", accept: "image/*" },
            { type: "file", id: "event-seating", label: "Event Seating", accept: "image/*" },
        ];


        // Create and append form fields
        formFields.forEach(field => createSection.appendChild(createFormField(field)));

        // Create and append the create button
        const createButton = document.createElement("button");
        createButton.id = "create-event-btn";
        createButton.textContent = "Create Event";
        createSection.appendChild(createButton);

        // Add place suggestions box
        const eventPlaceInput = createSection.querySelector("#event-place");
        const placeSuggestionsBox = document.createElement("div");
        placeSuggestionsBox.id = "place-suggestions";
        placeSuggestionsBox.className = "suggestions-dropdown";
        createSection.appendChild(placeSuggestionsBox);

        content.appendChild(createSection);

        // Add event listeners
        addEventEventListeners(eventPlaceInput, placeSuggestionsBox, createButton);
    } else {
        SnackBar("Please log in to create an event.", 3000);
        navigate('/login');
    }
}



export { createEventForm };