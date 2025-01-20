import { displayPlace } from '../../services/place/placeService.js';

function Place(isLoggedIn, placeid, contentContainer) {
    contentContainer.innerHTML = '';
    displayPlace(isLoggedIn, placeid, contentContainer)
}

export { Place };
