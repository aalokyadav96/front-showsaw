// --- Imports ---
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
import { renderEventByType } from "./renders/renderEvents.js";

// --- Config for Display Fields ---
const fieldConfig = [
    { key: 'title', tag: 'h1', classes: ['event-title'] },
    { key: 'description', label: 'Description', tag: 'p', classes: ['event-description'] },
    { key: 'status', tag: 'p', classes: ['event-status'] },
    { key: 'date', tag: 'p', classes: ['event-date'], formatter: (d) => new Date(d).toLocaleString() },
];

// --- Helper Functions ---

const createDetailItems = (config, data, parent) => {
    config.forEach(({ key, label, tag, classes, formatter }) => {
        let value = data[key];
        if (!value) return;
        if (formatter) value = formatter(value);
        parent.appendChild(createHeading(tag, label ? `${label}: ${value}` : value, classes));
    });
};

const createSocialLinks = (links) => {
    const container = createContainer(['event-social-links']);
    Object.entries(links).forEach(([platform, url]) => {
        container.appendChild(
            createLink({ href: url, children: [platform], classes: ['social-link'] })
        );
    });
    return container;
};

const createTags = (tags) => {
    const container = createContainer(['event-tags']);
    tags.forEach(tag => {
        container.appendChild(
            createElement('span', { class: 'event-tag' }, [`#${tag}`])
        );
    });
    return container;
};

const createCustomFields = (fields) => {
    const container = createContainer(['event-custom-fields']);
    Object.entries(fields).forEach(([field, value]) => {
        container.appendChild(
            createHeading('p', `${field}: ${value}`, ['custom-field'])
        );
    });
    return container;
};

const createActionButtons = (actions) => {
    const container = createContainer(['event-actions']);
    actions.forEach(({ text, onClick, classes = [] }) => {
        container.appendChild(
            createButton({
                text,
                classes: ['action-btn', ...classes],
                events: { click: onClick }
            })
        );
    });
    return container;
};

// --- Main Display Function ---

async function displayEventDetails(content, eventData, isCreator, isLoggedIn) {
    content.innerHTML = '';
    // content.setAttribute("class", getEventColorClass(eventData.category));

    // Main Wrapper
    // const eventWrapper = createContainer(['event-wrapper']);
    // const eventCard = createContainer(['event-card', 'hvflex']);
    // const eventWrapper = createContainer(['event-wrapper', getEventColorClass(eventData.category)]); // ✨ Added auto-color class
    const eventWrapper = createContainer(['event-wrapper']); // ✨ Added auto-color class
    const eventCard = createContainer(['event-card', 'hvflex']);

    // Banner
    const bannerSection = createContainer(['banner-section']);
    const bannerImage = createImage({
        src: `${SRC_URL}/eventpic/banner/${eventData.eventid}.jpg`,
        alt: `Banner for ${eventData.title}`,
        classes: ['event-banner-image'],
    });
    bannerSection.appendChild(bannerImage);

    // Event Info
    const eventInfo = createContainer(['event-info']);
    createDetailItems(fieldConfig, eventData, eventInfo);

    // Place Link
    if (eventData.placename && eventData.placeid) {
        eventInfo.appendChild(
            createElement('p', {}, [
                createElement('strong', {}, [`Place: ${eventData.placename}`]),
                createLink({ href: `/place/${eventData.placeid}`, children: [eventData.placename] })
            ])
        );
    }

    // Optional Sections
    if (eventData.social_links) eventInfo.appendChild(createSocialLinks(eventData.social_links));
    if (eventData.tags?.length) eventInfo.appendChild(createTags(eventData.tags));
    if (eventData.custom_fields) eventInfo.appendChild(createCustomFields(eventData.custom_fields));

    // Action Buttons (for creator)
    if (isLoggedIn && isCreator) {
        const actions = [
            { text: '✏ Edit Event', onClick: () => editEventForm(isLoggedIn, eventData.eventid) },
            { text: '🗑 Delete Event', onClick: () => deleteEvent(isLoggedIn, eventData.eventid), classes: ['delete-btn'] },
            { text: '📊 View Analytics', onClick: () => viewEventAnalytics(isLoggedIn, eventData.eventid), classes: ['analytics-btn'] },
        ];
        eventInfo.appendChild(createActionButtons(actions));
    }

    // Edit Placeholder
    const editContainer = createContainer(['eventedit']);
    editContainer.id = "editevent";
    eventInfo.appendChild(editContainer);

    // Assemble Card
    eventCard.append(bannerSection, eventInfo);
    eventWrapper.appendChild(eventCard);

    const evtypeContainer = createContainer(['evtype']);
    console.log(eventData.category, evtypeContainer, isCreator);
    renderEventByType(eventData.category, eventData, evtypeContainer, isCreator);
    eventWrapper.appendChild(evtypeContainer);

    // Final Append
    content.appendChild(eventWrapper);
}

