import { createButton, createContainer } from "../eventHelper.js";
import { createElement } from "../../components/createElement.js";

export function createTabs(tabs, defaultTabId) {
    const tabContainer = createContainer(["tabs-container"]);
    const tabButtons = createContainer(["tab-buttons"]);
    const tabContents = createContainer(["tab-contents"]);

    // Create containers for tab content
    const tabContentContainers = tabs.map(({ id }) =>
        createElement("article", { id, class: ["tab-content"] })
    );

    tabs.forEach(({ title, id, render }, index) => {
        const tabButton = createButton({
            text: title,
            classes: ["tab-button"],
            events: { click: () => activateTab(id, render, tabContentContainers[index]) },
        });

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

    // Activate the default tab (fixed logic)
    const defaultTab = tabs.find(tab => tab.id === defaultTabId) || tabs[0];
    if (defaultTab) {
        activateTab(defaultTab.id, defaultTab.render, tabContentContainers[tabs.indexOf(defaultTab)]);
    }

    return tabContainer;
}
