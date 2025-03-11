// import { Button } from "../../components/base/Button.js";
import { API_URL } from "../../api/api.js";
import { createElement } from "../../components/createElement.js";
import { displayReviews } from "../reviews/displayReviews.js";
import { displayEventFAQs } from "./eventFAQHelper.js";
// import { displaySeatingMap } from "./seatingMap.js";
import EventTimeline from "../../components/ui/EventTimeline.mjs";


async function displayEventReviews(reviewsContainer, eventId, isCreator, isLoggedIn) {
    displayReviews(reviewsContainer, isCreator, isLoggedIn, "event", eventId);
}

async function displayEventVenue(venueList, eventid, isLoggedIn) {
    // displaySeatingMap(venueList, place, eventid, isLoggedIn);

    // const venueList = document.getElementById("venue-details");
    venueList.innerHTML = ''; // Clear existing content

    const listItem = createElement('div');
    listItem.className = "event-card";
    // listItem.innerHTML = `<p>Place: ${place}</p><br>`;

    // const itemimg = createElement('img');
    // itemimg.src = `${SRC_URL}/eventpic/${eventid}seating.jpg`;
    // const itemplace = createElement('p');
    // itemplace.innerHTML = `<p>Place: ${place}</p><br>`;

    // listItem.append(itemimg);

    venueList.appendChild(listItem);
}

async function displayEventFAQ(faqContainer, isCreator, eventId, faqs) {
    displayEventFAQs(isCreator, faqContainer, eventId, faqs);
}

async function displayLostAndFound(lnfContainer, isCreator, eventId, lnfs) {
    lnfContainer.innerHTML="Did anyone lost anything?";
}

async function displayContactDetails(container, isCreator, contacts) {
    container.innerHTML="Does anybody need anything?";
}

async function displayEventSchedule(faqContainer, isCreator, eventId, faqs) {
    const events = [
        { time: '09:00 AM', description: 'Doors Open & Registration' },
        { time: '10:00 AM', description: 'Opening Ceremony' },
        { time: '10:30 AM', description: 'Guest Speaker: The Future of Tech' },
        { time: '11:15 AM', description: 'Panel Discussion: Innovations & AI' },
        { time: '12:00 PM', description: 'Networking & Lunch Break' },
        { time: '01:30 PM', description: 'Workshops: Choose Your Track' },
        { time: '03:00 PM', description: 'Startup Pitch Competition' },
        { time: '04:30 PM', description: 'Closing Remarks & Awards' },
        { time: '05:00 PM', description: 'After-Party & Networking' }
    ];

    faqContainer.appendChild(EventTimeline(events));
}


async function displayLivestream(divcontainer, eventId, isLoggedIn) {
    displayEventLiveStream(divcontainer, eventId, isLoggedIn);
}

async function displayEventLiveStream(divcontainer, eventId, isLoggedIn) {
    if (!isLoggedIn) {
        divcontainer.innerHTML = "<p>Please log in to watch.</p>";
        return;
    }

    // Fetch available angles
    const response = await fetch(`${API_URL}/livestream/${eventId}`);

    if (response.status === 404) {
        divcontainer.innerHTML = "<p>No livestream available.</p>";
        return;
    }

    const { angles } = await response.json();

    if (!angles.length) {
        divcontainer.innerHTML = "<p>No livestream available.</p>";
        return;
    }

    // Create video element
    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.style.width = "100%";
    divcontainer.appendChild(video);

    // Create angle selection
    const angleSelector = document.createElement("select");
    angles.forEach((angle) => {
        const option = document.createElement("option");
        option.value = angle.url;
        option.textContent = angle.name;
        angleSelector.appendChild(option);
    });

    angleSelector.onchange = () => {
        video.src = angleSelector.value;
        video.play();
    };

    divcontainer.appendChild(angleSelector);

    // Start with the first angle
    video.src = angles[0].url;
    video.play();
}



export { displayEventVenue, displayEventFAQ, displayEventReviews, displayLivestream };
export { displayLostAndFound, displayContactDetails, displayEventSchedule };
