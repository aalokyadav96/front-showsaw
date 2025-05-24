// import Pagination from '../../components/ui/Pagination.mjs';
// import { apiFetch } from "../../api/api.js";
// import SnackBar from '../../components/ui/Snackbar.mjs';
// import { SRC_URL } from '../../state/state.js';
// import SortFilterSidebar from '../../components/ui/SortFilterSidebar.js';

// let abortController = null;

// async function fetchEvents(page = 1, limit = 10, query = {}) {
//     if (abortController) abortController.abort();
//     abortController = new AbortController();

//     const signal = abortController.signal;

//     try {
//         const params = new URLSearchParams({ page, limit, ...query }).toString();
//         const events = await apiFetch(`/events/events?${params}`, 'GET', null, { signal });
//         return events;
//     } catch (error) {
//         if (error.name === 'AbortError') {
//             console.log('Fetch aborted');
//             return null;
//         }
//         console.error('Error fetching events:', error);
//         SnackBar("An unexpected error occurred while fetching events.", 3000);
//         return null;
//     }
// }

// async function fetchTotalEventCount() {
//     const eventData = await apiFetch(`/events/events/count`);
//     return eventData?.count || 0;
// }

// async function displayEvents(isLoggedIn, content, contentcon, page = 1, filterQuery = {}) {
//     const eventsPerPage = 6;
//     content.innerHTML = '';

//     const header = document.createElement("h3");
//     header.textContent = "Events";
//     content.appendChild(header);

//     // Sidebar
//     const sidebar = SortFilterSidebar(["category", "date", "location"]);
//     content.appendChild(sidebar);

//     sidebar.addEventListener("filterUpdate", e => {
//         const { sort, filters } = e.detail;
//         displayEvents(isLoggedIn, content, contentcon, 1, { ...filters, sort });
//     });

//     // Event container
//     const eventDiv = document.createElement("div");
//     eventDiv.id = "events";
//     eventDiv.className = "event-grid";
//     content.appendChild(eventDiv);

//     try {
//         const events = await fetchEvents(page, eventsPerPage, filterQuery);
//         if (events && events.length > 0) {
//             events.forEach(event => {
//                 eventDiv.appendChild(generateEventCard(event));
//             });
//         } else {
//             eventDiv.innerHTML = "<h2>No events found.</h2>";
//         }

//         const totalEvents = await fetchTotalEventCount();
//         const totalPages = Math.ceil(totalEvents / eventsPerPage);

//         const paginationContainer = document.getElementById("pagination") || document.createElement("div");
//         paginationContainer.id = "pagination";
//         paginationContainer.className = "pagination";
//         paginationContainer.innerHTML = "";

//         const pagination = Pagination(page, totalPages, (newPage) => {
//             displayEvents(isLoggedIn, content, contentcon, newPage, filterQuery);
//         });

//         paginationContainer.appendChild(pagination);
//         if (!document.getElementById("pagination")) {
//             content.appendChild(paginationContainer);
//         }

//     } catch (error) {
//         console.error("Error in displayEvents:", error);
//         content.innerHTML = "<h2>Error loading events. Please try again later.</h2>";
//     }
// }

// // Create Event Card
// function generateEventCard(event) {
//     const container = document.createElement("div");
//     container.className = "event-card";
//     container.id = `event-${event.eventid}`;

//     const img = document.createElement("img");
//     img.loading = "lazy";
//     img.src = `${SRC_URL}/eventpic/banner/thumb/${event.eventid}.jpg`;
//     img.alt = `${event.title} Banner`;
//     img.style = "width: 100%; aspect-ratio: 3/2; object-fit: cover;";
//     container.appendChild(img);

//     const title = document.createElement("h3");
//     title.textContent = event.title;
//     container.appendChild(title);

//     const date = document.createElement("p");
//     date.innerHTML = `<strong>Date:</strong> ${new Date(event.date).toLocaleString()}`;
//     container.appendChild(date);

//     const location = document.createElement("p");
//     location.innerHTML = `<strong>Place:</strong> ${event.placename}`;
//     container.appendChild(location);

//     // Optional category badge
//     if (event.category) {
//         const badge = document.createElement("span");
//         badge.className = "event-badge";
//         badge.textContent = event.category;
//         container.appendChild(badge);
//     }

//     const link = document.createElement("a");
//     link.href = `/event/${event.eventid}`;
//     link.title = "View event details";
//     link.id = `a-${event.eventid}`;

//     const btn = document.createElement("button");
//     btn.textContent = "View Event";
//     btn.className = "action-btn";
//     link.appendChild(btn);
//     container.appendChild(link);

//     return container;
// }

// export { displayEvents, generateEventCard };

