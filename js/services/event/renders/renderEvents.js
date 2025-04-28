// --- Master Router: renderEventByType ---
import { renderConcert } from './renderConcert.js';
import { renderWorkshop } from './renderWorkshop.js';
import { renderSportsEvent } from './renderSportsEvent.js';
import { renderMeetup } from './renderMeetup.js';
import { renderFestival } from './renderFestival.js';
// (Import any others you add later)

export function renderEventByType(eventType, data, container, isCreator) {
    const type = eventType.toLowerCase();
    const renderers = {
        'concert': renderConcert,
        'workshop': renderWorkshop,
        'sports': renderSportsEvent,
        'meetup': renderMeetup,
        'festival': renderFestival
        // Add more types here if you make more!
    };

    const renderFunction = renderers[type];

    if (renderFunction) {
        renderFunction(data, container, isCreator);
    } else {
        console.error(`No render function available for event type: ${eventType}`);
        container.appendChild(
            document.createTextNode(`Sorry, no page available for "${eventType}" yet.`)
        );
    }
}

// // --- Lazy Load Master Router: renderEventByType ---
// export async function renderEventByType(eventType, data, container, isCreator) {
//     const type = eventType.toLowerCase();

//     try {
//         let renderFunction;

//         switch (type) {
//             case 'concert':
//                 renderFunction = (await import('./renderConcert.js')).renderConcert;
//                 break;
//             case 'workshop':
//                 renderFunction = (await import('./renderWorkshop.js')).renderWorkshop;
//                 break;
//             case 'sports':
//                 renderFunction = (await import('./renderSportsEvent.js')).renderSportsEvent;
//                 break;
//             case 'meetup':
//                 renderFunction = (await import('./renderMeetup.js')).renderMeetup;
//                 break;
//             case 'festival':
//                 renderFunction = (await import('./renderFestival.js')).renderFestival;
//                 break;
//             // Add more cases if you add more types!
//             default:
//                 console.error(`No renderer for event type: ${eventType}`);
//                 container.appendChild(
//                     document.createTextNode(`No page available for "${eventType}" yet.`)
//                 );
//                 return;
//         }

//         if (renderFunction) {
//             renderFunction(data, container, isCreator);
//         }
//     } catch (error) {
//         console.error('Error loading event renderer:', error);
//         container.appendChild(
//             document.createTextNode('An error occurred while loading this event page.')
//         );
//     }
// }
