import { state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import { displayTickets } from "../tickets/ticketService.js";
import { displayMedia } from "../media/mediaService.js";
import { displayMerchandise } from "../merch/merchService.js";
import { navigate } from "../../routes/index.js";
import SnackBar from "../../components/ui/Snackbar.mjs";
import { createElement } from "../../components/createElement.js";
import { displayEventTimeline, displayEventFAQ, displayEventReviews } from "./eventTabs.js";
import { displayEventDetails } from "./displayEventDetails.js";
import { createTabs } from "../../components/ui/createTabs.js";
import { updateEvent, editEventForm } from "./editEvent.js";

async function fetchEventData(eventId) {
    const eventData = await apiFetch(`/events/event/${eventId}`);
    if (!eventData || !Array.isArray(eventData.tickets)) {
        throw new Error("Invalid event data received.");
    }
    return eventData;
}

async function displayEvent(isLoggedIn, eventId, contentContainer) {
    try {
        const eventData = await fetchEventData(eventId);
        const isCreator = isLoggedIn && state.user === eventData.creatorid;

        contentContainer.innerHTML = '';
        displayEventDetails(contentContainer, eventData, isCreator, isLoggedIn);

        let container = document.createElement('div');
        contentContainer.appendChild(container);

        const tabs = [
            { title: 'Tickets', id: 'tickets-tab', render: (container) => displayTickets(container,eventData.tickets, eventId, isCreator, isLoggedIn) },
            { title: 'Reviews', id: 'reviews-tab', render: (container) => displayEventReviews(container,eventId, isCreator, isLoggedIn) },
            { title: 'Merchandise', id: 'merch-tab', render: (container) => displayMerchandise(container,eventData.merch, eventId, isCreator, isLoggedIn) },
            { title: 'Media', id: 'media-tab', render: (container) => displayMedia(container,'event', eventId, isLoggedIn) },
            { title: 'FAQ', id: 'faq-tab', render: (container) => displayEventFAQ(container,isCreator, eventId, eventData.faqs) },
        ];

        const tabContainer = createTabs(tabs);
        contentContainer.appendChild(tabContainer);
        
        // const tabContainer = createTabs(tabs, 'tickets-tab');

        // contentContainer.appendChild(tabContainer);
    } catch (error) {
        contentContainer.innerHTML = '';
        contentContainer.appendChild(createElement('h1', { textContent: `Error loading event details: ${error.message}` }));
        SnackBar("Failed to load event details. Please try again later.", 3000);
    }
}



async function deleteEvent(isLoggedIn, eventId) {
    if (!isLoggedIn) {
        SnackBar("Please log in to delete your event.", 3000);
        return;
    }
    if (confirm("Are you sure you want to delete this event?")) {
        try {
            await apiFetch(`/events/event/${eventId}`, 'DELETE');
            SnackBar("Event deleted successfully.", 3000);
            navigate('/events'); // Redirect to home or another page
        } catch (error) {
            SnackBar(`Error deleting event: ${error.message}`, 3000);
        }
    }
};

export { updateEvent, fetchEventData, editEventForm, deleteEvent, displayEvent, displayEventTimeline, displayEventFAQ, displayEventReviews };