import { SRC_URL, state } from "../../state/state.js";
import { createElement } from "../../components/createElement.js";
import { renderPlaceDetails } from "./renderPlaceDetails.js";
import { displayMedia } from "../media/mediaService.js";
import BookingForm from "../../components/ui/BookingForm.mjs";
import Snackbar from "../../components/ui/Snackbar.mjs";
import Button from "../../components/base/Button.js";
import RenderMenu from "../../components/ui/RenderMenu.mjs";
import { displayReviews } from "../reviews/displayReviews.js";
import { apiFetch } from "../../api/api.js";
import { createButton, createContainer } from "../event/eventHelper.js";

async function displayPlace(isLoggedIn, placeId, contentContainer) {
    try {
        const placeData = await apiFetch(`/places/place/${placeId}`);
        const isCreator = isLoggedIn && state.user === placeData.createdBy;

        if (!contentContainer) {
            contentContainer = document.getElementById("content");
        }
        contentContainer.innerHTML = "";

        // Display Banner
        const banner = createElement("div", { id: "place-banner" }, [
            createElement("img", {
                src: placeData.banner ? `${SRC_URL}/placepic/${placeData.banner}` : "default-banner.jpg",
                alt: placeData.name,
                loading: "lazy",
            }),
        ]);
        contentContainer.appendChild(banner);

        const details = createElement("div", { id: "place-details", class: "detail-section" });
        renderPlaceDetails(isLoggedIn, details, placeData, isCreator);

        contentContainer.appendChild(details);

        const bookingForm = isLoggedIn && !isCreator ? BookingForm((details) => {
            Snackbar("Booking Confirmed!", 3000);
        }) : null;
        // if (bookingForm) details.appendChild(bookingForm);
        if (bookingForm) details.appendChild(bookingForm);

        // contentContainer.appendChild(details);
        
        // Create and Render Tabs
        const tabContainer = createContainer(["place-tabs"]);
        const tabButtons = createContainer(["tab-buttons"]);
        const tabContents = createContainer(["tab-contents"]);

        const tabContentContainers = [
            createElement("article", { id: "home-container", classes: ["home-container"] }),
            createElement("article", { id: "notices-container", classes: ["notices-container"] }),
            createElement("article", { id: "menu-container", classes: ["menu-container"] }),
            createElement("article", { id: "gallery-container", classes: ["gallery-container"] }),
            createElement("article", { id: "reviews-container", classes: ["reviews-container"] }),
            createElement("article", { id: "nearby-container", classes: ["nearby-container"] }),
            createElement("article", { id: "info-container", classes: ["info-container"] }),
        ];

        const tabs = [
            {
                title: "Home",
                id: "home-tab",
                render: () => displayPlaceHome(tabContentContainers[0], placeData),
            },
            {
                title: "Notices",
                id: "notices-tab",
                render: () => displayPlaceNotices(tabContentContainers[1], isCreator),
            },
            {
                title: "Menu",
                id: "menu-tab",
                render: () => RenderMenu(isCreator, tabContentContainers[2], placeData.menu),
            },
            {
                title: "Gallery",
                id: "gallery-tab",
                render: () => displayMedia("place", placeId, isLoggedIn, tabContentContainers[3]),
            },
            {
                title: "Reviews",
                id: "reviews-tab",
                render: () => displayReviews(isCreator, isLoggedIn, tabContentContainers[4], "place", placeId),
            },
            {
                title: "Nearby",
                id: "nearby-tab",
                render: () => displayPlaceNearby(tabContentContainers[5], placeData),
            },
            {
                title: "Info",
                id: "info-tab",
                render: () => displayPlaceInfo(tabContentContainers[6], placeData, isCreator),
            },
        ];

        tabs.forEach(({ title, id, render }, index) => {
            const tabButton = createButton({
                text: title,
                classes: ["tab-button"],
                events: {
                    click: () => activateTab(id, render, tabContentContainers[index]),
                },
            });
            tabButtons.appendChild(tabButton);

            const tabContent = createContainer(["tab-content"], id);
            tabContents.appendChild(tabContent);
        });

        tabContainer.appendChild(tabButtons);
        tabContainer.appendChild(tabContents);
        contentContainer.appendChild(tabContainer);

        // Activate the first tab by default
        activateTab(tabs[0].id, tabs[0].render, tabContentContainers[0]);

        function activateTab(tabId, renderContent, contentContainer) {
            document.querySelectorAll(".tab-button").forEach((btn, index) => {
                btn.classList.toggle("active", tabs[index].id === tabId);
            });

            document.querySelectorAll(".tab-content").forEach((content) => {
                content.classList.toggle("active", content.id === tabId);
            });

            const activeTabContent = document.querySelector(`#${tabId}`);
            if (activeTabContent && !activeTabContent.contains(contentContainer)) {
                activeTabContent.innerHTML = "";
                activeTabContent.appendChild(contentContainer);
            }

            if (contentContainer && !contentContainer.innerHTML.trim()) {
                renderContent(contentContainer);
            }

            history.pushState({ placeId, tabId }, "", `/place/${placeId}#${tabId}`);
        }
    } catch (error) {
        contentContainer.innerHTML = "";
        contentContainer.appendChild(
            createElement("h1", {}, [`Error loading place details: ${error.message}`])
        );
        Snackbar("Failed to load place details. Please try again later.", 3000);
    }
}

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


export default displayPlace;
