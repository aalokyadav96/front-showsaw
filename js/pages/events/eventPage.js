import "../../../css/eventPage.css";
// import "../../../css/tabs.css";
import "../../../css/ticketPage.css";
import { displayEvent } from "../../services/event/eventService.js";

async function Event(isLoggedIn, eventid, contentContainer) {
    displayEvent(isLoggedIn, eventid, contentContainer)
}


export { Event };
