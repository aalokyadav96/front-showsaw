import { SRC_URL } from "../../state/state.js";
import { createButton, createHeading, createContainer, createImage, createLink } from "../../components/eventHelper.js";
import { createElement } from "../../components/createElement.js";
import { editEventForm } from "./editEvent.js";
import { deleteEvent } from "./eventService.js";
import { displayEventVenue } from "./eventTabs.js";

async function displayEventDetails(content, eventData, isCreator, isLoggedIn) {
    content.innerHTML = '';

    // Main Event Container
    const eventWrapper = createContainer(['event-wrapper']);

    // Event Card (Holds Banner & Details)
    const eventCard = createContainer(['event-card']);

    // Event Banner Section
    const bannerSection = createContainer(['banner-section']);
    const bannerImage = createImage({
        src: `${SRC_URL}/eventpic/${eventData.banner_image}`,
        alt: `Banner for ${eventData.title}`,
        classes: ['event-banner-image'],
    });
    bannerSection.appendChild(bannerImage);

    // Event Details Section
    const eventInfo = createContainer(['event-info']);
    if (eventData.title) { eventInfo.appendChild(createHeading('h1', eventData.title, ['event-title'])); }
    if (eventData.description) { eventInfo.appendChild(createHeading('p', `Description: ${eventData.description}`, ['event-description'])); }
    if (eventData.place) { eventInfo.appendChild(createHeading('p', `Place:  ${eventData.place}`, ['event-place'])); }
    if (eventData.status) { eventInfo.appendChild(createHeading('p', eventData.status, ['event-status'])); }
    eventInfo.appendChild(createHeading('p', `📅 ${new Date(eventData.start_date_time).toLocaleString()} - ${new Date(eventData.end_date_time).toLocaleString()}`, ['event-dates']));

    // Social Links
    if (eventData.social_links) {
        const socialLinks = createContainer(['event-social-links']);
        Object.entries(eventData.social_links || {}).forEach(([platform, url]) => {
            const link = createLink({ href: url, textContent: platform, classes: ['social-link'] });
            socialLinks.appendChild(link);
        });
        eventInfo.appendChild(socialLinks);
    }

    // Tags
    if (eventData.tags) {
        const tags = createContainer(['event-tags']);
        eventData.tags.forEach((tag) => {
            const tagElement = createElement('span', { textContent: `#${tag}`, classes: ['event-tag'] });
            tags.appendChild(tagElement);
        });
        eventInfo.appendChild(tags);
    }

    // Custom Fields
    const customFields = createContainer(['event-custom-fields']);
    Object.entries(eventData.custom_fields || {}).forEach(([field, value]) => {
        const fieldElement = createHeading('p', `${field}: ${value}`, ['custom-field']);
        customFields.appendChild(fieldElement);
    });
    eventInfo.appendChild(customFields);

    // Append banner and event info
    eventCard.appendChild(bannerSection);
    eventCard.appendChild(eventInfo);

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

    const eventVenue = createContainer(['event-venue','event-card']);
    displayEventVenue(eventVenue, eventData.place, isLoggedIn);

    eventWrapper.appendChild(eventCard);
    eventWrapper.appendChild(eventVenue);
    eventWrapper.appendChild(createContainer(['eventedit'   ], 'editevent'));
    content.appendChild(eventWrapper);
}

export { displayEventDetails };