// --- New: Event Color Helper ---
const getEventColorClass = (eventType = '') => {
    const type = eventType.toLowerCase();
    switch (type) {
        case 'concert': return 'color-concert';
        case 'workshop': return 'color-workshop';
        case 'sports': return 'color-sports';
        case 'meetup': return 'color-meetup';
        case 'festival': return 'color-festival';
        default: return 'color-default'; // fallback
    }
};

export { displayEventDetails };

// // --- Imports ---
// import { SRC_URL } from "../../state/state.js";
// import {
//     createButton,
//     createHeading,
//     createContainer,
//     createImage,
//     createLink
// } from "../../components/eventHelper.js";
// import { createElement } from "../../components/createElement.js";
// import { editEventForm } from "./editEvent.js";
// import { deleteEvent, viewEventAnalytics } from "./eventService.js";

// // --- Helper Functions ---

// const createDetailItems = (details, parent) => {
//     details.forEach(({ tag, text, classes }) => {
//         if (text) parent.appendChild(createHeading(tag, text, classes));
//     });
// };

// const createSocialLinks = (links) => {
//     const container = createContainer(['event-social-links']);
//     Object.entries(links).forEach(([platform, url]) => {
//         container.appendChild(
//             createLink({ href: url, children: [platform], classes: ['social-link'] })
//         );
//     });
//     return container;
// };

// const createTags = (tags) => {
//     const container = createContainer(['event-tags']);
//     tags.forEach(tag => {
//         container.appendChild(
//             createElement('span', { class: 'event-tag' }, [`#${tag}`])
//         );
//     });
//     return container;
// };

// const createCustomFields = (fields) => {
//     const container = createContainer(['event-custom-fields']);
//     Object.entries(fields).forEach(([field, value]) => {
//         container.appendChild(
//             createHeading('p', `${field}: ${value}`, ['custom-field'])
//         );
//     });
//     return container;
// };

// const createActionButtons = (actions) => {
//     const container = createContainer(['event-actions']);
//     actions.forEach(({ text, onClick, classes = [] }) => {
//         container.appendChild(
//             createButton({
//                 text,
//                 classes: ['action-btn', ...classes],
//                 events: { click: onClick }
//             })
//         );
//     });
//     return container;
// };

// // --- Main Display Function ---

// async function displayEventDetails(content, eventData, isCreator, isLoggedIn) {
//     content.innerHTML = '';

//     // Main Wrapper
//     const eventWrapper = createContainer(['event-wrapper']);
//     const eventCard = createContainer(['event-card', 'hvflex']);

//     // Banner
//     const bannerSection = createContainer(['banner-section']);
//     const bannerImage = createImage({
//         src: `${SRC_URL}/eventpic/banner/${eventData.eventid}.jpg`,
//         alt: `Banner for ${eventData.title}`,
//         classes: ['event-banner-image'],
//     });
//     bannerSection.appendChild(bannerImage);

