import { state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import { navigate } from "../../routes/index.js";
import SnackBar from "../../components/ui/Snackbar.mjs";
import { createElement } from "../../components/createElement.js";
import { createTabs } from "../../components/ui/createTabs.js";

import { displayEventDetails } from "./displayEventDetails.js";
import { updateEvent, editEventForm } from "./editEvent.js";
import { displayTickets } from "../tickets/ticketService.js";
import { displayMerchandise } from "../merch/merchService.js";
import { displayMedia } from "../media/mediaService.js";

import {
    displayEventFAQ,
    displayEventReviews,
    // displayEventSchedule,
    // displayLivestream,
    displayLostAndFound,
    displayContactDetails
} from "./eventTabs.js";

// 🗑 Delete Event
async function deleteEvent(isLoggedIn, eventId) {
    if (!isLoggedIn) return SnackBar("Please log in to delete your event.", 3000);

    if (confirm("Are you sure you want to delete this event?")) {
        try {
            await apiFetch(`/events/event/${eventId}`, 'DELETE');
            SnackBar("Event deleted successfully.", 3000);
            navigate('/events');
        } catch (error) {
            SnackBar(`Error deleting event: ${error.message}`, 3000);
        }
    }
}

// 📊 Analytics (Placeholder for now)
async function viewEventAnalytics(isLoggedIn, eventId) {
    if (!isLoggedIn) return SnackBar("Please log in to view your event analytics.", 3000);
    if (confirm("Do you want to view event analytics?")) {
        // TODO: Implement logic
    }
}

// 📥 Fetch Event Data
async function fetchEventData(eventId) {
    const eventData = await apiFetch(`/events/event/${eventId}`);
    if (!eventData || !Array.isArray(eventData.tickets)) {
        throw new Error("Invalid event data received.");
    }
    return eventData;
}

// 📄 Main Event Display
// async function displayEvent(isLoggedIn, eventId, container) {
//     try {
//         const eventData = await fetchEventData(eventId);
//         const isCreator = isLoggedIn && state.user === eventData.creatorid;

//         container.innerHTML = '';

//         const wrapper = createElement('div');
//         await displayEventSections(wrapper, eventData, isCreator, isLoggedIn);

//         container.appendChild(wrapper);
//     } catch (error) {
//         container.innerHTML = '';
//         container.appendChild(
//             createElement('h1', { textContent: `Error loading event details: ${error.message}` })
//         );
//         SnackBar("Failed to load event details. Please try again later.", 3000);
//     }
// }


async function displayEvent(isLoggedIn, eventId, contentContainer) {
    try {
        const eventData = await fetchEventData(eventId);
        const isCreator = isLoggedIn && state.user === eventData.creatorid;

        contentContainer.innerHTML = '';
        await displayEventDetails(contentContainer, eventData, isCreator, isLoggedIn);

        // let container = document.createElement('div');
        // contentContainer.appendChild(container);

        const tabs = [
            // { title: 'Reviews', id: 'reviews-tab', render: (container) => displayEventReviews(container, eventId, isCreator, isLoggedIn) },
            // { title: 'Media', id: 'media-tab', render: (container) => displayMedia(container, 'event', eventId, isLoggedIn) },
        ];

        // let estatus = eventData.status;
        // let estatus = "ongoing";

        const then = new Date(eventData.date)
        const now = new Date();
        let timediff = then - now;
        let estatus = timediff <= 0 ? "ongoing" : "active";

        // Dynamically add tabs based on event status
        if (estatus === "active") {
            tabs.push(
                { title: 'Tickets', id: 'tickets-tab', render: (container) => displayTickets(container, eventData.tickets, eventId, isCreator, isLoggedIn) },
                { title: 'Merchandise', id: 'merch-tab', render: (container) => displayMerchandise(container, eventData.merch, eventId, isCreator, isLoggedIn) },
                { title: 'FAQ', id: 'faq-tab', render: (container) => displayEventFAQ(container, isCreator, eventId, eventData.faqs) },
                // { title: 'Schedule', id: 'schedule-tab', render: (container) => displayEventSchedule(container, isCreator, eventData.schedule) },
            );
        } else if (estatus === "ongoing") {
            tabs.push(
                // { title: 'Livestream', id: 'livestream-tab', render: (container) => displayLivestream(container, eventId, isLoggedIn) },
                { title: 'Reviews', id: 'reviews-tab', render: (container) => displayEventReviews(container, eventId, isCreator, isLoggedIn) },
                { title: 'Media', id: 'media-tab', render: (container) => displayMedia(container, 'event', eventId, isLoggedIn) },
                { title: 'Lost & Found', id: 'lnf-tab', render: (container) => displayLostAndFound(container, eventData.lostandfound) },
                { title: 'Contact', id: 'contact-tab', render: (container) => displayContactDetails(container, eventData.contactInfo) }
            );
        }

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



// 🧱 Display All Sections
async function displayEventSections(wrapper, eventData, isCreator, isLoggedIn) {
    console.log(eventData);
    wrapper.innerHTML = '';

    // 1. Main Event Overview
    await displayEventDetails(wrapper, eventData, isCreator, isLoggedIn);

    // 2. Tabs Container
    const tabsContainer = createElement('div', { class: 'tabs-container' });
    wrapper.appendChild(tabsContainer);

    // 3. Dynamically add sections
    const sections = [
        {
            condition: eventData.tickets?.length,
            renderer: () => displayTickets(section(), eventData.tickets, eventData.eventid, isCreator, isLoggedIn)
        },
        {
            condition: eventData.faqs?.length,
            renderer: () => displayEventFAQ(section(), isCreator, eventData.eventid, eventData.faqs)
        },
        {
            condition: eventData.merch?.length,
            renderer: () => displayMerchandise(section(), eventData.merch, eventData.eventid, isCreator, isLoggedIn)
        },
        // {
        //     condition: eventData.schedule?.length,
        //     renderer: () => displayEventSchedule(section(), isCreator, eventData.schedule)
        // },
        // {
        //     condition: eventData.livestreamLink,
        //     renderer: () => displayLivestream(section(), eventData.eventid, isLoggedIn)
        // },
        {
            condition: eventData.reviews?.length,
            renderer: () => displayEventReviews(section(), eventData.eventid, isCreator, isLoggedIn)
        },
        {
            condition: eventData.media?.length,
            renderer: () => displayMedia(section(), "event", eventData.eventid, isLoggedIn)
        },
        {
            condition: eventData.lostandfound?.length,
            renderer: () => displayLostAndFound(section(), eventData.lostandfound)
        },
        {
            condition: eventData.contactInfo,
            renderer: () => displayContactDetails(section(), eventData.contactInfo)
        }
    ];

    sections.forEach(({ condition, renderer }) => {
        // if (condition) renderer();
        renderer();
    });

    function section() {
        const el = createElement("section", { class: "event-section" });
        tabsContainer.appendChild(el);
        return el;
    }
}

export {
    updateEvent,
    editEventForm,
    fetchEventData,
    displayEvent,
    displayEventSections,
    deleteEvent,
    viewEventAnalytics
};

// import { state } from "../../state/state.js";
// import { apiFetch } from "../../api/api.js";
// import { displayTickets } from "../tickets/ticketService.js";
// import { displayMedia } from "../media/mediaService.js";
// import { displayMerchandise } from "../merch/merchService.js";
// import { navigate } from "../../routes/index.js";
// import SnackBar from "../../components/ui/Snackbar.mjs";
// import { createElement } from "../../components/createElement.js";
// import { displayEventFAQ, displayEventReviews } from "./eventTabs.js";
// import { displayEventDetails } from "./displayEventDetails.js";
// import { updateEvent, editEventForm } from "./editEvent.js";
// import { displayLostAndFound, displayContactDetails } from "./eventTabs.js";
// import { displayEventSchedule, displayLivestream } from "./eventTabs.js";



// async function deleteEvent(isLoggedIn, eventId) {
//     if (!isLoggedIn) {
//         SnackBar("Please log in to delete your event.", 3000);
//         return;
//     }
//     if (confirm("Are you sure you want to delete this event?")) {
//         try {
//             await apiFetch(`/events/event/${eventId}`, 'DELETE');
//             SnackBar("Event deleted successfully.", 3000);
//             navigate('/events'); // Redirect to home or another page
//         } catch (error) {
//             SnackBar(`Error deleting event: ${error.message}`, 3000);
//         }
//     }
// };


// async function viewEventAnalytics(isLoggedIn, eventId) {
//     if (!isLoggedIn) {
//         SnackBar("Please log in to view your event analytics.", 3000);
//         return;
//     }
//     if (confirm("Are you sure you want to view your event analytics?")) {
//         try {
//             // await apiFetch(`/events/event/${eventId}`, 'DELETE');
//             // SnackBar("Event deleted successfully.", 3000);
//             // navigate('/events'); // Redirect to home or another page
//         } catch (error) {
//             // SnackBar(`Error deleting event: ${error.message}`, 3000);
//         }
//     }
// };


// async function fetchEventData(eventId) {
//     const eventData = await apiFetch(`/events/event/${eventId}`);
//     if (!eventData || !Array.isArray(eventData.tickets)) {
//         throw new Error("Invalid event data received.");
//     }
//     return eventData;
// }

// async function displayEvent(isLoggedIn, eventId, contentContainer) {
//     try {
//         const eventData = await fetchEventData(eventId);
//         const isCreator = isLoggedIn && state.user === eventData.creatorid;

//         contentContainer.innerHTML = '';
 
//         let ch = createElement('div');
//         await displayEventSections(ch, eventData, isCreator, isLoggedIn);
//         contentContainer.appendChild(ch);

//         // const tabContainer = createTabs(tabs, 'tickets-tab');

//         // contentContainer.appendChild(tabContainer);
//     } catch (error) {
//         contentContainer.innerHTML = '';
//         contentContainer.appendChild(createElement('h1', { textContent: `Error loading event details: ${error.message}` }));
//         SnackBar("Failed to load event details. Please try again later.", 3000);
//     }
// }


// export async function displayEventSections(contentxContainer, eventData, isCreator, isLoggedIn) {
//     contentxContainer.innerHTML = ''; // Clear existing content

//     await displayEventDetails(contentxContainer, eventData, isCreator, isLoggedIn);

//     let contentContainer = createElement('div',{class:"tabs-container"});
//     contentxContainer.appendChild(contentContainer);

//     if (eventData.faqs?.length) {
//         const faqContainer = createElement("section", { class: ["event-section"] });
//         displayEventFAQ(faqContainer, isCreator, eventData.eventId, eventData.faqs);
//         contentContainer.appendChild(faqContainer);
//     }

//     if (eventData.tickets?.length) {
//         const ticketContainer = createElement("section", { class: ["event-section"] });
//         displayTickets(ticketContainer, eventData.tickets, eventData.eventId, isCreator, isLoggedIn);
//         contentContainer.appendChild(ticketContainer);
//     }

//     if (eventData.merch?.length) {
//         const merchContainer = createElement("section", { class: ["event-section"] });
//         displayMerchandise(merchContainer, eventData.merch, eventData.eventId, isCreator, isLoggedIn);
//         contentContainer.appendChild(merchContainer);
//     }

//     if (eventData.schedule?.length) {
//         const scheduleContainer = createElement("section", { class: ["event-section"] });
//         displayEventSchedule(scheduleContainer, isCreator, eventData.schedule);
//         contentContainer.appendChild(scheduleContainer);
//     }

//     if (eventData.livestreamLink) {
//         const liveContainer = createElement("section", { class: ["event-section"] });
//         displayLivestream(liveContainer, eventData.eventId, isLoggedIn);
//         contentContainer.appendChild(liveContainer);
//     }

//     if (eventData.reviews?.length) {
//         const reviewContainer = createElement("section", { class: ["event-section"] });
//         displayEventReviews(reviewContainer, eventData.eventId, isCreator, isLoggedIn);
//         contentContainer.appendChild(reviewContainer);
//     }

//     if (eventData.media?.length) {
//         const mediaContainer = createElement("section", { class: ["event-section"] });
//         displayMedia(mediaContainer, "event", eventData.eventId, isLoggedIn);
//         contentContainer.appendChild(mediaContainer);
//     }

//     if (eventData.lostandfound?.length) {
//         const lostFoundContainer = createElement("section", { class: ["event-section"] });
//         displayLostAndFound(lostFoundContainer, eventData.lostandfound);
//         contentContainer.appendChild(lostFoundContainer);
//     }

//     if (eventData.contactInfo) {
//         const contactContainer = createElement("section", { class: ["event-section"] });
//         displayContactDetails(contactContainer, eventData.contactInfo);
//         contentContainer.appendChild(contactContainer);
//     }
// }


// export { updateEvent, fetchEventData, editEventForm, deleteEvent, displayEvent, displayEventFAQ, displayEventReviews, viewEventAnalytics };