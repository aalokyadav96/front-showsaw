import "../../../css/placesPage.css";
import { displayPlaces } from '../../services/place/displayPlaces.js';

async function Places(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';

    const efventhead = document.createElement("h1");
    efventhead.textContent = "Places";
    contentContainer.appendChild(efventhead);

    const content = document.createElement("div");
    content.id = "places";
    // content.classList = "places";
    contentContainer.appendChild(content);

    displayPlaces(isLoggedIn, content)
}

export { Places };