//     // Event Info
//     const eventInfo = createContainer(['event-info']);
//     createDetailItems([
//         { tag: 'h1', text: eventData.title, classes: ['event-title'] },
//         { tag: 'p', text: `Description: ${eventData.description}`, classes: ['event-description'] },
//         { tag: 'p', text: eventData.status, classes: ['event-status'] },
//         { tag: 'p', text: eventData.date ? new Date(eventData.date).toLocaleString() : '', classes: ['event-date'] },
//     ], eventInfo);

//     // Place Link
//     eventInfo.appendChild(
//         createElement('p', {}, [
//             createElement('strong', {}, [`Place: ${eventData.placename}`]),
//             createLink({ href: `/place/${eventData.placeid}`, children: [eventData.placename] })
//         ])
//     );

//     // Optional Sections
//     if (eventData.social_links) eventInfo.appendChild(createSocialLinks(eventData.social_links));
//     if (eventData.tags?.length) eventInfo.appendChild(createTags(eventData.tags));
//     if (eventData.custom_fields) eventInfo.appendChild(createCustomFields(eventData.custom_fields));

//     // Assemble Card
//     eventCard.append(bannerSection, eventInfo);
//     eventWrapper.appendChild(eventCard);

//     // Action Buttons (for creator)
//     if (isLoggedIn && isCreator) {
//         const actions = [
//             { text: '✏ Edit Event', onClick: () => editEventForm(isLoggedIn, eventData.eventid) },
//             { text: '🗑 Delete Event', onClick: () => deleteEvent(isLoggedIn, eventData.eventid), classes: ['delete-btn'] },
//             { text: '📊 View Analytics', onClick: () => viewEventAnalytics(isLoggedIn, eventData.eventid), classes: ['analytics-btn'] },
//         ];
//         eventWrapper.appendChild(createActionButtons(actions));
//     }

//     // Edit Placeholder
//     const editContainer = createContainer(['eventedit']);
//     editContainer.id = "editevent";
//     eventWrapper.appendChild(editContainer);

//     // Final Append
//     content.appendChild(eventWrapper);
// }

// export { displayEventDetails };

// // import { SRC_URL } from "../../state/state.js";
// // import {
// //     createButton,
// //     createHeading,
// //     createContainer,
// //     createImage,
// //     createLink
// // } from "../../components/eventHelper.js";
// // import { createElement } from "../../components/createElement.js";
// // import { editEventForm } from "./editEvent.js";
// // import { deleteEvent, viewEventAnalytics } from "./eventService.js";
// // // import { displayEventVenue } from "./eventTabs.js";

// // async function displayEventDetails(content, eventData, isCreator, isLoggedIn) {
// //     content.innerHTML = '';

// //     // Main Event Wrapper
// //     const eventWrapper = createContainer(['event-wrapper']);

// //     // Event Card Section
// //     const eventCard = createContainer(['event-card', 'hvflex']);

// //     // Banner Section
// //     const bannerSection = createContainer(['banner-section']);
// //     const bannerImage = createImage({
// //         src: `${SRC_URL}/eventpic/banner/${eventData.eventid}.jpg`,
// //         alt: `Banner for ${eventData.title}`,
// //         classes: ['event-banner-image'],
// //     });
// //     bannerSection.appendChild(bannerImage);

// //     // Event Info Section
// //     const eventInfo = createContainer(['event-info']);
// //     const details = [
// //         { tag: 'h1', text: eventData.title, classes: ['event-title'] },
// //         { tag: 'p', text: `Description: ${eventData.description}`, classes: ['event-description'] },
// //         { tag: 'p', text: eventData.status, classes: ['event-status'] },
// //         { tag: 'p', text: eventData.date ? new Date(eventData.date).toLocaleString() : '', classes: ['event-date'] },
// //     ];
// //     details.forEach(({ tag, text, classes }) => {
// //         if (text) eventInfo.appendChild(createHeading(tag, text, classes));
// //     });

// //     // Place Link
// //     eventInfo.appendChild(
// //         createElement('p', {}, [
// //             createElement('strong', {}, [`Place: ${eventData.placename}`]),
// //             createLink({ href: `/place/${eventData.placeid}`, children: [eventData.placename] })
// //         ])
// //     );

