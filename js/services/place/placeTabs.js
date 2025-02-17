import { createElement } from "../../components/createElement.js";
import Button from "../../components/base/Button.js";


function displayPlaceHome(container, placeData) {
    container.innerHTML = "";
    container.appendChild(createElement("h2", {}, [placeData.name]));
    container.appendChild(
        createElement("p", {}, [placeData.description || "No description available."])
    );
}


function displayPlaceNotices(container, isCreator) {
    // Clear the container
    container.innerHTML = "";

    // Initialize an array to store notices
    const notices = [];

    // Function to render the notices
    const renderNotices = () => {
        container.innerHTML = "";

        // Display "No notices available" if the list is empty
        if (notices.length === 0) {
            container.appendChild(
                createElement("p", {}, ["No notices available."])
            );
        } else {
            // Create a list of notices
            const noticesList = createElement(
                "div",
                { class: "notices-list" },
                notices.map((notice, index) =>
                    createElement("div", { class: "notice-item" }, [
                        createElement("p", {}, [notice]),
                        Button("Remove", "remove-notice-btn", {
                            click: () => {
                                // Remove the selected notice and re-render the list
                                notices.splice(index, 1);
                                renderNotices();
                            },
                        }),
                    ])
                )
            );
            container.appendChild(noticesList);
        }

        // Add "Add Notice" button for creators
        if (isCreator) {
            const addButton = Button("Add Notice", "add-notice-btn", {
                click: () => {
                    const notice = prompt("Enter your notice:");
                    if (notice) {
                        notices.push(notice);
                        renderNotices();
                    }
                },
            });
            container.appendChild(addButton);
        }
    };

    // Initial render
    renderNotices();
}


function displayPlaceNearby(container, placeData) {
    container.innerHTML = "";

    const nearbyPlaces = [
        { name: "Place A", category: "Cafe", distance: "500m" },
        { name: "Place B", category: "Restaurant", distance: "800m" },
    ];

    // container.appendChild(
    //     createElement("div", { class: "place-info" }, [
    //         createElement("p", {}, [`Category: ${placeData.category || "N/A"}`]),
    //         createElement("p", {}, [`Capacity: ${placeData.capacity || "N/A"}`]),
    //     ])
    // );

    const nearbySection = createElement("div", { class: "nearby-section" }, [
        createElement("h3", {}, ["Nearby Places"]),
        ...nearbyPlaces.map((place) =>
            createElement("div", { class: "nearby-item" }, [
                createElement("p", {}, [`Name: ${place.name}`]),
                createElement("p", {}, [`Category: ${place.category}`]),
                createElement("p", {}, [`Distance: ${place.distance}`]),
            ])
        ),
    ]);

    container.appendChild(nearbySection);
}


function displayPlaceInfo(container, placeData, isCreator) {
    // Clear the container
    container.innerHTML = "";

    // Initialize place information
    const info = {
        capacity: placeData.capacity || "N/A",
        accessibility: placeData.accessibility || "Not specified",
        services: placeData.services || [],
    };

    // Function to render place information
    const renderInfo = () => {
        container.innerHTML = "";

        // Create the info display
        const infoDisplay = createElement("div", { class: "place-info" }, [
            createElement("p", {}, [`Capacity: ${info.capacity}`]),
            createElement("p", {}, [`Accessibility: ${info.accessibility}`]),
            createElement(
                "p",
                {},
                [`Services: ${info.services.length > 0 ? info.services.join(", ") : "None"}`]
            ),
        ]);

        container.appendChild(infoDisplay);

        // Add the "Add Info" button if the user is the creator
        if (isCreator) {
            const addInfoButton = Button("Add Info", "add-info-btn", {
                click: handleAddInfo,
            });
            container.appendChild(addInfoButton);
        }
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


export {displayPlaceHome, displayPlaceNotices, displayPlaceNearby, displayPlaceInfo};
