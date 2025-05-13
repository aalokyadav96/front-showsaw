import { navigate } from "../routes/index.js";

function handleNavigation(event, href) {
    event.preventDefault();
    navigate(href);
}

// function createMenuItem(href, label) {
//     const li = document.createElement("li");
//     li.className = "nav-item";

//     const anchor = document.createElement("a");
//     anchor.href = href;
//     anchor.textContent = label;
//     anchor.className = "footlink";

//     anchor.addEventListener("click", (e) => handleNavigation(e, href));

//     li.appendChild(anchor);
//     return li;
// }

function createMenuItem(href, label) {
    const li = document.createElement("li");
    li.className = "nav-item";

    li.href = href;
    li.textContent = label;

    li.addEventListener("click", (e) => handleNavigation(e, href));

    return li;
}

function createSecondaryNav(container, isLoggedIn) {
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
        "/default": isLoggedIn
            ? [
                  { href: "/chats", label: "Chats" },
                  { href: "/crowdfunding", label: "Crowdfunding" },
                  { href: "/donations", label: "Donations" },
                  { href: "/analytics", label: "Analytics" },
                  { href: "/streaming", label: "Streaming" },
                  { href: "/forums", label: "Forums" },
              ]
            : [{ href: "/gigs", label: "Gigs" }],
    };

    // Get current path
    const currentPath = window.location.pathname;

    // Determine which items to show based on current path
    const sidebarItems = sidebarMap[currentPath] || sidebarMap["/default"];

    // Create Sidebar
    const sidebarElement = document.createElement("nav");
    sidebarElement.className = "secnav-nav";

    // const sidebarTitle = document.createElement("h2");
    // sidebarTitle.textContent = "Menu";
    // sidebarElement.appendChild(sidebarTitle);

    const sidebarMenuList = document.createElement("ul");
    sidebarMenuList.className = "menu-list";

    // Add Sidebar Items
    sidebarItems.forEach((item) =>
        sidebarMenuList.appendChild(createMenuItem(item.href, item.label))
    );

    sidebarElement.appendChild(sidebarMenuList);
    container.appendChild(sidebarElement);
}

export { createSecondaryNav as secnav };