import Pagination from '../../components/ui/Pagination.mjs';
import { apiFetch } from "../../api/api.js";
// import Breadcrumb from '../../components/ui/Breadcrumb.mjs';
import SnackBar from '../../components/ui/Snackbar.mjs';
import { SRC_URL } from '../../state/state.js';
// import SortFilterSidebar from '../../components/ui/SortFilterSidebar.js';

// document.getElementById('events').appendChild(SortFilterSidebar());

let abortController = null;

async function fetchEvents(page = 1, limit = 10) {
    // Abort the previous fetch if it's still ongoing
    if (abortController) {
        abortController.abort();
    }

    abortController = new AbortController(); // Create a new instance
    const signal = abortController.signal; // Get the signal to pass to apiFetch

    try {
        // Use apiFetch to fetch events and pass the signal for aborting
        const queryParams = new URLSearchParams({ page: page, limit: limit }).toString();
        const events = await apiFetch(`/events/events?${queryParams}`, 'GET', null, { signal });
        return events;
    } catch (error) {
        // If error is due to abort, return null
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
            return null; // Return null for aborted fetch
        }
        console.error('Error fetching events:', error);
        SnackBar("An unexpected error occurred while fetching events.", 3000);
        return null; // Return null for other errors
    }
}

async function fetchTotalEventCount() {
    
    const eventData = await apiFetch(`/events/events/count`);
    // if (!eventData || !Array.isArray(eventData.tickets)) {
    //     throw new Error("Invalid event data received.");
    // }
    return eventData;

    // return 5;
}


// // Event listener for navigation
// document.addEventListener('click', function (e) {
//     const link = e.target.closest('a');
//     if (link && link.id.startsWith('a-')) {
//         e.preventDefault(); // Prevent page reload
//         const eventId = link.id.split('-')[1]; // Extract event ID
//         navigate(`/event/${eventId}`); // Handle navigation
//     }
// });


async function displayEvents(isLoggedIn, content, contentcon, page = 1) {
    const eventsPerPage = 6; // Number of events per page
    content.innerHTML = ''; // Clear the main content area

    const efventhead = document.createElement("h3");
    efventhead.textContent = "Events";
    content.appendChild(efventhead);
    
    // Create a container for events
    const eventDiv = document.createElement("div");
    eventDiv.id = "events";
    eventDiv.className = "hvflex";
    content.appendChild(eventDiv);
    try {
        // Fetch events for the current page
        const events = await fetchEvents(page, eventsPerPage);

        if (events && events.length > 0) {
            eventDiv.innerHTML = events.map(generateEventHTML).join('');

            // const sidebar = SortFilterSidebar();
            
            // sidebar.addEventListener('filterUpdate', (e) => {
            //   const { sort, filters } = e.detail;
            //   console.log('Sort:', sort);
            //   console.log('Filters:', filters);
            //   // Apply to your dataset / fetch from backend etc.
            // });
            // eventDiv.prepend(sidebar);

            console.log("Displayed refreshed events.");
        } else {
            eventDiv.innerHTML = "<h2>No events available.</h2>";
        }

        // Handle pagination
        // const totalEvents = await fetchTotalEventCount(); // Get the total event count from the backend
        const totalEvents = 7;
        const totalPages = Math.ceil(totalEvents / eventsPerPage);

        const paginationContainer = document.getElementById("pagination") || document.createElement('div');
        paginationContainer.id = "pagination";
        paginationContainer.className = "pagination";

        // Clear and rebuild pagination
        paginationContainer.innerHTML = '';
        const pagination = Pagination(page, totalPages, (newPage) => {
            displayEvents(isLoggedIn, content, contentcon, newPage);
        });

        paginationContainer.appendChild(pagination);

        // Append the pagination to the content container
        if (!document.getElementById("pagination")) {
            content.appendChild(paginationContainer);
        }
    } catch (error) {
        content.innerHTML = "<h2>Error loading events. Please try again later.</h2>";
        console.error("Error fetching events:", error);
    }
}


// Generate HTML for each event
function generateEventHTML(eevent) {
    return `
    <div class="event" id="event-${eevent.eventid}">
                <img loading="lazy" src="${SRC_URL}/eventpic/banner/thumb/${eevent.eventid}.jpg" alt="${eevent.title} Banner" style="width: 100%; aspect-ratio:3/2; object-fit: cover;" />
                <h3>${eevent.title}</h3>
                <p><strong>Date:</strong> ${new Date(eevent.date).toLocaleString()}</p>
                <p><strong>Place:${eevent.placename}</strong></p>
                <!--p><strong>Description:</strong> ${eevent.description}</p-->
                <a href="/event/${eevent.eventid}" title="View event details" id="a-${eevent.eventid}"><button>View Event</button></a>
                </div>
        `;
}


export { displayEvents, generateEventHTML };