import { state } from "../../state/state.js";
import { SRC_URL, apiFetch } from "../../api/api.js";
import { createElement } from "../../components/createElement.js";
import { renderPlaceDetails } from "./renderPlaceDetails.js";
import { displayMedia } from "../media/mediaService.js";
import BookingForm from "../../components/ui/BookingForm.mjs";
import BoookingForm from "../../components/ui/BoookingForm.mjs";
import CalendarForm from "../../components/ui/CalendarForm.mjs";
import Snackbar from "../../components/ui/Snackbar.mjs";
import RenderMenu from "../../components/ui/MenuRender.mjs";
import { displayReviews } from "../reviews/displayReviews.js";
import { createTabs } from "../../components/ui/createTabs.js";
import { displayPlaceHome, displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";

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
        const details = createElement("div", { id: "place-details", class: "detail-section hvflex" });
        renderPlaceDetails(isLoggedIn, details, placeData, isCreator);
        contentContainer.appendChild(details);

        // if (isLoggedIn && !isCreator) {
        //     const bookingForm = BookingForm(() => Snackbar("Booking Confirmed!", 3000));
        //     details.appendChild(bookingForm);
        // }

        if (isLoggedIn && !isCreator) {
            let placeType = placeData.category; // Get the place type

            const bookingForm = (placeType) => {
                if (placeType === "restaurant") {
                    return showRestaurantBooking();
                } else if (placeType === "arena") {
                    return showArenaBooking();
                } else {
                    return showNormalBooking();
                }
                // return null; // If the type is unknown, return nothing
            };

            const showNormalBooking = () => {
                return BookingForm(() => Snackbar("Restaurant Booking Confirmed!", 3000), "restaurant");
            };

            const showRestaurantBooking = () => {
                return CalendarForm(() => Snackbar("Restaurant Booking Confirmed!", 3000), "restaurant");
            };

            // // const showArenaBooking = () => {
            // //     return CalendarForm(() => Snackbar("Arena Booking Confirmed!", 3000), "arena");
            // // };

            // const showArenaBooking = async (placeId) => {
            //     const form = await CalendarForm((bookingDetails) => {
            //         Snackbar(`Arena Booking Confirmed for ${bookingDetails.date}!`, 3000);
            //     }, placeId);

            //     details.appendChild(form);
            // };

            const showArenaBooking = () => {
                return CalendarForm((bookingDetails) => Snackbar(`Arena Booking Confirmed for ${bookingDetails.date}!`, 3000), placeId);
            };

            const form = bookingForm(placeType); // Call the function to get the correct form
            if (form) {
                details.appendChild(form); // Append the form if it exists
            }
        }


        let container = document.createElement('div');
        contentContainer.appendChild(container);

        // Tabs
        const tabs = [
            { title: "Home", id: "home-tab", render: (container) => displayPlaceHome(container, placeData, isCreator, isLoggedIn) },
            { title: "Menu", id: "menu-tab", render: (container) => RenderMenu(container, isCreator, placeId, isLoggedIn) },
            { title: "Gallery", id: "gallery-tab", render: (container) => displayMedia(container, "place", placeId, isLoggedIn) },
            { title: "Reviews", id: "reviews-tab", render: (container) => displayReviews(container, isCreator, isLoggedIn, "place", placeId) },
            { title: "Nearby", id: "nearby-tab", render: (container) => displayPlaceNearby(container, placeId) },
            { title: "Info", id: "info-tab", render: (container) => displayPlaceInfo(container, placeData, isCreator) },
        ];
        const tabContainer = createTabs(tabs);
        contentContainer.appendChild(tabContainer);

        // const tabContainer = createTabs(tabs, "home-tab");
        // contentContainer.appendChild(tabContainer);
    } catch (error) {
        contentContainer.innerHTML = "";
        console.error(error);
        contentContainer.appendChild(createElement("h1", {}, [`Error loading place details: ${error.message}`]));
        Snackbar("Failed to load place details. Please try again later.", 3000);
    }
}


export default displayPlace;
