import { state } from "../../state/state.js";
import { SRC_URL, apiFetch } from "../../api/api.js";
import { createElement } from "../../components/createElement.js";
import { renderPlaceDetails } from "./renderPlaceDetails.js";
import { displayMedia } from "../media/mediaService.js";
import BookingForm from "../../components/ui/BookingForm.mjs";
// import CalendarForm from "../../components/ui/CalendarForm.mjs";
import Snackbar from "../../components/ui/Snackbar.mjs";
import RenderMenu from "../../components/ui/MenuRender.mjs";
import { displayReviews } from "../reviews/displayReviews.js";
import { createTabs } from "../../components/ui/createTabs.js";
import { displayPlaceHome, displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";

import { renderArena } from "./renders/renderArena.js";
import { renderRestaurant } from "./renders/renderRestaurant.js";
import { renderPark } from "./renders/renderPark.js";
import { renderBusiness } from "./renders/renderBusiness.js";
import { renderShop } from "./renders/renderShop.js";
import { renderDefault } from "./renders/renderDefault.js";


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
        if (isCreator) {
            const detailx = createElement("div", { class: "detail-section hvflex" });
            renderPlaceDetails(isLoggedIn, detailx, placeData, isCreator);
            contentContainer.appendChild(detailx);
        }
        const details = createElement("div", { class: "detail-section hvflex" });
        contentContainer.appendChild(details);

        // Call specialized renderers based on category
        switch ((placeData.category || "").toLowerCase()) {
            case "arena":
                renderArena(placeData, details, isCreator);
                break;
            case "restaurant":
                renderRestaurant(placeData, details, isCreator);
                break;
            case "park":
                renderPark(placeData, details, isCreator);
                break;
            case "business":
                renderBusiness(placeData, details, isCreator);
                break;
            case "shop":
                renderShop(placeData, details, isCreator);
                break;
            default:
                renderDefault(placeData, details, isCreator);
                break;
        }

        // if (isLoggedIn && !isCreator) {
        //     const bookingForm = BookingForm(() => Snackbar("Booking Confirmed!", 3000));
        //     details.appendChild(bookingForm);
        // }

        if (isLoggedIn && !isCreator) {
            let placeType = placeData.category; // Get the place type

            const bookingForm = (placeType) => {
                if (placeType === "restaurant") {
                    // return showRestaurantBooking();
                    return showNormalBooking();
                } else if (placeType === "arena") {
                    // return showArenaBooking();
                    return showNormalBooking();
                } else {
                    return showNormalBooking();
                }
                // return null; // If the type is unknown, return nothing
            };

            const showNormalBooking = () => {
                return BookingForm(() => Snackbar("Restaurant Booking Confirmed!", 3000), "restaurant");
            };

            // const showRestaurantBooking = () => {
            //     return CalendarForm(() => Snackbar("Restaurant Booking Confirmed!", 3000), "restaurant");
            // };

            // // // const showArenaBooking = () => {
            // // //     return CalendarForm(() => Snackbar("Arena Booking Confirmed!", 3000), "arena");
            // // // };

            // // const showArenaBooking = async (placeId) => {
            // //     const form = await CalendarForm((bookingDetails) => {
            // //         Snackbar(`Arena Booking Confirmed for ${bookingDetails.date}!`, 3000);
            // //     }, placeId);

            // //     details.appendChild(form);
            // // };

            // const showArenaBooking = () => {
            //     return CalendarForm((bookingDetails) => Snackbar(`Arena Booking Confirmed for ${bookingDetails.date}!`, 3000), placeId);
            // };

            const form = bookingForm(placeType); // Call the function to get the correct form
            if (form) {
                // details.appendChild(form); // Append the form if it exists
            }
        }

        // Tabs
        const tabs = [
            // { title: "Home", id: "home-tab", render: (container) => displayPlaceHome(container, placeData, isCreator, isLoggedIn) },
            { title: "Menu", id: "menu-tab", render: (container) => RenderMenu(container, isCreator, placeId, isLoggedIn) },
            { title: "Gallery", id: "gallery-tab", render: (container) => displayMedia(container, "place", placeId, isLoggedIn) },
            { title: "Reviews", id: "reviews-tab", render: (container) => displayReviews(container, isCreator, isLoggedIn, "place", placeId) },
            { title: "Nearby", id: "nearby-tab", render: (container) => displayPlaceNearby(container, placeId) },
            { title: "Info", id: "info-tab", render: (container) => displayPlaceInfo(container, placeData, isCreator) },
        ];
        const tabContainer = createTabs(tabs);
        contentContainer.appendChild(tabContainer);
        // displayPlaceSections(contentContainer, placeData, isCreator, isLoggedIn);

        // const tabContainer = createTabs(tabs, "home-tab");
        // contentContainer.appendChild(tabContainer);
    } catch (error) {
        contentContainer.innerHTML = "";
        console.error(error);
        contentContainer.appendChild(createElement("h1", {}, [`Error loading place details: ${error.message}`]));
        Snackbar("Failed to load place details. Please try again later.", 3000);
    }
}

export function displayPlaceSections(contentContainer, placeData, isCreator, isLoggedIn) {
    contentContainer.innerHTML = ""; // Clear existing content

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
    const details = createElement("div", { id: "place-details", class: "detail-section hvflex" });
    renderPlaceDetails(isLoggedIn, details, placeData, isCreator);
    contentContainer.appendChild(details);

    // Booking Form (if not the creator)
    if (isLoggedIn && !isCreator) {
        const form = BookingForm(() => Snackbar("Booking Confirmed!", 3000));
        details.appendChild(form);
    }

    // Sections
    if (placeData.description) {
        const homeContainer = createElement("section", { class: ["place-section"] });
        displayPlaceHome(homeContainer, placeData, isCreator, isLoggedIn);
        contentContainer.appendChild(homeContainer);
    }

    if (placeData.menu?.length) {
        const menuContainer = createElement("section", { class: ["place-section"] });
        RenderMenu(menuContainer, isCreator, placeData.placeId, isLoggedIn);
        contentContainer.appendChild(menuContainer);
    }

    if (placeData.media?.length) {
        const galleryContainer = createElement("section", { class: ["place-section"] });
        displayMedia(galleryContainer, "place", placeData.placeId, isLoggedIn);
        contentContainer.appendChild(galleryContainer);
    }

    if (placeData.reviews?.length) {
        const reviewsContainer = createElement("section", { class: ["place-section"] });
        displayReviews(reviewsContainer, isCreator, isLoggedIn, "place", placeData.placeId);
        contentContainer.appendChild(reviewsContainer);
    }

    if (placeData.nearby?.length) {
        const nearbyContainer = createElement("section", { class: ["place-section"] });
        displayPlaceNearby(nearbyContainer, placeData.placeId);
        contentContainer.appendChild(nearbyContainer);
    }

    if (placeData.info) {
        const infoContainer = createElement("section", { class: ["place-section"] });
        displayPlaceInfo(infoContainer, placeData, isCreator);
        contentContainer.appendChild(infoContainer);
    }
}

export default displayPlace;
