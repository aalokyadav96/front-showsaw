import displayPlace from "../place/displayPlace.js";

/* ───────────────────────────────
   MAP INTERACTIONS & UPDATES
──────────────────────────────── */

/**
 * Attaches interactions to the legend for filtering markers.
 *
 * @param {HTMLElement} legend - The legend element.
 * @param {HTMLElement[]} markerElements - Array of marker elements.
 */
function attachLegendInteractions(legend, markerElements) {
    // Filter markers by type when clicking on legend buttons.
    legend.querySelectorAll("button[data-type]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const type = btn.getAttribute("data-type");
            markerElements.forEach((el) => {
                el.style.display = el.dataset.type === type ? "block" : "none";
            });
        });
    });
    // Reset filtering.
    const resetBtn = legend.querySelector("button:not([data-type])");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            markerElements.forEach((el) => {
                el.style.display = "block";
            });
        });
    }
}

/**
 * Attaches click listeners to markers so that details load in the info panel.
 *
 * @param {HTMLElement[]} markerElements - Array of marker elements.
 * @param {boolean} isLoggedIn - Whether the user is logged in.
 * @param {HTMLElement} infoPanel - The info panel element.
 */
function attachMarkerClickListeners(markerElements, isLoggedIn, infoPanel) {
    const infoTitle = infoPanel.querySelector("#info-title");
    const infoContent = infoPanel.querySelector("#info-content");

    markerElements.forEach((el) => {
        el.addEventListener("click", async (e) => {
            e.stopPropagation();
            infoTitle.textContent = el.title;
            infoContent.textContent = "Loading...";
            try {
                // Load additional place details into the info panel.
                displayPlace(isLoggedIn, el.id, infoContent);
            } catch (error) {
                console.error("Error loading place details:", error);
                infoContent.textContent = "Error loading details.";
            }
            infoPanel.classList.add("active");
        });
    });
}

export {
    attachLegendInteractions,
    attachMarkerClickListeners
};