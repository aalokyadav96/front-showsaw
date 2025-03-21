import { createDivButton, createContainer } from "../eventHelper.js";
import { createElement } from "../../components/createElement.js";

export function createTabs(tabs) {
    const tabContainer = createContainer(["tabs-container"]);
    const tabButtons = createContainer(["tab-buttons"]);
    const tabContents = createContainer(["tab-contents"]);

    // Create containers for tab content
    const tabContentContainers = tabs.map(({ id }) =>
        createElement("article", { id, class: ["tab-content"] })
    );

    tabs.forEach(({ title, id, render }, index) => {
        const tabButton = createDivButton({
            text: title,
            classes: ["tab-button"],
            events: { click: () => activateTab(id, render, tabContentContainers[index]) },
        });

        // Mark the first tab as active
        if (index === 0) {
            tabButton.classList.add("active");
        }

        tabButtons.appendChild(tabButton);
        tabContents.appendChild(tabContentContainers[index]);
    });

    tabContainer.appendChild(tabButtons);
    tabContainer.appendChild(tabContents);

    function activateTab(tabId, renderContent, contentContainer) {
        // Update active button styles
        document.querySelectorAll(".tab-button").forEach((btn, index) => {
            btn.classList.toggle("active", tabs[index].id === tabId);
        });

        // Show/hide the correct tab content
        document.querySelectorAll(".tab-content").forEach((content) => {
            content.classList.toggle("active", content.id === tabId);
        });

        // Ensure the correct content container is updated
        const activeTabContent = document.querySelector(`#${tabId}`);
        if (activeTabContent && !activeTabContent.contains(contentContainer)) {
            activeTabContent.innerHTML = "";
            activeTabContent.appendChild(contentContainer);
        }

        // Render the content only if it's not already loaded
        if (contentContainer && !contentContainer.innerHTML.trim()) {
            renderContent(contentContainer);
        }
    }

    // Activate the first tab on load
    if (tabs.length > 0) {
        const firstTab = tabs[0];
        activateTab(firstTab.id, firstTab.render, tabContentContainers[0]);
        tabContentContainers[0].classList.add("active"); // Ensure first tab content is visible
    }

    return tabContainer;
}

// import { createButton, createContainer } from "../eventHelper.js";
// import { createElement } from "../../components/createElement.js";

// export function createTabs(tabs, alwaysOpenFirstTab = false) {
//     const tabContainer = createContainer(["tabs-container"]);
//     const tabButtons = createContainer(["tab-buttons"]);
//     const tabContents = createContainer(["tab-contents"]);

//     // Create containers for tab content
//     const tabContentContainers = tabs.map(({ id }) =>
//         createElement("article", { id, class: ["tab-content"] })
//     );

//     tabs.forEach(({ title, id, render }, index) => {
//         const tabButton = createButton({
//             text: title,
//             classes: ["tab-button"],
//             events: {
//                 click: () => {
//                     switchTab(id, render, tabContentContainers[index], true);
//                 }
//             },
//         });

//         // if (!alwaysOpenFirstTab || index === 0) {
//         //     switchTab(id, render, tabContentContainers[index], true);
//         // }

//         // For the first tab, mark it active immediately.
//         if (index === 0) {
//             tabButton.classList.add("active");
//             // Immediately switch to the first tab so its content is rendered and gets "active" class.
//             switchTab(id, render, tabContentContainers[index], true);
//         }
//         tabButtons.appendChild(tabButton);
//         tabContents.appendChild(tabContentContainers[index]);
//     });


//     tabContainer.appendChild(tabButtons);
//     tabContainer.appendChild(tabContents);

//     function switchTab(tabId, renderContent, contentContainer, pushState = false) {

//         // // If alwaysOpenFirstTab is true and the requested tab is not the first, do nothing.
//         // if (alwaysOpenFirstTab && tabId !== tabs[0].id) {
//         //     return;
//         // }

//         // Update active button styles
//         document.querySelectorAll(".tab-button").forEach((btn, index) => {
//             btn.classList.toggle("active", tabs[index].id === tabId);
//         });

//         // Show/hide the correct tab content
//         document.querySelectorAll(".tab-content").forEach((content) => {
//             content.classList.toggle("active", content.id === tabId);
//         });

//         // Ensure the correct content container is updated
//         const activeTabContent = document.querySelector(`#${tabId}`);
//         if (activeTabContent && !activeTabContent.contains(contentContainer)) {
//             activeTabContent.innerHTML = "";
//             activeTabContent.appendChild(contentContainer);
//         }

//         // Render the content only if it's not already loaded
//         if (contentContainer && !contentContainer.innerHTML.trim()) {
//             renderContent(contentContainer);
//         }

//         // Push to history only if triggered by a user click and not forced to always show first tab
//         if (pushState && !alwaysOpenFirstTab) {
//             history.pushState({ activeTab: tabId }, "", `#${tabId}`);
//         }
//     }

//     // Handle back/forward navigation (only if not locked to first tab)
//     function onPopState(event) {
//         if (alwaysOpenFirstTab) return;
//         const activeTabId = event.state ? event.state.activeTab : tabs[0].id;
//         const tabIndex = tabs.findIndex(tab => tab.id === activeTabId);
//         if (tabIndex !== -1) {
//             switchTab(activeTabId, tabs[tabIndex].render, tabContentContainers[tabIndex], false);
//         }
//     }
//     window.addEventListener("popstate", onPopState);

//     // Load tab from URL hash or default to the first tab (or force first tab if required)
//     const initialTabId = alwaysOpenFirstTab ? tabs[0].id : (window.location.hash.substring(1) || tabs[0].id);
//     const initialTabIndex = tabs.findIndex(tab => tab.id === initialTabId);
//     if (initialTabIndex !== -1) {
//         switchTab(initialTabId, tabs[initialTabIndex].render, tabContentContainers[initialTabIndex]);
//     }

//     return tabContainer;
// }