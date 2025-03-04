import "../../../css/placePage.css";
import "../../../css/tabs.css";
import { displayPlace } from '../../services/place/placeService.js';

async function Place(isLoggedIn, placeid, contentContainer) {
    contentContainer.innerHTML = '';
    displayPlace(isLoggedIn, placeid, contentContainer)
}

export { Place };
