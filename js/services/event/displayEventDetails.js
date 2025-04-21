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
import { deleteEvent, viewEventAnalytics } from "./eventService.js";
import { displayEventVenue } from "./eventTabs.js";

async function displayEventDetails(content, eventData, isCreator, isLoggedIn) {
    content.innerHTML = '';

    // Main Event Wrapper
    const eventWrapper = createContainer(['event-wrapper']);

    // Event Card Section
    const eventCard = createContainer(['event-card', 'hvflex']);

    // Banner Section
    const bannerSection = createContainer(['banner-section']);
    const bannerImage = createImage({
        src: `${SRC_URL}/eventpic/banner/${eventData.eventid}.jpg`,
        alt: `Banner for ${eventData.title}`,
        classes: ['event-banner-image'],
    });
    bannerSection.appendChild(bannerImage);

    // Event Info Section
    const eventInfo = createContainer(['event-info']);
    const details = [
        { tag: 'h1', text: eventData.title, classes: ['event-title'] },
        { tag: 'p', text: `Description: ${eventData.description}`, classes: ['event-description'] },
        { tag: 'p', text: eventData.status, classes: ['event-status'] },
        { tag: 'p', text: eventData.date ? new Date(eventData.date).toLocaleString() : '', classes: ['event-date'] },
    ];
    details.forEach(({ tag, text, classes }) => {
        if (text) eventInfo.appendChild(createHeading(tag, text, classes));
    });

    // Place Link
    eventInfo.appendChild(
        createElement('p', {}, [
            createElement('strong', {}, [`Place: ${eventData.placename}`]),
            createLink({ href: `/place/${eventData.placeid}`, children: [eventData.placename] })
        ])
    );

    // // Seating Plan
    // if (eventData.seatingplan) {
    //     eventInfo.appendChild(
    //         createImage({
    //             src: `${SRC_URL}/seating/${eventData.eventid}.jpg`,
    //             alt: "Seating Plan",
    //             classes: ['img']
    //         })
    //     );
    // }

    // Social Links
    if (eventData.social_links) {
        const socialLinks = createContainer(['event-social-links']);
        Object.entries(eventData.social_links).forEach(([platform, url]) => {
            socialLinks.appendChild(
                createLink({
                    href: url,
                    children: [platform],
                    classes: ['social-link']
                })
            );
        });
        eventInfo.appendChild(socialLinks);
    }

    // Tags
    if (eventData.tags?.length) {
        const tagsContainer = createContainer(['event-tags']);
        eventData.tags.forEach(tag => {
            tagsContainer.appendChild(
                createElement('span', { class: 'event-tag' }, [`#${tag}`])
            );
        });
        eventInfo.appendChild(tagsContainer);
    }

    // Custom Fields
    if (eventData.custom_fields) {
        const customFieldsContainer = createContainer(['event-custom-fields']);
        Object.entries(eventData.custom_fields).forEach(([field, value]) => {
            customFieldsContainer.appendChild(
                createHeading('p', `${field}: ${value}`, ['custom-field'])
            );
        });
        eventInfo.appendChild(customFieldsContainer);
    }

    // Ticket Verification Placeholder
    // if (eventData.tickets) {
    //     eventInfo.appendChild(createButton({
    //         text: "Verify Your Ticket",
    //         classes: ["button"],
    //         events: { click: () => alert("hi") }
    //     }));
    // }

    // Compose the card
    eventWrapper.appendChild(eventCard);
    eventCard.append(bannerSection, eventInfo);

    // Event Action Buttons
    if (isLoggedIn && isCreator) {
        const eventActions = createContainer(['event-actions']);
        const actions = [
            { text: '✏ Edit Event', onClick: () => editEventForm(isLoggedIn, eventData.eventid) },
            { text: '🗑 Delete Event', onClick: () => deleteEvent(isLoggedIn, eventData.eventid), classes: ['delete-btn'] },
            { text: '📊 View Analytics', onClick: () => viewEventAnalytics(isLoggedIn, eventData.eventid), classes: ['analytics-btn'] },
        ];
        actions.forEach(({ text, onClick, classes = [] }) => {
            eventActions.appendChild(
                createButton({
                    text,
                    classes: ['action-btn', ...classes],
                    events: { click: onClick }
                })
            );
        });
        eventWrapper.appendChild(eventActions);
    }

    // Append edit placeholder container
    const editContainer = createContainer(['eventedit']);
    editContainer.id = "editevent";
    eventWrapper.appendChild(editContainer);

    // Final Append
    content.appendChild(eventWrapper);

    if (eventData.seatingplan) {
        // Venue Details
        const eventVenue = createContainer(['event-venue', 'tabs-container']);
        // await displayEventVenue(eventVenue, isLoggedIn, `${SRC_URL}/eventpic/seating/${eventData.seatingplan}`);
        await displayEventVenue(eventVenue, isLoggedIn, eventData.eventid);
        // content.appendChild(eventVenue);

        content.appendChild(eventVenue);
    }
}

export { displayEventDetails };
