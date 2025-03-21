import { createElement } from "../../components/createElement.js";
import Button from "../../components/base/Button.js";
import { navigate } from "../../routes/index.js";
import { apiFetch } from "../../api/api.js";
// import { renderPlaceDetails } from "./renderPlaceDetails.js";

function displayPlaceHome(container, placeData, isCreator, isLoggedIn) {
    container.innerHTML = "";
    // renderPlaceDetails(isLoggedIn, container, placeData, isCreator);
    container.appendChild(createElement("h2", {}, [placeData.name]));
    container.appendChild(
        createElement("p", {}, [placeData.description || "No description available."])
    );
}



async function displayPlaceNearby(container, placeId) {
    container.innerHTML = "";

    const nearbyPlaces = await apiFetch(`/suggestions/places/nearby?place=${placeId}&lat=28.6139&lng=77.2090`);

    if (nearbyPlaces == null) {
        container.innerHTML = "No nearby Places found";
        return
    }

    // Nearby places section
    const nearbySection = createElement("div", { class: "nearby-section" }, [
        // createElement("h3", {}, ["Nearby Places"]),
        ...nearbyPlaces.map((place, index) =>
            createElement("div", { class: "nearby-item" }, [
                createElement("div", { class: "nearby-details" }, [
                    createElement("h4", {}, [place.name]),
                    createElement("p", {}, [`Category: ${place.category}`]),
                    // createElement("p", {}, [`Distance: ${place.distance}`]),
                    createElement("p", {}, [`Capacity: ${place.capacity || 1}`]),
                    createElement("p", {}, [`⭐ Review Count: ${place.reviewCount}`]),
                ]),
                Button("View Details", `nearby-btn-${index}`, {
                    // click: () => alert(`More details about ${place.name}`),
                    click: () => navigate(`/place/${place.placeid}`),
                }),
            ])
        ),
    ]);

    container.appendChild(createElement("h3", {}, ["Nearby Places"]));
    container.appendChild(nearbySection);
}
    

function displayPlaceInfo(container, placeData, isCreator) {
    // Clear the container
    container.innerHTML = "";

    // Initialize place information
    const info = {
        category: placeData.category || "N/A",
        capacity: placeData.capacity || "N/A",
        accessibility: placeData.accessibility || "Not specified",
        services: placeData.services || [],
    };


    // Function to render place information
    const renderInfo = () => {
        container.innerHTML = "";

        // Add the "Add Info" button if the user is the creator
        if (isCreator) {
            const addInfoButton = Button("Add Info", "add-info-btn", {
                click: handleAddInfo,
            });
            container.appendChild(addInfoButton);
        }
        
        // Create the info display
        const infoDisplay = createElement("div", { class: "place-info" }, [
            createElement("h2", {}, [placeData.name || "Unknown Place"]),
            createElement("p", {}, [`Category: ${info.category}`]),
            createElement("p", {}, [`Capacity: ${info.capacity}`]),
            createElement("p", {}, [`Accessibility: ${info.accessibility}`]),
            createElement("p",{},[`Services: ${info.services.length > 0 ? info.services.join(", ") : "None"}`]),
        ]);

        container.appendChild(infoDisplay);

    };

    // Function to handle adding new information
    const handleAddInfo = () => {
        const accessibility = prompt("Enter accessibility info:");
        const service = prompt("Enter a service to add:");

        if (accessibility) info.accessibility = accessibility;
        if (service) info.services.push(service);

        renderInfo(); // Re-render the updated information
    };

    // Initial render
    renderInfo();
}


export { displayPlaceHome, displayPlaceNearby, displayPlaceInfo };
