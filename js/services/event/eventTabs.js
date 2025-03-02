import { Button } from "../../components/base/Button.js";
import { createElement } from "../../components/createElement.js";
import {displayReviews} from "../reviews/displayReviews.js";
import { displayEventFAQs } from "./eventFAQHelper.js";

async function displayEventReviews(reviewsContainer, eventId, isCreator, isLoggedIn) {
    displayReviews(reviewsContainer, isCreator, isLoggedIn, "event", eventId);
}

async function displayEventVenue(venueList, place, isLoggedIn) {
    // const venueList = document.getElementById("venue-details");
    venueList.innerHTML = ''; // Clear existing content

    const listItem = createElement('div');
    listItem.innerHTML = `<p>Place: ${place}</p><br>`;
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

async function displayEventFAQ(faqContainer, isCreator, eventId, faqs) {
    displayEventFAQs(isCreator, faqContainer, eventId, faqs);
}


export { displayEventVenue, displayEventTimeline, displayEventFAQ, displayEventReviews };