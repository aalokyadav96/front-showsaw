import { state } from "../../state/state.js";
import { SRC_URL, apiFetch } from "../../api/api.js";
import { createElement } from "../../components/createElement.js";
import { renderPlaceDetails } from "./renderPlaceDetails.js";
import { displayMedia } from "../media/mediaService.js";
import BookingForm from "../../components/ui/BookingForm.mjs";
import Snackbar from "../../components/ui/Snackbar.mjs";
import RenderMenu from "../../components/ui/RenderMenu.mjs";
import { displayReviews } from "../reviews/displayReviews.js";
import { createTabs } from "../../components/ui/createTabs.js";
import { displayPlaceHome, displayPlaceNotices, displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";

async function displayPlace(isLoggedIn, placeId, contentContainer) {
    try {
        const placeData = await apiFetch(`/places/place/${placeId}`);
        const isCreator = isLoggedIn && state.user === placeData.createdBy;

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

        // Display Details
        const details = createElement("div", { id: "place-details", class: "detail-section" });
        renderPlaceDetails(isLoggedIn, details, placeData, isCreator);
        contentContainer.appendChild(details);

        if (isLoggedIn && !isCreator) {
            const bookingForm = BookingForm(() => Snackbar("Booking Confirmed!", 3000));
            details.appendChild(bookingForm);
        }

        let container = document.createElement('div');
        contentContainer.appendChild(container);

        // Tabs
        const tabs = [
            { title: "Home", id: "home-tab", render: (container) => displayPlaceHome(container, placeData) },
            { title: "Notices", id: "notices-tab", render: (container) => displayPlaceNotices(container, isCreator) },
            { title: "Menu", id: "menu-tab", render: (container) => RenderMenu(container, isCreator, placeData.menu) },
            { title: "Gallery", id: "gallery-tab", render: (container) => displayMedia(container, "place", placeId, isLoggedIn) },
            { title: "Reviews", id: "reviews-tab", render: (container) => displayReviews(container, isCreator, isLoggedIn, "place", placeId) },
            { title: "Nearby", id: "nearby-tab", render: (container) => displayPlaceNearby(container, placeData) },
            { title: "Info", id: "info-tab", render: (container) => displayPlaceInfo(container, placeData, isCreator) },
        ];

        const tabContainer = createTabs(tabs, "home-tab");
        contentContainer.appendChild(tabContainer);
    } catch (error) {
        contentContainer.innerHTML = "";
        console.error(error);
        contentContainer.appendChild(createElement("h1", {}, [`Error loading place details: ${error.message}`]));
        Snackbar("Failed to load place details. Please try again later.", 3000);
    }
}


export default displayPlace;
