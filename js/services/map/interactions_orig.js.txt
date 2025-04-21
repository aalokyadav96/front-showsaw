import {
    attachLegendInteractions,
    attachMarkerClickListeners
} from "./listeners";


/* ───────────────────────────────
   MAP INTERACTIONS & UPDATES
──────────────────────────────── */

/**
 * Initializes panning and zooming interactions. Returns an object with helper methods.
 *
 * @param {HTMLElement} mapContainer - The container holding the map.
 * @param {HTMLElement} zoomControls - The container holding zoom in/out buttons.
 * @param {HTMLElement} minimap - The minimap container.
 * @returns {Object} - An object with an applyZoom() function.
 */
function initMapInteractions(mapContainer, zoomControls, minimap) {
    // Retrieve the inner wrapper and image.
    const mapWrapper = mapContainer.querySelector("#map-wrapper");
    const mapInner = mapContainer.querySelector("#map-inner");
    const [zoomInBtn, zoomOutBtn] = zoomControls.querySelectorAll("button");

    // Variables for panning and zooming.
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let mapX = 0;
    let mapY = 0;
    let zoom = 1;
    const zoomStep = 0.1;

    /**
     * Applies the current pan/zoom transformation to the map and updates the minimap.
     */
    function applyZoom() {
        mapWrapper.style.transform = `translate(${mapX}px, ${mapY}px) scale(${zoom})`;
        updateMinimapViewport();
    }

    /**
     * Updates the minimap viewport rectangle based on current pan/zoom.
     */
    function updateMinimapViewport() {
        const minimapViewport = minimap.querySelector("#minimap-viewport");
        // Use natural image width if available, else default.
        const mapImgWidth = mapInner.naturalWidth || 2000;
        const minimapScale = minimap.offsetWidth / mapImgWidth;
        const visibleWidth = mapContainer.offsetWidth / zoom;
        const visibleHeight = mapContainer.offsetHeight / zoom;
        minimapViewport.style.width = `${visibleWidth * minimapScale}px`;
        minimapViewport.style.height = `${visibleHeight * minimapScale}px`;
        minimapViewport.style.left = `${-mapX * minimapScale}px`;
        minimapViewport.style.top = `${-mapY * minimapScale}px`;
    }

    // Map panning event handlers.
    mapContainer.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        mapContainer.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        mapX += dx;
        mapY += dy;
        applyZoom();
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        mapContainer.style.cursor = "grab";
    });

    // Zoom in/out buttons.
    zoomInBtn.addEventListener("click", () => {
        zoom += zoomStep;
        applyZoom();
    });
    zoomOutBtn.addEventListener("click", () => {
        zoom = Math.max(0.5, zoom - zoomStep);
        applyZoom();
    });

    // Clicking the minimap recenters the main map.
    minimap.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = minimap.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const mapImgWidth = mapInner.naturalWidth || 2000;
        const minimapScale = minimap.offsetWidth / mapImgWidth;
        const targetX = clickX / minimapScale;
        const targetY = clickY / minimapScale;
        const containerCenterX = mapContainer.offsetWidth / 2;
        const containerCenterY = mapContainer.offsetHeight / 2;
        mapX = containerCenterX - targetX * zoom;
        mapY = containerCenterY - targetY * zoom;
        applyZoom();
    });

    // Expose the applyZoom function for use after changes.
    return { applyZoom };
}

export {
    initMapInteractions,
    attachLegendInteractions,
    attachMarkerClickListeners
};