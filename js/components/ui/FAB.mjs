import "../../../css/ui/FAB.css";
import { createNavItem, createProfileDropdown } from "../navigation.js";
import { navigate } from "../../routes/index.js";

/** Floating Action Button (FAB) */
const FloatingActionButton = (icon, id, isLoggedIn, user) => {
    if (document.getElementById(id)) return;

    const fabContainer = document.createElement("div");
    fabContainer.className = "fab-container";

    const fab = document.createElement("button");
    fab.id = id;
    fab.className = "fab";
    fab.innerHTML = icon;

    const actionContainer = document.createElement("div");
    actionContainer.className = "fab-actions hidden";

    // Generate Navigation for FAB
    createFabNav(actionContainer, isLoggedIn, user);

    let isDragging = false; // Track if dragging is happening

    // Click event for FAB (only if NOT dragging)
    fab.addEventListener("click", (e) => {
        if (!isDragging) {
            e.stopPropagation();
            actionContainer.classList.toggle("hidden");
        }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!fabContainer.contains(e.target)) {
            actionContainer.classList.add("hidden");
        }
    });

    // Append elements
    fabContainer.appendChild(actionContainer);
    fabContainer.appendChild(fab);
    document.getElementById("app").appendChild(fabContainer);

    // // Make FAB draggable without triggering the menu
    // makeDraggable(fabContainer, id);
};

export default FloatingActionButton;
export { FloatingActionButton };

/** FAB Navigation Menu */
const createFabNav = (actionContainer, isLoggedIn, user) => {
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");

    const navItems = [
        { href: "/events", label: "Events" },
        { href: "/places", label: "Places" },
        { href: "/feed", label: "Feed" },
        { href: "/search", label: "Search" },
        { href: "/create-event", label: "Eva" },
        { href: "/create-place", label: "Loca" },
    ];

    const fragment = document.createDocumentFragment();
    navItems.forEach((item) => fragment.appendChild(createNavItem(item.href, item.label)));

    if (isLoggedIn) {
        fragment.appendChild(createProfileDropdown(user));
    } else {
        const loginLi = document.createElement("li");
        const loginButton = document.createElement("button");
        loginButton.className = "btn auth-btn nav-link";
        loginButton.textContent = "Login";
        loginButton.addEventListener("click", () => navigate("/login"));
        loginLi.appendChild(loginButton);
        fragment.appendChild(loginLi);
    }

    ul.appendChild(fragment);
    nav.appendChild(ul);
    actionContainer.appendChild(nav);
};
