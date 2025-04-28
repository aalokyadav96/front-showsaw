import {renderCommonContent} from "./esrger.js";

export function renderWorkshop(data, container, isCreator) {
    renderCommonContent(data, container, isCreator, 'workshop', ['overview', 'schedule', 'register'], {
        overview: {
            title: 'Workshop Overview',
            description: 'An interactive session to learn and grow your skills.',
            ctaText: 'Learn More',
            ctaAction: viewOverview
        },
        schedule: {
            title: 'Workshop Schedule',
            description: 'Detailed timings and sessions breakdown.',
            ctaText: 'View Schedule',
            ctaAction: viewSchedule
        },
        register: {
            title: 'Register Now',
            description: 'Secure your spot before seats run out!',
            ctaText: 'Register',
            ctaAction: registerWorkshop
        }
    });
}

// Dummy CTA Actions
function viewOverview() {
    console.log('Viewing workshop overview...');
}
function viewSchedule() {
    console.log('Viewing workshop schedule...');
}
function registerWorkshop() {
    console.log('Registering for workshop...');
}
