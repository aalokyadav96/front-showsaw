import "../../../css/eventsPage.css";
import { displayPlaces } from '../../services/place/displayPlaces.js';

async function Places(isLoggedIn, contentContainer) {
    
    contentContainer.innerHTML = '';
    const content = document.createElement("div");
    content.id = "places";
    // content.classList = "places";
    contentContainer.appendChild(content);
    
    displayPlaces(isLoggedIn, content)
}

export { Places };
