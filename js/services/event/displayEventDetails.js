import { SRC_URL } from "../../state/state.js";
import {
    createButton,
    createHeading,
    createContainer,
    createImage,
    createLink
} from "../../components/eventHelper.js";
import { createElement } from "../../components/createElement.js";
import { editEventForm } from "./editEvent.js";
import { deleteEvent } from "./eventService.js";
// import { displayEventVenue } from "./eventTabs.js";
// import CountDown from "../../components/ui/Countdown.mjs";

async function displayEventDetails(content, eventData, isCreator, isLoggedIn) {
    content.innerHTML = '';

    // Main Event Wrapper
    const eventWrapper = createContainer(['event-wrapper']);

    // Create Event Card
    const eventCard = createContainer(['event-card', 'hvflex']);

    // Event Banner
    const bannerSection = createContainer(['banner-section']);
    const bannerImage = createImage({
        src: `${SRC_URL}/eventpic/${eventData.banner_image}`,
        alt: `Banner for ${eventData.title}`,
        classes: ['event-banner-image'],
    });
    bannerSection.appendChild(bannerImage);

    // Event Details
    const eventInfo = createContainer(['event-info']);

    const details = [
        { tag: 'h1', text: eventData.title, classes: ['event-title'] },
        { tag: 'p', text: `Description: ${eventData.description}`, classes: ['event-description'] },
        { tag: 'strong', text: `Place: ${eventData.place}`, classes: ['event-place'] },
        { tag: 'p', text: eventData.status, classes: ['event-status'] },
        { tag: 'p', text: eventData.date ? new Date(eventData.date).toLocaleString() : '', classes: ['event-date'] },
    ];

    details.forEach(({ tag, text, classes }) => {
        if (text) eventInfo.appendChild(createHeading(tag, text, classes));
    });

    if (eventData.seatingplan) { eventInfo.appendChild(createImage({ src: "", alt: "Seating Plan", classes: ['img'] })) };

    // Social Links
    if (eventData.social_links) {
        const socialLinks = createContainer(['event-social-links']);
        Object.entries(eventData.social_links).forEach(([platform, url]) => {
            socialLinks.appendChild(createLink({ href: url, textContent: platform, classes: ['social-link'] }));
        });
        eventInfo.appendChild(socialLinks);
    }

    // Tags
    if (eventData.tags?.length) {
        const tagsContainer = createContainer(['event-tags']);
        eventData.tags.forEach(tag => {
            tagsContainer.appendChild(createElement('span', { textContent: `#${tag}`, classes: ['event-tag'] }));
        });
        eventInfo.appendChild(tagsContainer);
    }

    // Custom Fields
    if (eventData.custom_fields) {
        const customFieldsContainer = createContainer(['event-custom-fields']);
        Object.entries(eventData.custom_fields).forEach(([field, value]) => {
            customFieldsContainer.appendChild(createHeading('p', `${field}: ${value}`, ['custom-field']));
        });
        eventInfo.appendChild(customFieldsContainer);
    }

    // if (eventData.tickets) {
    //     eventInfo.appendChild(createButton({
    //         text: "Verify Your Ticket", classes: ["button"], events: {click: () => {
    //             alert("hi");
    //         }}
    //     }))
    // };

    // Append banner and event details
    eventCard.append(bannerSection, eventInfo);
    eventWrapper.appendChild(eventCard);

    // Event Actions (Edit/Delete)
    if (isLoggedIn && isCreator) {
        const eventActions = createContainer(['event-actions']);
        const actions = [
            { text: '✏ Edit Event', onClick: () => editEventForm(isLoggedIn, eventData.eventid) },
            { text: '🗑 Delete Event', onClick: () => deleteEvent(isLoggedIn, eventData.eventid), classes: ['delete-btn'] },
        ];
        actions.forEach(({ text, onClick, classes = [] }) => {
            eventActions.appendChild(createButton({
                text,
                classes: ['action-btn', ...classes],
                events: { click: onClick },
            }));
        });
        eventWrapper.appendChild(eventActions);
    }

    // Additional Sections (e.g., Venue)
    // const eventVenue = createContainer(['event-venue']);
    // displayEventVenue(eventVenue, eventData.place, eventData.eventid, isLoggedIn);
    // eventWrapper.appendChild(eventVenue);

    // Append Edit Event Container
    eventWrapper.appendChild(createContainer(['eventedit'], 'editevent'));

    // Append Everything to Content
    content.appendChild(eventWrapper);
}

export { displayEventDetails };
