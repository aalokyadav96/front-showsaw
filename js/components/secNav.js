import { createElement } from "../components/createElement.js";

function createMenuItem({ label, callback, href }, onSelect) {
    const li = document.createElement("li");
    li.className = "nav-item";
    li.textContent = label;

    li.addEventListener("click", (e) => {
        e.preventDefault();

        if (onSelect) onSelect(li); // handle active class

        if (callback && typeof callback === "function") {
            callback(label);
        } else if (href) {
            window.history.pushState({}, "", href);
            window.dispatchEvent(new Event("popstate"));
        }
    });

    return li;
}

function createSecondaryNav(items) {
    if (!Array.isArray(items) || items.length === 0) return null;

    const secnavcon = createElement("section");
    secnavcon.className = "secnav";

    const sidebarElement = document.createElement("nav");
    sidebarElement.className = "secnav-nav";

    const sidebarMenuList = document.createElement("ul");
    sidebarMenuList.className = "menu-list";

    let activeItem = null;
    const handleActive = (selectedLi) => {
        if (activeItem) activeItem.classList.remove("active");
        selectedLi.classList.add("active");
        activeItem = selectedLi;
    };

    items.forEach(item => {
        const menuItem = createMenuItem(item, handleActive);
        sidebarMenuList.appendChild(menuItem);
    });

    sidebarElement.appendChild(sidebarMenuList);
    secnavcon.appendChild(sidebarElement);

    return secnavcon;
}

export { createSecondaryNav as secnav };

// import { createElement } from "../components/createElement.js";

// function createMenuItem({ label, callback, href }) {
//     const li = document.createElement("li");
//     li.className = "nav-item";
//     li.textContent = label;

//     li.addEventListener("click", (e) => {
//         e.preventDefault();
//         if (callback && typeof callback === "function") {
//             callback(label); // Pass the label to the callback
//         } else if (href) {
//             // fallback navigate() logic if needed
//             window.history.pushState({}, "", href);
//             window.dispatchEvent(new Event("popstate"));
//         }
//     });

//     return li;
// }

// /**
//  * Generic secondary nav generator
//  * @param {Array<Object>} items - Each item must have at least { label, callback? or href? }
//  * @returns {HTMLElement|null}
//  */
// function createSecondaryNav(items) {
//     if (!Array.isArray(items) || items.length === 0) {
//         return null;
//     }

//     const secnavcon = createElement("section");
//     secnavcon.className = "secnav";

//     const sidebarElement = document.createElement("nav");
//     sidebarElement.className = "secnav-nav";

//     const sidebarMenuList = document.createElement("ul");
//     sidebarMenuList.className = "menu-list";

//     items.forEach(item => {
//         const menuItem = createMenuItem(item);
//         sidebarMenuList.appendChild(menuItem);
//     });

//     sidebarElement.appendChild(sidebarMenuList);
//     secnavcon.appendChild(sidebarElement);

//     return secnavcon;
// }

// export { createSecondaryNav as secnav };
