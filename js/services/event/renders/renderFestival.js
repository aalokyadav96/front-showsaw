import {renderCommonContent} from "./esrger.js";

export function renderFestival(data, container, isCreator) {
    renderCommonContent(data, container, isCreator, 'festival', ['events', 'passes', 'map'], {
        events: {
            title: 'Festival Events',
            description: 'Explore all the performances, exhibitions, and activities!',
            ctaText: 'See Events',
            ctaAction: viewFestivalEvents
        },
        passes: {
            title: 'Buy Festival Passes',
            description: 'Multiple days of fun, one single pass!',
            ctaText: 'Get Passes',
            ctaAction: buyFestivalPasses
        },
        map: {
            title: 'Festival Map',
            description: 'Plan your visit with our detailed map.',
            ctaText: 'View Map',
            ctaAction: viewFestivalMap
        }
    });
}

// Dummy CTA Actions
function viewFestivalEvents() {
    console.log('Viewing festival events...');
}
function buyFestivalPasses() {
    console.log('Buying festival passes...');
}
function viewFestivalMap() {
    console.log('Viewing festival map...');
}