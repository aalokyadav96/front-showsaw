import { displayPlaces } from '../../services/place/displayPlaces.js';

async function Places(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';

    const efventhead = document.createElement("h3");
    efventhead.textContent = "Places";
    contentContainer.appendChild(efventhead);

    const content = document.createElement("div");
    content.id = "places";
    content.classList = "hvflex";
    contentContainer.appendChild(content);

    displayPlaces(isLoggedIn, content)
}

export { Places };
