import { createItinerary } from "../../services/itinerary/itineraryCreate.js";

async function CreateItinerary(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    createItinerary(isLoggedIn, contentContainer);
}

export { CreateItinerary };
