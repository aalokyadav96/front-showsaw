import { fetchPlaces } from "./fetchPlaces.js";
import Snackbar from '../../components/ui/Snackbar.mjs';
import { createElement } from "../../components/createElement.js";
import { SRC_URL } from "../../state/state.js";

// Function to display the list of places
async function displayPlaces(isLoggedIn, content) {
    // const content = document.getElementById("places");
    // content.innerHTML = ""; // Clear existing content

    try {
        const places = await fetchPlaces();

        if (!places || places.length === 0) {
            content.appendChild(createElement('p', {}, ["No places available."]));
            return;
        }

        places.forEach(place => {
            const placeCard = createPlaceCard(place);
            content.appendChild(placeCard);
        });
    } catch (error) {

        Snackbar("Error fetching places. Please try again later.", 3000);
    }
}


// Function to create a card for each place
function createPlaceCard(place) {
    return createElement('div', { class: 'place' }, [
        createElement('a', { href: `/place/${place.placeid}` }, [
            createElement('img', {
                src: `${SRC_URL}/placepic/thumb/${place.banner}`,
                alt: `${place.name} Banner`,
                loading: "lazy",
                style: "width: 100%; aspect-ratio:3/2; object-fit: cover;"
            }),
            createElement('h1', {}, [place.name]),
            createElement('p', {}, [createElement('strong', {}, ["Address: "]), place.address]),
            createElement('p', {}, [createElement('strong', {}, ["Description: "]), place.description])]),
    ]);
}

export { displayPlaces, createPlaceCard };