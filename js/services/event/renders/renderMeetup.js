import {renderCommonContent} from "./esrger.js";

export function renderMeetup(data, container, isCreator) {
    renderCommonContent(data, container, isCreator, 'meetup', ['agenda', 'signup', 'location'], {
        agenda: {
            title: 'Meetup Agenda',
            description: 'See the topics and discussions lined up.',
            ctaText: 'View Agenda',
            ctaAction: viewAgenda
        },
        signup: {
            title: 'Join the Meetup',
            description: 'RSVP and join like-minded people!',
            ctaText: 'Sign Up',
            ctaAction: signupMeetup
        },
        location: {
            title: 'Meetup Location',
            description: 'Where the meetup will take place.',
            ctaText: 'View Map',
            ctaAction: viewMeetupLocation
        }
    });
}

// Dummy CTA Actions
function viewAgenda() {
    console.log('Viewing meetup agenda...');
}
function signupMeetup() {
    console.log('Signing up for the meetup...');
}
function viewMeetupLocation() {
    console.log('Viewing meetup location...');
}
