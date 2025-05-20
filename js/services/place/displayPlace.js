import { state } from "../../state/state.js";
import { SRC_URL, apiFetch } from "../../api/api.js";
import { createElement } from "../../components/createElement.js";
import { renderPlaceDetails } from "./renderPlaceDetails.js";
import { displayMedia } from "../media/mediaService.js";
import Snackbar from "../../components/ui/Snackbar.mjs";
import RenderMenu from "../../components/ui/MenuRender.mjs";
import { displayReviews } from "../reviews/displayReviews.js";
import { createTabs } from "../../components/ui/createTabs.js";
import { displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";
import {
  displayPlaceMenu,
  displayPlaceRooms,
  displayPlaceFacilities,
  displayPlaceServices,
  displayPlaceProducts,
  displayPlaceExhibits,
  displayPlaceMembership,
  displayPlaceShows,
  displayPlaceEvents,
  displayPlaceDetailsFallback,
} from "./customTabs.js";

export default async function displayPlace(isLoggedIn, placeId, contentContainer) {
  if (!placeId || !contentContainer || !(contentContainer instanceof HTMLElement)) {
    console.error("Invalid arguments passed to displayPlace.");
    return;
  }

  try {
    const placeData = await apiFetch(`/places/place/${placeId}`);
    if (!placeData || typeof placeData !== "object") {
      throw new Error("Invalid place data received.");
    }

    const isCreator = isLoggedIn && state.user === placeData.createdBy;

    contentContainer.innerHTML = "";

    // ─── (Optional) Banner Section ──────────────────────────────────────────────
    // (You may uncomment this and style accordingly)
    //
    // const bannerURL = placeData.banner
    //   ? `${SRC_URL}/placepic/${placeData.banner}`
    //   : "default-banner.jpg";
    //
    // contentContainer.appendChild(
    //   createElement("div", { id: "place-banner" }, [
    //     createElement("img", {
    //       src: bannerURL,
    //       alt: placeData.name || "Place Banner",
    //       loading: "lazy",
    //     }),
    //   ])
    // );

    // ─── Creator Editable Details ───────────────────────────────────────────────
    if (isCreator) {
      const editSection = createElement("div", { class: "detail-section hvflex" });
      try {
        renderPlaceDetails(isLoggedIn, editSection, placeData, isCreator);
        contentContainer.appendChild(editSection);
      } catch (err) {
        console.warn("Failed to render edit section:", err);
      }
    }

    // ─── Tabs Setup ─────────────────────────────────────────────────────────────
    const tabs = [];

    // Always include Info tab
    tabs.push({
      title: "Info",
      id: "info-tab",
      render: (container) => {
        try {
          displayPlaceInfo(container, placeData, isCreator);
        } catch (err) {
          container.textContent = "Failed to load info.";
          console.warn("Info tab failed:", err);
        }
      },
    });

    const categoryRaw = placeData.category || "";
    const category = categoryRaw.trim().toLowerCase();

    // ─── Category-Specific Tabs ─────────────────────────────────────────────────
    if (category === "restaurant" || category === "café" || category === "cafe") {
      tabs.push({
        title: "Menu",
        id: "menu-tab",
        render: (container) => displayPlaceMenu(container, placeId, isCreator, isLoggedIn),
      });
    } else if (category === "hotel") {
      tabs.push({
        title: "Rooms",
        id: "rooms-tab",
        render: (container) => displayPlaceRooms(container),
      });
    } else if (category === "park") {
      tabs.push({
        title: "Facilities",
        id: "facilities-tab",
        render: (container) => displayPlaceFacilities(container),
      });
    } else if (category === "business") {
      tabs.push({
        title: "Services",
        id: "services-tab",
        render: (container) => displayPlaceServices(container),
      });
    } else if (category === "shop") {
      tabs.push({
        title: "Products",
        id: "products-tab",
        render: (container) => displayPlaceProducts(container),
      });
    } else if (category === "museum") {
      tabs.push({
        title: "Exhibits",
        id: "exhibits-tab",
        render: (container) => displayPlaceExhibits(container),
      });
    } else if (category === "gym") {
      tabs.push({
        title: "Membership",
        id: "membership-tab",
        render: (container) => displayPlaceMembership(container),
      });
    } else if (category === "theater") {
      tabs.push({
        title: "Shows",
        id: "shows-tab",
        render: (container) => displayPlaceShows(container),
      });
    } else if (category === "arena") {
      tabs.push({
        title: "Events",
        id: "events-tab",
        render: (container) => displayPlaceEvents(container),
      });
    } else {
      tabs.push({
        title: "Details",
        id: "details-tab",
        render: (container) => displayPlaceDetailsFallback(container, categoryRaw),
      });
    }

    // ─── Common Tabs ────────────────────────────────────────────────────────────
    tabs.push(
      {
        title: "Nearby",
        id: "nearby-tab",
        render: (container) => {
          try {
            displayPlaceNearby(container, placeId);
          } catch (err) {
            container.textContent = "Nearby places unavailable.";
            console.warn("Nearby tab failed:", err);
          }
        },
      },
      {
        title: "Gallery",
        id: "gallery-tab",
        render: (container) => {
          try {
            displayMedia(container, "place", placeId, isLoggedIn);
          } catch (err) {
            container.textContent = "Gallery could not load.";
            console.warn("Gallery tab failed:", err);
          }
        },
      },
      {
        title: "Reviews",
        id: "reviews-tab",
        render: (container) => {
          try {
            displayReviews(container, isCreator, isLoggedIn, "place", placeId);
          } catch (err) {
            container.textContent = "Reviews unavailable.";
            console.warn("Reviews tab failed:", err);
          }
        },
      }
    );

    // ─── Final Tab Rendering ────────────────────────────────────────────────────
    try {
      const tabsElement = createTabs(tabs);
      contentContainer.appendChild(tabsElement);
    } catch (err) {
      console.warn("Tabs component failed to initialize:", err);
    }

  } catch (err) {
    console.error("displayPlace error:", err);
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
// import Snackbar from "../../components/ui/Snackbar.mjs";
// import RenderMenu from "../../components/ui/MenuRender.mjs";
// import { displayReviews } from "../reviews/displayReviews.js";
// import { createTabs } from "../../components/ui/createTabs.js";
// import { displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";
// import { displayPlaceMenu, displayPlaceRooms, displayPlaceFacilities, displayPlaceServices, displayPlaceProducts, displayPlaceExhibits, displayPlaceMembership, displayPlaceShows, displayPlaceEvents, displayPlaceDetailsFallback } from "./customTabs.js";

// export default async function displayPlace(isLoggedIn, placeId, contentContainer) {
//   if (!placeId || !contentContainer || !(contentContainer instanceof HTMLElement)) {
//     console.error("Invalid arguments passed to displayPlace.");
//     return;
//   }

//   try {
//     const placeData = await apiFetch(`/places/place/${placeId}`);
//     if (!placeData || typeof placeData !== "object") {
//       throw new Error("Invalid place data received.");
//     }

//     const isCreator = isLoggedIn && state.user === placeData.createdBy;

//     // Clear container
//     contentContainer.innerHTML = "";

//     // ─── (Optional) Banner Section ──────────────────────────────────────────────
//     // You can uncomment and tweak if you have a banner field in placeData
//     //
//     // const bannerURL = placeData.banner
//     //   ? `${SRC_URL}/placepic/${placeData.banner}`
//     //   : "default-banner.jpg";
//     //
//     // const banner = createElement("div", { id: "place-banner" }, [
//     //   createElement("img", {
//     //     src: bannerURL,
//     //     alt: placeData.name || "Place Banner",
//     //     loading: "lazy",
//     //   }),
//     // ]);
//     // contentContainer.appendChild(banner);

//     // ─── Details Section ────────────────────────────────────────────────────────
//     if (isCreator) {
//       const editSection = createElement("div", { class: "detail-section hvflex" });
//       try {
//         renderPlaceDetails(isLoggedIn, editSection, placeData, isCreator);
//         contentContainer.appendChild(editSection);
//       } catch (err) {
//         console.warn("Failed to render edit section:", err);
//       }
//     }

//     // ─── Tabs Setup ──────────────────────────────────────────────────────────────
//     const tabs = [];

//     // Always include Info tab
//     tabs.push({
//       title: "Info",
//       id: "info-tab",
//       render: (container) => {
//         try {
//           displayPlaceInfo(container, placeData, isCreator);
//         } catch (err) {
//           container.textContent = "Failed to load info.";
//           console.warn("Info tab failed:", err);
//         }
//       },
//     });

//     // Determine category (normalize to lowercase)
//     const categoryRaw = placeData.category || "";
//     const category = categoryRaw.trim().toLowerCase();

//     // ─── Category-Specific Tabs ─────────────────────────────────────────────────

//     // 1) Restaurant or Café → Menu
//     if (category === "restaurant" || category === "café" || category === "cafe") {
//       tabs.push({
//         title: "Menu",
//         id: "menu-tab",
//         render: (container) => {
//           try {
//             RenderMenu(container, isCreator, placeId, isLoggedIn);
//           } catch (err) {
//             container.textContent = "Menu unavailable.";
//             console.warn("Menu tab failed:", err);
//           }
//         },
//       });
//     }
//     // 2) Hotel → Rooms
//     else if (category === "hotel") {
//       tabs.push({
//         title: "Rooms",
//         id: "rooms-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, ["Rooms section coming soon."])
//           );
//         },
//       });
//     }
//     // 3) Park → Facilities
//     else if (category === "park") {
//       tabs.push({
//         title: "Facilities",
//         id: "facilities-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, ["Park facilities coming soon."])
//           );
//         },
//       });
//     }
//     // 4) Business → Services
//     else if (category === "business") {
//       tabs.push({
//         title: "Services",
//         id: "services-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, ["Business services coming soon."])
//           );
//         },
//       });
//     }
//     // 5) Shop → Products
//     else if (category === "shop") {
//       tabs.push({
//         title: "Products",
//         id: "products-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, ["Shop products coming soon."])
//           );
//         },
//       });
//     }
//     // 6) Museum → Exhibits
//     else if (category === "museum") {
//       tabs.push({
//         title: "Exhibits",
//         id: "exhibits-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, ["Museum exhibits coming soon."])
//           );
//         },
//       });
//     }
//     // 7) Gym → Membership
//     else if (category === "gym") {
//       tabs.push({
//         title: "Membership",
//         id: "membership-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, ["Membership details coming soon."])
//           );
//         },
//       });
//     }
//     // 8) Theater → Shows
//     else if (category === "theater") {
//       tabs.push({
//         title: "Shows",
//         id: "shows-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, ["Upcoming shows coming soon."])
//           );
//         },
//       });
//     }
//     // 9) Arena → Events
//     else if (category === "arena") {
//       tabs.push({
//         title: "Events",
//         id: "events-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, ["Arena events coming soon."])
//           );
//         },
//       });
//     }
//     // 10) Café / Restaurant were already handled above
//     // 11) Other (fallback for unrecognized categories)
//     else {
//       tabs.push({
//         title: "Details",
//         id: "details-tab",
//         render: (container) => {
//           container.appendChild(
//             createElement("div", {}, [`No special section for "${categoryRaw}".`])
//           );
//         },
//       });
//     }

//     // ─── Tabs that always apply ──────────────────────────────────────────────────
//     tabs.push(
//       {
//         title: "Nearby",
//         id: "nearby-tab",
//         render: (container) => {
//           try {
//             displayPlaceNearby(container, placeId);
//           } catch (err) {
//             container.textContent = "Nearby places unavailable.";
//             console.warn("Nearby tab failed:", err);
//           }
//         },
//       },
//       {
//         title: "Gallery",
//         id: "gallery-tab",
//         render: (container) => {
//           try {
//             displayMedia(container, "place", placeId, isLoggedIn);
//           } catch (err) {
//             container.textContent = "Gallery could not load.";
//             console.warn("Gallery tab failed:", err);
//           }
//         },
//       },
//       {
//         title: "Reviews",
//         id: "reviews-tab",
//         render: (container) => {
//           try {
//             displayReviews(container, isCreator, isLoggedIn, "place", placeId);
//           } catch (err) {
//             container.textContent = "Reviews unavailable.";
//             console.warn("Reviews tab failed:", err);
//           }
//         },
//       }
//     );

//     // ─── Final Tabs Attach ──────────────────────────────────────────────────────
//     try {
//       const tabsElement = createTabs(tabs);
//       contentContainer.appendChild(tabsElement);
//     } catch (err) {
//       console.warn("Tabs component failed to initialize:", err);
//     }
//   } catch (err) {
//     console.error("displayPlace error:", err);
//     contentContainer.innerHTML = "";
//     contentContainer.appendChild(
//       createElement("h1", {}, [`Error loading place: ${err.message}`])
//     );
//     Snackbar("Failed to load place details. Please try again later.", 3000);
//   }
// }

// // import { state } from "../../state/state.js";
// // import { SRC_URL, apiFetch } from "../../api/api.js";
// // import { createElement } from "../../components/createElement.js";
// // import { renderPlaceDetails } from "./renderPlaceDetails.js";
// // import { displayMedia } from "../media/mediaService.js";
// // import Snackbar from "../../components/ui/Snackbar.mjs";
// // import RenderMenu from "../../components/ui/MenuRender.mjs";
// // import { displayReviews } from "../reviews/displayReviews.js";
// // import { createTabs } from "../../components/ui/createTabs.js";
// // import { displayPlaceNearby, displayPlaceInfo } from "./placeTabs.js";

// // export default async function displayPlace(isLoggedIn, placeId, contentContainer) {
// //   if (!placeId || !contentContainer || !(contentContainer instanceof HTMLElement)) {
// //     console.error("Invalid arguments passed to displayPlace.");
// //     return;
// //   }

// //   try {
// //     const placeData = await apiFetch(`/places/place/${placeId}`);
// //     if (!placeData || typeof placeData !== "object") throw new Error("Invalid place data received.");

// //     const isCreator = isLoggedIn && state.user === placeData.createdBy;

// //     // Clear container
// //     contentContainer.innerHTML = "";

// //     // ─── Banner Section ─────────────────────────────────────────────────────
// //     // const bannerURL = placeData.banner
// //     //   ? `${SRC_URL}/placepic/${placeData.banner}`
// //     //   : "default-banner.jpg";

// //     // const banner = createElement("div", { id: "place-banner" }, [
// //     //   createElement("img", {
// //     //     src: bannerURL,
// //     //     alt: placeData.name || "Place Banner",
// //     //     loading: "lazy",
// //     //   }),
// //     // ]);
// //     // contentContainer.appendChild(banner);

// //     // ─── Details Section ─────────────────────────────────────────────────────

// //     if (isCreator) {
// //       const editSection = createElement("div", { class: "detail-section hvflex" });
// //       try {
// //         renderPlaceDetails(isLoggedIn, editSection, placeData, isCreator);
// //         contentContainer.appendChild(editSection);
// //       } catch (err) {
// //         console.warn("Failed to render edit section:", err);
// //       }
// //     }

// //     // ─── Tabs Setup ──────────────────────────────────────────────────────────
// //     const tabs = [];

// //     // Info Tab
// //     tabs.push({
// //       title: "Info",
// //       id: "info-tab",
// //       render: (container) => {
// //         try {
// //           displayPlaceInfo(container, placeData, isCreator);
// //         } catch (err) {
// //           container.textContent = "Failed to load info.";
// //           console.warn("Info tab failed:", err);
// //         }
// //       },
// //     });

// //     // Category Tabs
// //     const category = placeData.category?.toLowerCase() || "";
// //     if (["restaurant", "cafe"].includes(category)) {
// //       tabs.push({
// //         title: "Menu",
// //         id: "menu-tab",
// //         render: (container) => {
// //           try {
// //             RenderMenu(container, isCreator, placeId, isLoggedIn);
// //           } catch (err) {
// //             container.textContent = "Menu unavailable.";
// //             console.warn("Menu tab failed:", err);
// //           }
// //         },
// //       });
// //     } else if (category === "hotel") {
// //       tabs.push({
// //         title: "Rooms",
// //         id: "rooms-tab",
// //         render: (container) =>
// //           container.appendChild(createElement("div", {}, ["Rooms section coming soon."])),
// //       });
// //     } else if (category === "gym") {
// //       tabs.push({
// //         title: "Membership",
// //         id: "membership-tab",
// //         render: (container) =>
// //           container.appendChild(createElement("div", {}, ["Membership details coming soon."])),
// //       });
// //     }

// //     // Always-on Tabs
// //     tabs.push(
// //       {
// //         title: "Nearby",
// //         id: "nearby-tab",
// //         render: (container) => {
// //           try {
// //             displayPlaceNearby(container, placeId);
// //           } catch (err) {
// //             container.textContent = "Nearby places unavailable.";
// //             console.warn("Nearby tab failed:", err);
// //           }
// //         },
// //       },
// //       {
// //         title: "Gallery",
// //         id: "gallery-tab",
// //         render: (container) => {
// //           try {
// //             displayMedia(container, "place", placeId, isLoggedIn);
// //           } catch (err) {
// //             container.textContent = "Gallery could not load.";
// //             console.warn("Gallery tab failed:", err);
// //           }
// //         },
// //       },
// //       {
// //         title: "Reviews",
// //         id: "reviews-tab",
// //         render: (container) => {
// //           try {
// //             displayReviews(container, isCreator, isLoggedIn, "place", placeId);
// //           } catch (err) {
// //             container.textContent = "Reviews unavailable.";
// //             console.warn("Reviews tab failed:", err);
// //           }
// //         },
// //       }
// //     );

// //     // ─── Final Tabs Attach ──────────────────────────────────────────────────
// //     try {
// //       const tabsElement = createTabs(tabs);
// //       contentContainer.appendChild(tabsElement);
// //     } catch (err) {
// //       console.warn("Tabs component failed to initialize:", err);
// //     }

// //   } catch (err) {
// //     console.error("displayPlace error:", err);
// //     contentContainer.innerHTML = "";
// //     contentContainer.appendChild(
// //       createElement("h1", {}, [`Error loading place: ${err.message}`])
// //     );
// //     Snackbar("Failed to load place details. Please try again later.", 3000);
// //   }
// // }
