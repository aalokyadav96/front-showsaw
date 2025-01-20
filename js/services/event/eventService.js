import { SRC_URL, state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import { displayTickets } from "../tickets/ticketService.js";
import { displayMedia } from "../media/mediaService.js";
import { displayMerchandise } from "../merch/merchService.js";
import { navigate } from "../../routes/index.js";
import SnackBar from '../../components/ui/Snackbar.mjs';
import { createButton, createHeading, createContainer, createImage } from "./eventHelper.js";
import { displayEventVenue, displayEventTimeline, displayEventFAQ, displayEventReviews } from "./eventTabs.js";
import { createElement } from "../../components/createElement.js";
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

        // Tabs Section
        const tabContainer = createContainer(['event-tabs']);
        const tabButtons = createContainer(['tab-buttons']);
        const tabContents = createContainer(['tab-contents']);

        // Tab content containers
        const tabcon = [
            createElement("div", { id: "ticket-list", classes: ["ticket-list"] }),
            createElement("div", { id: "venue-list", classes: ["venue-list"] }),
            createElement("div", { id: "merch-list", classes: ["merch-list"] }),
            createElement("div", { id: "media-list", classes: ["media-list"] }),
            createElement("div", { id: "reviews-container", classes: ["reviews-container"] }),
            createElement("div", { id: "faq-container", classes: ["faq-container"] }),
        ];

        const tabs = [
            { title: 'Tickets', id: 'tickets-tab', render: () => displayTickets(eventData.tickets, eventId, isCreator, isLoggedIn, tabcon[0]) },
            { title: 'Venue', id: 'venue-tab', render: () => displayEventVenue(eventData.place, eventData.accessibility_info, isLoggedIn, tabcon[1]) },
            { title: 'Merchandise', id: 'merch-tab', render: () => displayMerchandise(eventData.merch, eventId, isCreator, isLoggedIn, tabcon[2]) },
            { title: 'Media', id: 'media-tab', render: () => displayMedia('event', eventId, isLoggedIn, tabcon[3]) },
            { title: 'Reviews', id: 'reviews-tab', render: () => displayEventReviews(eventId, isCreator, isLoggedIn, tabcon[4]) },
            { title: 'FAQ', id: 'faq-tab', render: () => displayEventFAQ(isCreator, tabcon[5], eventId, eventData.faqs) },
        ];
        
        tabs.forEach(({ title, id, render }, index) => {
            const tabButton = createButton({
                text: title,
                classes: ['tab-button'],
                events: { click: () => activateTab(id, render, tabcon[index]) },
            });
            tabButtons.appendChild(tabButton);

            const tabContent = createContainer(['tab-content'], id, 'article');
            tabContents.appendChild(tabContent);
        });

        tabContainer.appendChild(tabButtons);
        tabContainer.appendChild(tabContents);

        const eventDetails = createContainer(['event-details']);
        eventDetails.appendChild(tabContainer);
        contentContainer.appendChild(eventDetails);

        // Activate the first tab by default
        activateTab(tabs[0].id, tabs[0].render, tabcon[0]);

        function activateTab(tabId, renderContent, tabcon) {
            document.querySelectorAll('.tab-button').forEach((btn, index) => {
                btn.classList.toggle('active', tabs[index].id === tabId);
            });

            document.querySelectorAll('.tab-content').forEach((content) => {
                content.classList.toggle('active', content.id === tabId);
            });

            const activeTabContent = document.querySelector(`#${tabId}`);
            if (activeTabContent && !activeTabContent.contains(tabcon)) {
                activeTabContent.innerHTML = '';
                activeTabContent.appendChild(tabcon);
            }

            if (tabcon && !tabcon.innerHTML.trim()) {
                renderContent(tabcon);
            }

            history.pushState({ eventId, tabId }, '', `/event/${eventId}#${tabId}`);
        }
    } catch (error) {
        contentContainer.innerHTML = '';
        contentContainer.appendChild(createElement('h1', { textContent: `Error loading event details: ${error.message}` }));
        SnackBar("Failed to load event details. Please try again later.", 3000);
    }
}

async function displayEventDetails(content, eventData, isCreator, isLoggedIn) {
    content.innerHTML = '';

    const eventDetails = createContainer(['event-details']);
    const eventHeader = createContainer(['event-header']);

    const eventBanner = createContainer(['event-banner']);
    const bannerImage = createImage({
        src: `${SRC_URL}/eventpic/${eventData.banner_image}`,
        alt: `Banner for ${eventData.title}`,
        classes: ['event-banner-image'],
    });
    eventBanner.appendChild(bannerImage);

    const eventInfo = createContainer(['event-info']);
    eventInfo.appendChild(createHeading('h1', eventData.title, ['event-title']));
    eventInfo.appendChild(createHeading('p', `Date: ${new Date(eventData.start_date_time).toLocaleString()} - ${new Date(eventData.end_date_time).toLocaleString()}`, ['event-dates']));
    // eventInfo.appendChild(createHeading('p', `Organizer: ${eventData.organizer_name} (${eventData.organizer_contact})`, ['event-organizer']));
    // eventInfo.appendChild(createHeading('p', `Category: ${eventData.category}`, ['event-category']));
    eventInfo.appendChild(createHeading('p', eventData.description, ['event-description']));


    const socialLinks = createContainer(['event-social-links']);
    Object.entries(eventData.social_links || {}).forEach(([platform, url]) => {
        const link = createLink({ href: url, textContent: platform, classes: ['social-link'] });
        socialLinks.appendChild(link);
    });
    eventInfo.appendChild(socialLinks);

    if (eventData.tags) {
        const tags = createContainer(['event-tags']);
        eventData.tags.forEach((tag) => {
            const tagElement = createElement('span', { textContent: tag, classes: ['event-tag'] });
            tags.appendChild(tagElement);
        });
        eventInfo.appendChild(tags);
    }

    const customFields = createContainer(['event-custom-fields']);
    Object.entries(eventData.custom_fields || {}).forEach(([field, value]) => {
        const fieldElement = createHeading('p', `${field}: ${value}`, ['custom-field']);
        customFields.appendChild(fieldElement);
    });
    eventInfo.appendChild(customFields);

    eventHeader.appendChild(eventBanner);
    eventHeader.appendChild(eventInfo);

    // eventDetails.appendChild(eventHeader);
    content.appendChild(eventHeader);
    content.appendChild(eventDetails);
    
    if (isLoggedIn && isCreator) {
        const eventActions = createContainer(['event-actions']);
        const actions = [
            { text: 'Edit Event', onClick: () => editEventForm(isLoggedIn, eventData.eventid) },
            { text: 'Delete Event', onClick: () => deleteEvent(isLoggedIn, eventData.eventid), classes: ['delete-btn'] },
        ];
        actions.forEach(({ text, onClick, classes = [] }) => {
            eventActions.appendChild(createButton({
                text,
                classes: ['action-btn', ...classes],
                events: { click: onClick },
            }));
        });
        eventDetails.appendChild(eventActions);
    }

    eventDetails.appendChild(createContainer(['eventedit'],'editevent'));
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

export { updateEvent, fetchEventData, editEventForm, deleteEvent, displayEvent, displayEventVenue, displayEventTimeline, displayEventFAQ, displayEventReviews };