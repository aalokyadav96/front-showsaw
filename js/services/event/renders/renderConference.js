import { navigate } from "../../../routes/index.js";
import {renderCommonContent} from "./esrger.js";

export function renderConference(data, container, isCreator) {
    renderCommonContent(data, container, isCreator, 'conference', ['lineup', 'tickets', 'venue'], {
        lineup: {
            title: 'Artist Lineup',
            description: 'Check out the amazing artists performing at this conference!',
            ctaText: 'View Lineup',
            ctaAction: viewLineup
        },
        tickets: {
            title: 'Buy Tickets',
            description: 'Grab your tickets before they sell out!',
            ctaText: 'Get Tickets',
            ctaAction: buyTickets,
            ctaArgs: [data] // Pass additional arguments here
        },
        venue: {
            title: 'Venue Info',
            description: 'Learn more about the conference venue and how to get there.',
            ctaText: 'View Venue',
            ctaAction: viewVenue
        }
    });
}

// Dummy CTA Actions
function viewLineup() {
    console.log('Viewing artist lineup...');
}
function buyTickets(eventdata) {
    navigate(`/event/${eventdata.eventid}/tickets`);
}
function viewVenue() {
    console.log('Viewing conference venue...');
}
