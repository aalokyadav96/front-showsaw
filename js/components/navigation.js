// Navigation Component
import "../../css/navigation.css";
import { SRC_URL, state } from "../state/state.js";
import { navigate } from "../routes/index.js";
// import { logout } from "../services/auth/authService.js";

/** Utility Functions */
const toggleElement = (selector, className) => document.querySelector(selector)?.classList.toggle(className);
const closeElement = (selector, className) => document.querySelector(selector)?.classList.remove(className);

const handleNavigation = (event, href) => {
    event.preventDefault();
    if (!href) return console.error("🚨 handleNavigation received null href!");
    console.log("handleNavigation called with href:", href);
    navigate(href);
};

/** Dropdown Component */
const createDropdown = (id, label, links) => {
    const dropdown = document.createElement("li");
    dropdown.className = "dropdown";

    const button = document.createElement("button");
    button.className = "dropdown-toggle";
    button.id = id;
    button.setAttribute("aria-haspopup", "true");
    button.setAttribute("aria-expanded", "false");
    button.textContent = label;

    const menu = document.createElement("div");
    menu.className = "dropdown-menu";
    menu.setAttribute("aria-label", `${label} Menu`);

    links.forEach(({ href, text }) => {
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.className = "dropdown-item nav-link";
        anchor.textContent = text;
        anchor.addEventListener("click", (e) => handleNavigation(e, href));
        menu.appendChild(anchor);
    });

    dropdown.appendChild(button);
    dropdown.appendChild(menu);
    return dropdown;
};

/** Navigation Item */
const createNavItem = (href, label) => {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.className = "nav-link";
    anchor.textContent = label;
    anchor.addEventListener("click", (e) => handleNavigation(e, href));
    li.appendChild(anchor);
    return li;
};

/** Profile Dropdown */
const createProfileDropdown = (user) => {
    const dropdown = document.createElement("li");
    dropdown.className = "dropdown";

    const toggle = document.createElement("div");
    toggle.className = "profile-dropdown-toggle";
    toggle.tabIndex = 0;

    const image = document.createElement("img");
    image.src = `${SRC_URL}/userpic/thumb/${user || "default"}.jpg`;
    image.alt = "Profile Picture";
    image.className = "profile-image";

    toggle.appendChild(image);

    const menu = document.createElement("div");
    menu.className = "profile-dropdown-menu";

    const links = [{ href: "/profile", text: "Profile" }];
    links.forEach(({ href, text }) => {
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.className = "dropdown-item nav-link";
        anchor.textContent = text;
        anchor.addEventListener("click", (e) => handleNavigation(e, href));
        menu.appendChild(anchor);
    });

    // // Logout Button
    // const logoutButton = document.createElement("button");
    // logoutButton.className = "dropdown-item logout-btn";
    // logoutButton.textContent = "Logout";
    // logoutButton.addEventListener("click", async () => await logout());
    // menu.appendChild(logoutButton);

    dropdown.appendChild(toggle);
    dropdown.appendChild(menu);
    return dropdown;
};

/** Navigation Bar */
const createNav = () => {
    const isLoggedIn = Boolean(state.token);
    const navItems = [
        { href: "/events", label: "Events" },
        { href: "/places", label: "Places" },
        { href: "/feed", label: "Feed" },
        { href: "/search", label: "Search" },
    ];

    // Create Elements
    const header = document.createElement("header");
    header.className = "navbar";

    const navbarContainer = document.createElement("div");
    navbarContainer.className = "navbar-container";

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";

    const logoLink = document.createElement("a");
    logoLink.href = "/";
    logoLink.className = "logo-link";
    logoLink.textContent = "Zincate";
    logoDiv.appendChild(logoLink);

    const nav = document.createElement("nav");
    nav.className = "nav-menu";

    const ul = document.createElement("ul");
    ul.className = "nav-list";

    // Append Navigation Items
    const fragment = document.createDocumentFragment();
    navItems.forEach((item) => fragment.appendChild(createNavItem(item.href, item.label)));

    // Create Dropdown
    fragment.appendChild(createDropdown("create-menu", "Create", [
        { href: "/create-event", text: "Eva" },
        { href: "/create-place", text: "Loca" },
    ]));

    // Add Profile Dropdown or Login Button
    if (isLoggedIn) {
        fragment.appendChild(createProfileDropdown(state.user));
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

    // Mobile Menu
    const mobileMenu = document.createElement("div");
    mobileMenu.className = "mobile-menu-icon";
    mobileMenu.innerHTML = "M";
    mobileMenu.addEventListener("click", () => {
        const isExpanded = mobileMenu.getAttribute("aria-expanded") === "true";
        mobileMenu.setAttribute("aria-expanded", !isExpanded);
        toggleElement(".nav-list", "active");
    });

    nav.appendChild(mobileMenu);
    navbarContainer.appendChild(logoDiv);
    navbarContainer.appendChild(nav);
    header.appendChild(navbarContainer);

    return header;
};

/** Attach Navigation Event Listeners */
const attachNavEventListeners = () => {
    // Close Mobile Menu on Navigation
    document.querySelectorAll(".nav-list .nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            closeElement(".nav-list", "active");
            document.querySelector(".mobile-menu-icon")?.setAttribute("aria-expanded", "false");
        });
    });

    // Create Dropdown Toggle
    document.getElementById("create-menu")?.addEventListener("click", (e) => {
        e.preventDefault();
        toggleElement(".dropdown-menu", "show");
    });

    // Profile Dropdown Toggle
    const profileToggle = document.querySelector(".profile-dropdown-toggle");
    profileToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleElement(".profile-dropdown-menu", "show");
    });

    // Close Profile Dropdown on Outside Click
    document.addEventListener("click", () => closeElement(".profile-dropdown-menu", "show"));

    // Keyboard Accessibility for Profile Dropdown
    profileToggle?.addEventListener("keydown", (e) => {
        if (["Enter", " "].includes(e.key)) {
            toggleElement(".profile-dropdown-menu", "show");
            e.preventDefault();
        }
    });
};

export { createNav, attachNavEventListeners, createDropdown, createNavItem, createProfileDropdown };
