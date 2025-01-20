import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import {displayReviews} from "../reviews/displayReviews.js";
import { displayEventFAQs } from "./eventFAQHelper.js";

async function displayEventReviews(eventId, isCreator, isLoggedIn, reviewsContainer) {
    displayReviews(isCreator, isLoggedIn, reviewsContainer, "event", eventId);
}

async function displayEventVenue(place, accessibility_info, isLoggedIn, venueList) {
    // const venueList = document.getElementById("venue-details");
    venueList.innerHTML = ''; // Clear existing content

    const listItem = createElement('div');
    listItem.innerHTML = `<p>Place: ${place}</p><br><p class='event-accessibility'>Accessibility: ${accessibility_info}</p>`;
    venueList.appendChild(listItem);
}

async function displayEventTimeline(isCreator, isLoggedIn, timeline) {
    // const timeline = document.getElementById("time-line");
    timeline.innerHTML = ''; // Clear existing content

    if (isCreator) {
        const button = Button("Add Timeline", "add-timeline-btn", {
            click: () => alert("Button clicked!"),
            mouseenter: () => console.log("Button hovered"),
        });

        timeline.appendChild(button);
    }

    // if (isCreator) {
    //     const addButton = createElement('button', {
    //         textContent: "Add Timeline",
    //         id: "add-timeline-btn",
    //         classes: ['btn'],
    //         events: {
    //             click: () => alert("Button clicked!"),
    //             mouseenter: () => console.log("Button hovered"),
    //         },
    //     });
    //     timeline.appendChild(addButton);
    // }

    const events = [
        { time: '10:00 AM', description: 'Opening Ceremony' },
        { time: '12:00 PM', description: 'Keynote Speech' },
        { time: '2:00 PM', description: 'Workshops' },
    ];

    const timelineList = createElement('ul', { class: ['timeline-list'] });
    events.forEach((eventx) => {
        const listItem = createElement('li', {
            class: ['timeline-item'],
        },[`${eventx.time} - ${eventx.description}`]);
        timelineList.appendChild(listItem);
    });
    console.log(events);
    timeline.appendChild(timelineList);
}

async function displayEventFAQ(isCreator, faqContainer, eventId, faqs) {
    displayEventFAQs(isCreator, faqContainer, eventId, faqs);
}

// async function displayEventFAQ(isCreator, faqContainer) {
//     // const faqContainer = document.getElementById("event-faq");
//     faqContainer.innerHTML = ''; // Clear existing content

//         if (isCreator) {
//         const button = Button("Add FAQs", "add-faq-btn", {
//             click: () => alert("Button clicked!"),
//             mouseenter: () => console.log("Button hovered"),
//         });
//         faqContainer.appendChild(button);
//     }

//     const sections = [
//         { title: 'What is this event?', content: 'This is an example event.' },
//         { title: 'How to register?', content: 'You can register through the registration form.' },
//         { title: 'What is the refund policy?', content: 'Refunds are not available.' },
//     ];

//     sections.forEach(({ title, content }) => {
//         const faqItem = createElement('div', { classes: ['faq-item'] });
//         const faqTitle = createElement('h3', { textContent: title, classes: ['faq-title'] });
//         const faqContent = createElement('p', { textContent: content, classes: ['faq-content'] });

//         faqItem.appendChild(faqTitle);
//         faqItem.appendChild(faqContent);
//         faqContainer.appendChild(faqItem);
//     });
// }

function getTabs(eventData) {
    const tabs = [
        { title: 'Tickets', id: 'ticket-list' },
        { title: 'Venue Details', id: 'venue-details' },
        { title: 'Merchandise', id: 'merch-list' },
        { title: 'Media', id: 'media-list' },
    ];

    if (eventData.reviews != null) {
        tabs.push({ title: 'Reviews', id: 'event-reviews' });
    }
    if (eventData.timeline != null) {
        tabs.push({ title: 'Event Timeline', id: 'time-line' });
    }
    if (eventData.faq != null) {
        tabs.push({ title: 'FAQ', id: 'event-faq' });
    }

    return tabs.map(tab => ({
        ...tab,
        content: createElement('div', { id: tab.id, classes: ['tab-content'] }),
    }));
}

export { displayEventVenue, displayEventTimeline, displayEventFAQ, displayEventReviews, getTabs };