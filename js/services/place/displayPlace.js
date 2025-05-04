import { state } from "../../state/state.js";
import { SRC_URL, apiFetch } from "../../api/api.js";
import { createElement } from "../../components/createElement.js";
import { renderPlaceDetails } from "./renderPlaceDetails.js";
import { displayMedia } from "../media/mediaService.js";
import BookingForm from "../../components/ui/BookinggForm.mjs";
import Snackbar from "../../components/ui/Snackbar.mjs";
import RenderMenu from "../../components/ui/MenuRender.mjs";
import { displayReviews } from "../reviews/displayReviews.js";
import { createTabs } from "../../components/ui/createTabs.js";
import { displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";
import { renderPlace } from "./renders/renderPlace.js";

export default async function displayPlace(isLoggedIn, placeId, contentContainer) {
  try {
    const placeData = await apiFetch(`/places/place/${placeId}`);
    const isCreator = isLoggedIn && state.user === placeData.createdBy;

    // Reset the container
    contentContainer.innerHTML = "";

    // ─── Banner ────────────────────────────────────────────────────────────────
    contentContainer.appendChild(
      createElement("div", { id: "place-banner" }, [
        createElement("img", {
          src: placeData.banner
            ? `${SRC_URL}/placepic/${placeData.banner}`
            : "default-banner.jpg",
          alt: placeData.name,
          loading: "lazy",
        }),
      ])
    );

    // ─── Details Section ────────────────────────────────────────────────────────
    const detailsSection = createElement("div", { class: "detail-section hvflex" });
    contentContainer.appendChild(detailsSection);

    if (isCreator) {
      const editSection = createElement("div", { class: "detail-section hvflex" });
      renderPlaceDetails(isLoggedIn, editSection, placeData, isCreator);
      contentContainer.appendChild(editSection);
    }

    // Category‐specific rendering (e.g., a restaurant’s specials)
    renderPlace(placeData, detailsSection, isCreator, isLoggedIn, placeId);

    // Booking form for logged‐in non‐creators
    if (isLoggedIn && !isCreator) {
      const bookingWidget = BookingForm(() => Snackbar("Booking confirmed!", 3000));
      detailsSection.appendChild(bookingWidget);
    }

    // ─── Tabs Setup ─────────────────────────────────────────────────────────────
    const tabs = [
      {
        title: "Info",
        id: "info-tab",
        render: (container) => displayPlaceInfo(container, placeData, isCreator),
      },
    ];

    const category = placeData.category?.toLowerCase() ?? "";

    // Category-specific tabs
    if (["restaurant", "cafe"].includes(category)) {
      tabs.push({
        title: "Menu",
        id: "menu-tab",
        render: (container) =>
          RenderMenu(container, isCreator, placeId, isLoggedIn),
      });
    } else if (category === "hotel") {
      tabs.push({
        title: "Rooms",
        id: "rooms-tab",
        render: (container) => {
          // TODO: Swap in your real room‐listing component
          container.appendChild(
            createElement("div", {}, ["Rooms section coming soon."])
          );
        },
      });
    } else if (category === "gym") {
      tabs.push({
        title: "Membership",
        id: "membership-tab",
        render: (container) => {
          // TODO: Swap in your real membership component
          container.appendChild(
            createElement("div", {}, ["Membership details coming soon."])
          );
        },
      });
    }

    // Always-on tabs
    tabs.push(
      {
        title: "Nearby",
        id: "nearby-tab",
        render: (container) => displayPlaceNearby(container, placeId),
      },
      {
        title: "Gallery",
        id: "gallery-tab",
        render: (container) =>
          displayMedia(container, "place", placeId, isLoggedIn),
      },
      {
        title: "Reviews",
        id: "reviews-tab",
        render: (container) =>
          displayReviews(container, isCreator, isLoggedIn, "place", placeId),
      }
    );

    // Render and attach the tab interface
    const tabsElement = createTabs(tabs);
    contentContainer.appendChild(tabsElement);

  } catch (err) {
    console.error(err);
    contentContainer.innerHTML = "";
    contentContainer.appendChild(
      createElement("h1", {}, [`Error loading place: ${err.message}`])
    );
    Snackbar("Failed to load place details. Please try again later.", 3000);
  }
}


// import { state } from "../../state/state.js";
// import { SRC_URL, apiFetch } from "../../api/api.js";
// import { createElement } from "../../components/createElement.js";
// import { renderPlaceDetails } from "./renderPlaceDetails.js";
// import { displayMedia } from "../media/mediaService.js";
// import BookingForm from "../../components/ui/BookinggForm.mjs";
// import Snackbar from "../../components/ui/Snackbar.mjs";
// import RenderMenu from "../../components/ui/MenuRender.mjs";
// import { displayReviews } from "../reviews/displayReviews.js";
// import { createTabs } from "../../components/ui/createTabs.js";
// import { displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";

// // Importing the renderPlace function from the grouped render file
// import { renderPlace } from "./renders/renderPlace.js";

// export default async function displayPlace(isLoggedIn, placeId, contentContainer) {
//   try {
//     const placeData = await apiFetch(`/places/place/${placeId}`);
//     const isCreator = isLoggedIn && state.user === placeData.createdBy;

//     // Clear container
//     contentContainer.innerHTML = "";

//     // Banner
//     const banner = createElement("div", { id: "place-banner" }, [
//       createElement("img", {
//         src: placeData.banner
//           ? `${SRC_URL}/placepic/${placeData.banner}`
//           : "default-banner.jpg",
//         alt: placeData.name,
//         loading: "lazy",
//       }),
//     ]);
//     contentContainer.appendChild(banner);

//     // Details container
//     const details = createElement("div", { class: "detail-section hvflex" });
//     contentContainer.appendChild(details);

//     // If creator, show editable details
//     if (isCreator) {
//       const editableDetails = createElement("div", { class: "detail-section hvflex" });
//       renderPlaceDetails(isLoggedIn, editableDetails, placeData, isCreator);
//       contentContainer.appendChild(editableDetails);
//     }

//     // Render category-specific info using the updated renderPlace function
//     renderPlace(placeData, details, isCreator, isLoggedIn, placeId);

//     // If logged in & not creator → booking form
//     if (isLoggedIn && !isCreator) {
//       const bookingForm = BookingForm(() => Snackbar("Booking Confirmed!", 3000));
//       details.appendChild(bookingForm);
//     }

//     /************* */
//     // Tabs: Menu, Gallery, Reviews, Nearby, Info
//     const tabs = [
//       {
//         title: "Info",
//         id: "info-tab",
//         render: (c) => displayPlaceInfo(c, placeData, isCreator),
//       },
//       {
//         title: "Menu",
//         id: "menu-tab",
//         render: (c) => RenderMenu(c, isCreator, placeId, isLoggedIn),
//       },
//       {
//         title: "Nearby",
//         id: "nearby-tab",
//         render: (c) => displayPlaceNearby(c, placeId),
//       },
//       {
//         title: "Gallery",
//         id: "gallery-tab",
//         render: (c) => displayMedia(c, "place", placeId, isLoggedIn),
//       },
//       {
//         title: "Reviews",
//         id: "reviews-tab",
//         render: (c) => displayReviews(c, isCreator, isLoggedIn, "place", placeId),
//       },
//     ];
//     const tabContainer = createTabs(tabs);
//     contentContainer.appendChild(tabContainer);
//   } catch (error) {
//     contentContainer.innerHTML = "";
//     console.error(error);
//     contentContainer.appendChild(
//       createElement("h1", {}, [`Error loading place details: ${error.message}`])
//     );
//     Snackbar("Failed to load place details. Please try again later.", 3000);
//   }
// }
