import { navigate } from "../routes/index.js";
import { createElement } from "../components/createElement.js";

function handleNavigation(event, href) {
    event.preventDefault();
    navigate(href);
}

// function createMenuItem(href, label) {
//     const li = document.createElement("li");
//     li.className = "nav-item";

//     li.href = href;
//     li.textContent = label;

//     li.addEventListener("click", (e) => handleNavigation(e, href));

//     return li;
// }

function createMenuItem(currentPath, href, label) {
    const li = document.createElement("li");
    li.className = "nav-item";
    li.textContent = label;
    li.addEventListener("click", (e) => handleNavigation(e, currentPath + href));
    return li;
}

function createSecondaryNav(isLoggedIn) {
    // Define sidebar items based on different sections
    const sidebarMap = {
        "/news": [
            { href: "/crowdfunding", label: "Crowdfunding" },
            { href: "/donations", label: "Donations" },
            { href: "/forums", label: "Forums" },
        ],
        "/analytics": [
            { href: "/streaming", label: "Streaming" },
            { href: "/forums", label: "Forums" },
        ],
        "/jobs": [
            { href: "/gigs", label: "Gigs" },
            { href: "/crowdfunding", label: "Crowdfunding" },
        ],
        "/default": isLoggedIn ? [] : [], // If logged in, define other defaults
    };

    // Get current path
    const currentPath = window.location.pathname;

    // Determine sidebar items based on current path
    const sidebarItems = sidebarMap[currentPath] || sidebarMap["/default"];

    // If no items exist for this page, return null (do not render secnav)
    if (!sidebarItems || sidebarItems.length === 0) {
        return null;
    }

    const secnavcon = createElement("section");
    secnavcon.className = "secnav";

    // Create Sidebar
    const sidebarElement = document.createElement("nav");
    sidebarElement.className = "secnav-nav";

    const sidebarMenuList = document.createElement("ul");
    sidebarMenuList.className = "menu-list";

    // Add Sidebar Items
    // sidebarItems.forEach((item) =>
    //     sidebarMenuList.appendChild(createMenuItem(item.href, item.label))
    // );
    sidebarItems.forEach((item) =>
        sidebarMenuList.appendChild(createMenuItem(currentPath, item.href, item.label))
    );

    sidebarElement.appendChild(sidebarMenuList);
    secnavcon.appendChild(sidebarElement);

    return secnavcon;
}

export { createSecondaryNav as secnav };

// import { navigate } from "../routes/index.js";
// import { createElement } from "../components/createElement.js";

// function handleNavigation(event, href) {
//     event.preventDefault();
//     navigate(href);
// }


// function createMenuItem(href, label) {
//     const li = document.createElement("li");
//     li.className = "nav-item";

//     li.href = href;
//     li.textContent = label;

//     li.addEventListener("click", (e) => handleNavigation(e, href));

//     return li;
// }

// function createSecondaryNav(isLoggedIn) {
//     // Define sidebar items based on different sections
//     const sidebarMap = {
//         "/news": [
//             { href: "/crowdfunding", label: "Crowdfunding" },
//             { href: "/donations", label: "Donations" },
//             { href: "/forums", label: "Forums" },
//         ],
//         "/analytics": [
//             { href: "/streaming", label: "Streaming" },
//             { href: "/forums", label: "Forums" },
//         ],
//         "/jobs": [
//             { href: "/gigs", label: "Gigs" },
//             { href: "/crowdfunding", label: "Crowdfunding" },
//         ],
//         "/default": isLoggedIn ? [] : [],
//     };

//     // Get current path
//     const currentPath = window.location.pathname;

//     // Determine which items to show based on current path
//     const sidebarItems = sidebarMap[currentPath] || sidebarMap["/default"];

//     const secnavcon = createElement('section');
//     secnavcon.className="secnav";

//     // Create Sidebar
//     const sidebarElement = document.createElement("nav");
//     sidebarElement.className = "secnav-nav";

//     // const sidebarTitle = document.createElement("h2");
//     // sidebarTitle.textContent = "Menu";
//     // sidebarElement.appendChild(sidebarTitle);

//     const sidebarMenuList = document.createElement("ul");
//     sidebarMenuList.className = "menu-list";

//     // Add Sidebar Items
//     sidebarItems.forEach((item) =>
//         sidebarMenuList.appendChild(createMenuItem(item.href, item.label))
//     );

//     sidebarElement.appendChild(sidebarMenuList);
//     secnavcon.appendChild(sidebarElement);

//     return secnavcon;
// }

// export { createSecondaryNav as secnav };
