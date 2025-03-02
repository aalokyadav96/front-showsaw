import { createElement } from "../../components/createElement.js";
import { editPlaceForm, deletePlace } from "./placeService.js";
import Button from "../../components/base/Button.js";
// import { SRC_URL } from "../../api/api.js";

function renderPlaceDetails(isLoggedIn, content, place, isCreator) {
    const createdDate = new Date(place.created_at).toLocaleString();
    const updatedDate = new Date(place.updated_at).toLocaleString();
    // const latitude = place.coordinates?.lat || "N/A";
    // const longitude = place.coordinates?.lng || "N/A";

    // const detailsS = createElement('section', { id: 'placedetcon', class: 'placedetails' }, [
    //     // createElement("div", { id: "place-banner" }, [
    //     //     createElement("img", {
    //     //         src: place.banner ? `${SRC_URL}/placepic/${place.banner}` : "default-banner.jpg",
    //     //         alt: place.name,
    //     //         loading: "lazy",
    //     //     }),
    //     // ]),
    // ])

    const detailsSection = createElement('section', { id: 'placedetails', class: 'placedetails' }, [
        createElement('h1', {}, [place.name]),
        createElement('p', {}, [createElement('strong', {}, ["Description: "]), place.description || "N/A"]),
        createElement('p', {}, [createElement('strong', {}, ["Address: "]), place.address || "N/A"]),
        createElement('p', {}, [createElement('strong', {}, ["Created On: "]), createdDate]),
        createElement('p', {}, [createElement('strong', {}, ["Last Updated: "]), updatedDate]),
        // createElement('p', {}, [createElement('strong', {}, ["Coordinates: "]), `Lat: ${latitude}, Lng: ${longitude}`]),
        createElement('p', {}, [createElement('strong', {}, ["Category: "]), place.category || "N/A"]),
    ]);


    if (isCreator) {
        detailsSection.appendChild(
            Button("Edit Place", "edit-place-btn", {
                click: () => editPlaceForm(isLoggedIn, place.placeid, contentx),
                mouseenter: () => console.log("Button hovered"),
            })
        );
        detailsSection.appendChild(
            Button("Delete Place", "delete-place-btn", {
                click: () => deletePlace(isLoggedIn, place.placeid),
                mouseenter: () => console.log("Button hovered"),
            })
        );

        let contentx = createElement('div', { 'id': 'editplace' }, []);
        detailsSection.appendChild(contentx);
    }
    // detailsSection.appendChild(detailsS);
    content.appendChild(detailsSection);
}


export { renderPlaceDetails };