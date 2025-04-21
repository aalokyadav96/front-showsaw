
import { createElement } from "../../components/createElement.js";

/* ───────────────────────────────
   UI COMPONENTS & HELPERS
──────────────────────────────── */

/**
 * Creates the main map container with the map image and marker layer.
 *
 * @param {string} mapImageUrl - URL of the map image.
 * @returns {HTMLElement} - The map container element.
 */
function createMapContainer(mapImageUrl) {
    // Map image element.
    const mapInner = createElement("img", { id: "map-inner", src: mapImageUrl });
    // Marker layer, positioned absolutely over the map.
    const markerLayer = createElement("div", {
      id: "marker-layer",
      style: "position:absolute;top:0;left:0;width:100%;height:100%",
    });
    // Wrapper contains map image and marker layer.
    const mapWrapper = createElement("div", { id: "map-wrapper" }, [
      mapInner,
      markerLayer,
    ]);
    // Container for the whole map.
    return createElement("div", { id: "custom-map-container" }, [mapWrapper]);
  }
  
  /**
   * Creates the legend UI with filter buttons for marker types.
   *
   * @param {Object} typeLabels - Mapping of marker types to labels.
   * @returns {HTMLElement} - The legend element.
   */
  function createLegend(typeLabels = {}) {
    const legend = createElement("div", { id: "legend", class: "hidden" });
    Object.keys(typeLabels).forEach((type) => {
      const btn = createElement("button", { "data-type": type }, [
        typeLabels[type] || type,
      ]);
      legend.appendChild(btn);
    });
    // Reset filter button.
    const resetBtn = createElement(
      "button",
      { style: "margin-top:10px" },
      ["🔄 Show All"]
    );
    legend.appendChild(resetBtn);
    return legend;
  }
  
  /**
   * Creates the zoom control UI.
   *
   * @returns {HTMLElement} - The zoom control element.
   */
  function createZoomControls() {
    const zoomInBtn = createElement("button", {}, ["+"]);
    const zoomOutBtn = createElement("button", {}, ["−"]);
    const zoomControls = createElement("div", { id: "zoom-controls" }, [
      zoomInBtn,
      zoomOutBtn,
    ]);
    return zoomControls;
  }
  
  /**
   * Creates the minimap UI that shows a static version of the map.
   *
   * @param {string} mapImageUrl - URL for the minimap image.
   * @returns {HTMLElement} - The minimap element.
   */
  function createMinimap(mapImageUrl) {
    const minimapImage = createElement("img", { src: mapImageUrl });
    const minimapViewport = createElement("div", { id: "minimap-viewport" });
    return createElement("div", { id: "minimap" }, [minimapImage, minimapViewport]);
  }
  
  /**
   * Creates the info panel UI for displaying marker details.
   *
   * @returns {HTMLElement} - The info panel element.
   */
  function createInfoPanel() {
    const infoTitle = createElement("h2", { id: "info-title" }, ["Info"]);
    const infoContent = createElement("p", { id: "info-content" }, [
      "Details will go here",
    ]);
    const closeBtn = createElement("button", { id: "close-info-panel" }, [
      "Close",
    ]);
    const panel = createElement("div", { id: "marker-info-panel" }, [
      closeBtn,
      infoTitle,
      infoContent,
    ]);
    // Close button hides the info panel.
    closeBtn.addEventListener("click", () => panel.classList.remove("active"));
    return panel;
  }
  
  /**
   * Creates marker elements from backend data.
   *
   * @param {Array} markers - Array of marker objects.
   * @param {Object} spritePositions - Mapping of marker types to background positions.
   * @returns {HTMLElement[]} - Array of marker elements.
   */
  function createMarkers(markers = [], spritePositions = {}) {
    const markerElements = markers.map((marker) => {
      const label = createElement("div", { class: "marker-label" }, [
        marker.name,
      ]);
      const el = createElement(
        "div",
        {
          class: "marker",
          id: marker.id,
          title: marker.name,
          "data-type": marker.type,
          style: `
            left:${marker.x}px;
            top:${marker.y}px;
            background-position:${spritePositions[marker.type] || "0px 0px"};
          `,
        },
        [label]
      );
      return el;
    });
    return markerElements;
  }
  
  export {
    createMapContainer,
    createLegend,
    createZoomControls,
    createMinimap,
    createInfoPanel,
    createMarkers,
  };