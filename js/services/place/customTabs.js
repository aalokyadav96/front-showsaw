import { createElement } from "../../components/createElement.js";
import RenderMenu from "../../components/ui/MenuRender.mjs";
import Button from "../../components/base/Button.js";

// 🍽️ Restaurant / Café → Menu
async function displayPlaceMenu(container, placeId, isCreator, isLoggedIn) {
    container.innerHTML = "";
    try {
        await RenderMenu(container, isCreator, placeId, isLoggedIn);
    } catch (err) {
        container.appendChild(
            createElement("div", { class: "tab-section error" }, [
                createElement("p", {}, ["Menu unavailable."]),
            ])
        );
        console.warn("Menu tab failed:", err);
    }
}

// 🏨 Hotel → Rooms
async function displayPlaceRooms(container) {
    container.innerHTML = "";

    const roomList = [
        { name: "Deluxe Room", capacity: 2, price: "$120/night" },
        { name: "Suite", capacity: 4, price: "$220/night" },
    ];

    container.appendChild(
        createElement("h3", {}, ["Available Rooms"])
    );

    const roomSection = createElement("div", { class: "room-section vflex" },
        roomList.map((room) =>
            createElement("div", { class: "room-item" }, [
                createElement("h4", {}, [room.name]),
                createElement("p", {}, [`Capacity: ${room.capacity}`]),
                createElement("p", {}, [`Price: ${room.price}`]),
                Button("Book Now", `book-${room.name.toLowerCase()}`, {
                    click: () => alert(`Booking for ${room.name}`),
                }),
            ])
        )
    );

    container.appendChild(roomSection);
}

// 🌳 Park → Facilities
async function displayPlaceFacilities(container) {
    container.innerHTML = "";

    const facilities = ["Playground", "Walking Trails", "Restrooms", "Picnic Areas"];

    container.appendChild(
        createElement("h3", {}, ["Park Facilities"])
    );

    container.appendChild(
        createElement("ul", { class: "facility-list" },
            facilities.map((f) => createElement("li", {}, [f]))
        )
    );
}

// 🏢 Business → Services
async function displayPlaceServices(container) {
    container.innerHTML = "";

    const services = ["Consulting", "Customer Support", "Technical Maintenance"];

    container.appendChild(
        createElement("h3", {}, ["Business Services"])
    );

    container.appendChild(
        createElement("ul", { class: "service-list" },
            services.map((s) => createElement("li", {}, [s]))
        )
    );
}

// 🛍️ Shop → Products
async function displayPlaceProducts(container) {
    container.innerHTML = "";

    const products = [
        { name: "Handmade Mug", price: "$15" },
        { name: "Local Honey", price: "$10" },
    ];

    container.appendChild(
        createElement("h3", {}, ["Products"])
    );

    const productSection = createElement("div", { class: "product-section" },
        products.map((item) =>
            createElement("div", { class: "product-item" }, [
                createElement("h4", {}, [item.name]),
                createElement("p", {}, [`Price: ${item.price}`]),
                Button("Buy", `buy-${item.name.toLowerCase().replace(/\s/g, "-")}`, {
                    click: () => alert(`Buying ${item.name}`),
                }),
            ])
        )
    );

    container.appendChild(productSection);
}

// 🖼️ Museum → Exhibits
async function displayPlaceExhibits(container) {
    container.innerHTML = "";

    const exhibits = [
        { title: "Ancient Artifacts", desc: "Items from 500 BC" },
        { title: "Modern Sculpture", desc: "20th century collections" },
    ];

    container.appendChild(
        createElement("h3", {}, ["Exhibits"])
    );

    container.appendChild(
        createElement("div", { class: "exhibit-section" },
            exhibits.map((ex) =>
                createElement("div", { class: "exhibit-item" }, [
                    createElement("h4", {}, [ex.title]),
                    createElement("p", {}, [ex.desc]),
                ])
            )
        )
    );
}

// 🏋️ Gym → Membership
async function displayPlaceMembership(container) {
    container.innerHTML = "";

    const plans = [
        { name: "Monthly", price: "$30" },
        { name: "Annual", price: "$300" },
    ];

    container.appendChild(
        createElement("h3", {}, ["Membership Plans"])
    );

    const planSection = createElement("div", { class: "membership-section" },
        plans.map((plan) =>
            createElement("div", { class: "plan-item" }, [
                createElement("h4", {}, [plan.name]),
                createElement("p", {}, [`Price: ${plan.price}`]),
                Button("Join", `join-${plan.name.toLowerCase()}`, {
                    click: () => alert(`Joining ${plan.name} plan`),
                }),
            ])
        )
    );

    container.appendChild(planSection);
}

// 🎭 Theater → Shows
async function displayPlaceShows(container) {
    container.innerHTML = "";

    const shows = [
        { title: "Hamlet", time: "7:00 PM", date: "2025-06-15" },
        { title: "Macbeth", time: "9:00 PM", date: "2025-06-16" },
    ];

    container.appendChild(
        createElement("h3", {}, ["Upcoming Shows"])
    );

    container.appendChild(
        createElement("div", { class: "show-section" },
            shows.map((show) =>
                createElement("div", { class: "show-item" }, [
                    createElement("h4", {}, [show.title]),
                    createElement("p", {}, [`Date: ${show.date}`]),
                    createElement("p", {}, [`Time: ${show.time}`]),
                    Button("Book Seat", `book-${show.title.toLowerCase()}`, {
                        click: () => alert(`Booking for ${show.title}`),
                    }),
                ])
            )
        )
    );
}

// 🏟️ Arena → Events
async function displayPlaceEvents(container) {
    container.innerHTML = "";

    const events = [
        { name: "Rock Concert", date: "2025-07-10" },
        { name: "Sports Finals", date: "2025-07-20" },
    ];

    container.appendChild(
        createElement("h3", {}, ["Arena Events"])
    );

    container.appendChild(
        createElement("div", { class: "event-section" },
            events.map((e) =>
                createElement("div", { class: "event-item" }, [
                    createElement("h4", {}, [e.name]),
                    createElement("p", {}, [`Date: ${e.date}`]),
                    Button("View", `view-${e.name.toLowerCase()}`, {
                        click: () => alert(`Viewing details for ${e.name}`),
                    }),
                ])
            )
        )
    );
}

// ❓ Other / Unknown → Fallback
async function displayPlaceDetailsFallback(container, categoryRaw) {
    container.innerHTML = "";

    container.appendChild(
        createElement("div", { class: "fallback-message" }, [
            createElement("p", {}, [`No special section for "${categoryRaw}".`]),
        ])
    );
}

export { displayPlaceMenu, displayPlaceRooms, displayPlaceFacilities, displayPlaceServices, displayPlaceProducts, displayPlaceExhibits, displayPlaceMembership, displayPlaceShows, displayPlaceEvents, displayPlaceDetailsFallback };