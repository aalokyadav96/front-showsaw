

import { navigate } from "../../../routes/index.js";
import { renderCommonContent } from "./esrger.js";

export function renderSportsEvent(data, container, isCreator) {
    renderCommonContent(data, container, isCreator, 'sports', ['teams', 'tickets', 'location'], {
        teams: {
            title: 'Teams & Players',
            description: 'Get to know the teams battling it out!',
            ctaText: 'View Teams',
            ctaAction: viewTeams
        },
        tickets: {
            title: 'Get Your Tickets',
            description: 'Reserve your seat for the thrilling match!',
            ctaText: 'Book Tickets',
            ctaAction: bookTickets,
            ctaArgs: [data] // Pass additional arguments here
        },
        location: {
            title: 'Venue Details',
            description: 'Find directions and parking info.',
            ctaText: 'View Location',
            ctaAction: viewLocation
        }
    });
    console.log(data.eventid);
}

// Dummy CTA Actions
function viewTeams() {
    console.log('Viewing teams and players...');
}
function bookTickets(eventdata) {
    console.log('Booking sports event tickets...');
    navigate(`/event/${eventdata.eventid}/tickets`);
}
function viewLocation() {
    console.log('Viewing sports event location...');
}


// import { navigate } from "../../../routes/index.js";
// import { renderCommonContent } from "./esrger.js";

// export function renderSportsEvent(data, container, isCreator) {
//     renderCommonContent(data, container, isCreator, 'sports', ['teams', 'tickets', 'location'], {
//         teams: {
//             title: 'Teams & Players',
//             description: 'Get to know the teams battling it out!',
//             ctaText: 'View Teams',
//             ctaAction: viewTeams
//         },
//         tickets: {
//             title: 'Get Your Tickets',
//             description: 'Reserve your seat for the thrilling match!',
//             ctaText: 'Book Tickets',
//             ctaAction: (data) => {bookTickets(data.eventid);}
//         },
//         location: {
//             title: 'Venue Details',
//             description: 'Find directions and parking info.',
//             ctaText: 'View Location',
//             ctaAction: viewLocation
//         }
//     });
//     console.log(data.eventid);
// }

// // Dummy CTA Actions
// function viewTeams() {
//     console.log('Viewing teams and players...');
// }
// function bookTickets(eventdata) {
//     console.log('Booking sports event tickets...');
//     navigate(`/event/${eventdata.eventid}/tickets`);
// }
// function viewLocation() {
//     console.log('Viewing sports event location...');
// }