// //     // // Seating Plan
// //     // if (eventData.seatingplan) {
// //     //     eventInfo.appendChild(
// //     //         createImage({
// //     //             src: `${SRC_URL}/seating/${eventData.eventid}.jpg`,
// //     //             alt: "Seating Plan",
// //     //             classes: ['img']
// //     //         })
// //     //     );
// //     // }

// //     // Social Links
// //     if (eventData.social_links) {
// //         const socialLinks = createContainer(['event-social-links']);
// //         Object.entries(eventData.social_links).forEach(([platform, url]) => {
// //             socialLinks.appendChild(
// //                 createLink({
// //                     href: url,
// //                     children: [platform],
// //                     classes: ['social-link']
// //                 })
// //             );
// //         });
// //         eventInfo.appendChild(socialLinks);
// //     }

// //     // Tags
// //     if (eventData.tags?.length) {
// //         const tagsContainer = createContainer(['event-tags']);
// //         eventData.tags.forEach(tag => {
// //             tagsContainer.appendChild(
// //                 createElement('span', { class: 'event-tag' }, [`#${tag}`])
// //             );
// //         });
// //         eventInfo.appendChild(tagsContainer);
// //     }

// //     // Custom Fields
// //     if (eventData.custom_fields) {
// //         const customFieldsContainer = createContainer(['event-custom-fields']);
// //         Object.entries(eventData.custom_fields).forEach(([field, value]) => {
// //             customFieldsContainer.appendChild(
// //                 createHeading('p', `${field}: ${value}`, ['custom-field'])
// //             );
// //         });
// //         eventInfo.appendChild(customFieldsContainer);
// //     }

// //     // Ticket Verification Placeholder
// //     // if (eventData.tickets) {
// //     //     eventInfo.appendChild(createButton({
// //     //         text: "Verify Your Ticket",
// //     //         classes: ["button"],
// //     //         events: { click: () => alert("hi") }
// //     //     }));
// //     // }

// //     // Compose the card
// //     eventWrapper.appendChild(eventCard);
// //     eventCard.append(bannerSection, eventInfo);

// //     // Event Action Buttons
// //     if (isLoggedIn && isCreator) {
// //         const eventActions = createContainer(['event-actions']);
// //         const actions = [
// //             { text: '✏ Edit Event', onClick: () => editEventForm(isLoggedIn, eventData.eventid) },
// //             { text: '🗑 Delete Event', onClick: () => deleteEvent(isLoggedIn, eventData.eventid), classes: ['delete-btn'] },
// //             { text: '📊 View Analytics', onClick: () => viewEventAnalytics(isLoggedIn, eventData.eventid), classes: ['analytics-btn'] },
// //         ];
// //         actions.forEach(({ text, onClick, classes = [] }) => {
// //             eventActions.appendChild(
// //                 createButton({
// //                     text,
// //                     classes: ['action-btn', ...classes],
// //                     events: { click: onClick }
// //                 })
// //             );
// //         });
// //         eventWrapper.appendChild(eventActions);
// //     }

// //     // Append edit placeholder container
// //     const editContainer = createContainer(['eventedit']);
// //     editContainer.id = "editevent";
// //     eventWrapper.appendChild(editContainer);

// //     // Final Append
// //     content.appendChild(eventWrapper);

// //     // if (eventData.seatingplan) {
// //     //     // Venue Details
// //     //     const eventVenue = createContainer(['event-venue', 'tabs-container']);
// //     //     // await displayEventVenue(eventVenue, isLoggedIn, `${SRC_URL}/eventpic/seating/${eventData.seatingplan}`);
// //     //     await displayEventVenue(eventVenue, isLoggedIn, eventData.eventid);
// //     //     // content.appendChild(eventVenue);

// //     //     content.appendChild(eventVenue);
// //     // }
// // }

// // export { displayEventDetails };
