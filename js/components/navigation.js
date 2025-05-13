// Navigation Component
import { SRC_URL, state } from "../state/state.js";
import { navigate } from "../routes/index.js";
import { logout } from "../services/auth/authService.js";
import { moreSVG, chatSVG, notifSVG } from "./svgs.js";

/** Utility Functions */
const toggleElement = (selector, className) =>
    document.querySelector(selector)?.classList.toggle(className);
const closeElement = (selector, className) =>
    document.querySelector(selector)?.classList.remove(className);

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

    const button = document.createElement("div");
    button.className = "dropdown-toggle";
    button.id = id;
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
    li.className = "navigation__item";
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.className = "nav-link navigation__link";
    anchor.textContent = label;
    anchor.addEventListener("click", (e) => handleNavigation(e, href));
    li.appendChild(anchor);
    return li;
};

/** Profile Dropdown */
const createProfileDropdown = (user) => {
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";

    const toggle = document.createElement("div");
    toggle.className = "profile-dropdown-toggle hflex";
    toggle.tabIndex = 0;

    // Use user's profile picture if available; otherwise, use default "thumb.jpg"
    const profilePic = user
        ? `${SRC_URL}/userpic/thumb/${user}.jpg`
        : `${SRC_URL}/userpic/thumb/thumb.jpg`;

    const image = document.createElement("img");
    image.src = profilePic;
    image.loading = "lazy";
    image.alt = "Profile Picture";
    image.className = "profile-image";

    toggle.appendChild(image);

    const menu = document.createElement("div");
    menu.className = "profile-dropdown-menu";

    const links = [
        { href: "/profile", text: "Profile" },
        { href: "/settings", text: "Settings" }
    ];
    links.forEach(({ href, text }) => {
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.className = "dropdown-item nav-link";
        anchor.textContent = text;
        anchor.addEventListener("click", (e) => handleNavigation(e, href));
        menu.appendChild(anchor);
    });

    // Logout Button
    const logoutButton = document.createElement("button");
    logoutButton.className = "dropdown-item logout-btn";
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener("click", async () => await logout());
    menu.appendChild(logoutButton);

    dropdown.appendChild(toggle);
    dropdown.appendChild(menu);
    return dropdown;
};

/** Navigation Bar */
const createNav = (isLoggedIn) => {
    // const isLoggedIn = Boolean(state.token);
    const navItems = [
        { href: "/home", label: "Home" },
        { href: "/feed", label: "Feed" },
        { href: "/events", label: "Events" },
        { href: "/places", label: "Places" },
        { href: "/itinerary", label: "Itinerary" },
        { href: "/nearby", label: "Nearby" },
        { href: "/shopping", label: "Shopping" },
        { href: "/news", label: "News" },
        { href: "/clips", label: "Clips" },
        { href: "/sports", label: "Sports" },
        { href: "/forums", label: "Forums" },
        { href: "/newchat", label: "NewChat" },
        // { href: "/chats", label: "Chats" },
        { href: "/qna", label: "QnA" },
        // { href: "/poll", label: "Poll" },
        // { href: "/quiz", label: "Quiz" },
        // { href: "/artists", label: "Artists" },
        { href: "/jobs", label: "Jobs" },
        // { href: "/food", label: "Food" },
        { href: "/blog", label: "Blog" },
        { href: "/cartoons", label: "Cartoons" },
        // { href: "/lives", label: "Lives" },
        { href: "/map", label: "Map" },
        { href: "/people", label: "People" },
        { href: "/ai", label: "AI" },
        { href: "/search", label: "Search" },
        { href: "/premium", label: "Premium" },
    ];

    // Create Header (with logo and profile or login button)
    const header = document.createElement("header");
    header.className = "navbar hflex-sb";

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";

    const logoLink = document.createElement("a");
    logoLink.href = "/";
    logoLink.className = "logo-link";
    logoLink.textContent = "Zincate";
    logoDiv.appendChild(logoLink);

    header.appendChild(logoDiv);

    const topRightDiv = document.createElement("div");
    topRightDiv.className = "hflex-sb";
    header.appendChild(topRightDiv);
    
    const chatLink = document.createElement("a");
    chatLink.href = "/chats";
    chatLink.className = "logo-link-svg";
    chatLink.innerHTML = chatSVG;
    topRightDiv.appendChild(chatLink);

    const notifLink = document.createElement("li");
    notifLink.className = "logo-link-svg";
    notifLink.innerHTML = notifSVG;
    topRightDiv.appendChild(notifLink);

    // Add Profile Dropdown or Login Button
    const profileOrLogin = (node) => {
        if (isLoggedIn) {
            node.appendChild(createProfileDropdown(state.user));
        } else {
            const loginButton = document.createElement("a");
            loginButton.className = "btn auth-btn";
            loginButton.textContent = "Login";
            loginButton.addEventListener("click", () => navigate("/login"));
            node.appendChild(loginButton);
        }
    };
    profileOrLogin(topRightDiv);

    /*************************** */

    // Create Navigation Menu (as a sibling to header)
    const nav = document.createElement("nav");
    // nav.className = "nav-menu hflex";
    nav.className = "navigation hflex";

    const ul = document.createElement("ul");
    // ul.className = "nav-list hflex";
    ul.className = "navigation__list";

    // Append Navigation Items
    const fragment = document.createDocumentFragment();
    navItems.forEach((item) => fragment.appendChild(createNavItem(item.href, item.label)));

    // // Create Dropdown for Create Options
    // fragment.appendChild(
    //     createDropdown("create-menu", "Create", [
    //         { href: "/create-event", text: "Eva" },
    //         { href: "/create-place", text: "Loca" },
    //         { href: "/create-artist", text: "Artist" },
    //         // { href: "/create-cartoon", text: "Cartoon" },
    //     ])
    // );


    const ulx = document.createElement("div");
    ulx.className = "navigation__inner";

    const ipt = document.createElement("input");
    ipt.className = "toggle";
    ipt.type = "checkbox";
    ipt.id = "more";
    ipt.setAttribute("aria-hidden", "true");
    ipt.setAttribute("tabindex", "-1");


    // const nin = document.createElement("div");
    // nin.className = "hflex";
    // nin.style.borderLeft = "1px solid #ccc";
    // nin.innerHTML = `<div class="navigation__toggle">
    //     <label class="navigation__link" for="more" aria-hidden="true">More</label>
    // </div>`;

    const nin = document.createElement("div");
    nin.className = "navigation__toggle";
    nin.style.borderLeft = "1px solid #ccc";
    // nin.innerHTML = `<label class="navigation__link" for="more" aria-hidden="true">${downloadSVG}</label>`;
    nin.innerHTML = `<label class="morecon" for="more" aria-hidden="true">${moreSVG}</label>`;


    ul.appendChild(fragment);
    nav.appendChild(ipt);
    ulx.appendChild(ul);
    ulx.appendChild(nin);
    nav.appendChild(ulx);

    // Wrap header and nav in a container so that they are siblings
    const container = document.createElement("div");
    container.className = "navigation-container";

    /*********************** */

    container.appendChild(header);
    container.appendChild(nav);

    return container;
};

/** Attach Navigation Event Listeners */
const attachNavEventListeners = () => {
    // Create Dropdown Toggle for "Create" menu
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
