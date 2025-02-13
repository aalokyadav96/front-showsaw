import { SRC_URL } from "../../state/state.js";
import { createButton, createHeading, createContainer, createImage } from "./eventHelper.js";
import { createElement } from "../../components/createElement.js";
import { editEventForm } from "./editEvent.js";

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

export {displayEventDetails};