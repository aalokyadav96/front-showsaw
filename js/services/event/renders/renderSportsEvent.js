import {renderCommonContent} from "./esrger.js";

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
            ctaAction: bookTickets
        },
        location: {
            title: 'Venue Details',
            description: 'Find directions and parking info.',
            ctaText: 'View Location',
            ctaAction: viewLocation
        }
    });
}

// Dummy CTA Actions
function viewTeams() {
    console.log('Viewing teams and players...');
}
function bookTickets() {
    console.log('Booking sports event tickets...');
}
function viewLocation() {
    console.log('Viewing sports event location...');
}
