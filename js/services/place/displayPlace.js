import { state } from "../../state/state.js";
import { SRC_URL, apiFetch } from "../../api/api.js";
import { createElement } from "../../components/createElement.js";
import { renderPlaceDetails } from "./renderPlaceDetails.js";
import { displayMedia } from "../media/mediaService.js";
// import BookingForm from "../../components/ui/BookingForm.mjs";
// import BookingManagerUI from "../../components/ui/BookingManagerUI.mjs";
import Snackbar from "../../components/ui/Snackbar.mjs";
// import RenderMenu from "../../components/ui/MenuRender.mjs";
import { displayReviews } from "../reviews/displayReviews.js";
import { createTabs } from "../../components/ui/createTabs.js";
import { displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";

// Importing the renderPlace function from the grouped render file
import { renderPlace } from "./renders/renderPlace.js";

export default async function displayPlace(isLoggedIn, placeId, contentContainer) {
  try {
    const placeData = await apiFetch(`/places/place/${placeId}`);
    const isCreator = isLoggedIn && state.user === placeData.createdBy;

    // Clear container
    contentContainer.innerHTML = "";

    // Banner
    const banner = createElement("div", { id: "place-banner" }, [
      createElement("img", {
        src: placeData.banner
          ? `${SRC_URL}/placepic/${placeData.banner}`
          : "default-banner.jpg",
        alt: placeData.name,
        loading: "lazy",
      }),
    ]);
    contentContainer.appendChild(banner);

    // Details container
    const details = createElement("div", { class: "detail-section hvflex" });
    contentContainer.appendChild(details);

    // If creator, show editable details
    if (isCreator) {
      const editableDetails = createElement("div", { class: "detail-section hvflex" });
      renderPlaceDetails(isLoggedIn, editableDetails, placeData, isCreator);
      contentContainer.appendChild(editableDetails);
    }

    // Render category-specific info using the updated renderPlace function
    renderPlace(placeData, details, isCreator);

    // // If logged in & not creator → booking form
    // if (isLoggedIn && !isCreator) {
    //   const bookingForm = BookingForm(() => Snackbar("Booking Confirmed!", 3000));
    //   details.appendChild(bookingForm);
    // }

    // Tabs: Menu, Gallery, Reviews, Nearby, Info
    const tabs = [
      // {
      //   title: "Menu",
      //   id: "menu-tab",
      //   render: (c) => RenderMenu(c, isCreator, placeId, isLoggedIn),
      // },
      {
        title: "Info",
        id: "info-tab",
        render: (c) => displayPlaceInfo(c, placeData, isCreator),
      },
      {
        title: "Nearby",
        id: "nearby-tab",
        render: (c) => displayPlaceNearby(c, placeId),
      },
      {
        title: "Gallery",
        id: "gallery-tab",
        render: (c) => displayMedia(c, "place", placeId, isLoggedIn),
      },
      {
        title: "Reviews",
        id: "reviews-tab",
        render: (c) => displayReviews(c, isCreator, isLoggedIn, "place", placeId),
      },
    ];
    const tabContainer = createTabs(tabs);
    contentContainer.appendChild(tabContainer);
  } catch (error) {
    contentContainer.innerHTML = "";
    console.error(error);
    contentContainer.appendChild(
      createElement("h1", {}, [`Error loading place details: ${error.message}`])
    );
    Snackbar("Failed to load place details. Please try again later.", 3000);
  }
}

// import { state } from "../../state/state.js";
// import { SRC_URL, apiFetch } from "../../api/api.js";
// import { createElement } from "../../components/createElement.js";
// import { renderPlaceDetails } from "./renderPlaceDetails.js";
// import { displayMedia } from "../media/mediaService.js";
// import BookingForm from "../../components/ui/BookingForm.mjs";
// import BookingManagerUI from "../../components/ui/BookingManagerUI.mjs";
// import Snackbar from "../../components/ui/Snackbar.mjs";
// import RenderMenu from "../../components/ui/MenuRender.mjs";
// import { displayReviews } from "../reviews/displayReviews.js";
// import { createTabs } from "../../components/ui/createTabs.js";
// import { displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";

// import { renderArena } from "./renders/renderArena.js";
// import { renderRestaurant } from "./renders/renderRestaurant.js";
// import { renderPark } from "./renders/renderPark.js";
// import { renderBusiness } from "./renders/renderBusiness.js";
// import { renderShop } from "./renders/renderShop.js";
// import { renderDefault } from "./renders/renderDefault.js";

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

//     // Render category-specific info
//     switch ((placeData.category || "").toLowerCase()) {
//       case "arena":
//         renderArena(placeData, details, isCreator);
//         break;
//       case "restaurant":
//         renderRestaurant(placeData, details, isCreator);
//         break;
//       case "park":
//         renderPark(placeData, details, isCreator);
//         break;
//       case "business":
//         renderBusiness(placeData, details, isCreator);
//         break;
//       case "shop":
//         renderShop(placeData, details, isCreator);
//         break;
//       default:
//         renderDefault(placeData, details, isCreator);
//     }

//     // If logged in & not creator → booking form
//     if (isLoggedIn && !isCreator) {
//       const bookingForm = BookingForm(() => Snackbar("Booking Confirmed!", 3000));
//       details.appendChild(bookingForm);
//     }

//     // // If creator → booking-slot manager
//     // if (isCreator) {
//     //   const slotState = [];
//     //   const addSlotHandler = ({ time, capacity }) => {
//     //     if (slotState.some((s) => s.time === time)) return false;
//     //     slotState.push({ time, capacity });
//     //     return [...slotState];
//     //   };
//     //   const managerUI = BookingManagerUI(addSlotHandler);
//     //   details.appendChild(managerUI);
//     // }

//     // Tabs: Menu, Gallery, Reviews, Nearby, Info
//     const tabs = [
//       {
//         title: "Menu",
//         id: "menu-tab",
//         render: (c) => RenderMenu(c, isCreator, placeId, isLoggedIn),
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
//       {
//         title: "Nearby",
//         id: "nearby-tab",
//         render: (c) => displayPlaceNearby(c, placeId),
//       },
//       {
//         title: "Info",
//         id: "info-tab",
//         render: (c) => displayPlaceInfo(c, placeData, isCreator),
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
