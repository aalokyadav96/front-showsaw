// mapModule.js
import "./ctxMenu.js";
import { SRC_URL, apiFetch } from "../../api/api.js";
import {
  initMapInteractions,
  attachLegendInteractions,
  attachMarkerClickListeners
} from "./interactions.js";
import {
  createMapContainer,
  createLegend,
  createZoomControls,
  createMinimap,
  createInfoPanel,
  createMarkers,
} from "./helpers.js";

/**
 * Loads map configuration and marker data from the backend,
 * then displays the map.
 *
 * @param {HTMLElement} contentContainer - The container to render the map UI.
 * @param {boolean} isLoggedIn - Whether the user is logged in.
 * @param {Object} entityx - Entity information containing `id` and `type`.
 */
export async function loadMap(contentContainer, isLoggedIn, entityx) {
  try {
    // Fetch dynamic config and markers from backend.
    const config = await apiFetch(
      `/maps/config/${entityx.type}?id=${encodeURIComponent(entityx.id)}`
    );
    const markers = await apiFetch(
      `/maps/markers/${entityx.type}?id=${encodeURIComponent(entityx.id)}`
    );
    // Adjust map image for events.
    if (entityx.type === "event") {
      config.mapImage = `${SRC_URL}/eventpic/seating/${entityx.id}seating.jpg`;
    }
    displayMap(contentContainer, isLoggedIn, config, markers);
  } catch (err) {
    console.error("Failed to load map:", err);
  }
}

/**
 * Primary function that builds and displays the map along with UI controls.
 *
 * @param {HTMLElement} contentContainer - The container for rendering the map.
 * @param {boolean} isLoggedIn - Indicates if the user is logged in.
 * @param {Object} config - Map configuration with keys:
 *   - mapImage: URL for the map image.
 *   - spritePositions: Object mapping marker types to sprite positions.
 *   - typeLabels: Object mapping marker types to labels.
 * @param {Array} markers - Array of marker data from the backend.
 */
export function displayMap(contentContainer, isLoggedIn, config, markers) {
  // Clear any previous content.
  contentContainer.innerHTML = "";

  // Build the UI modules.
  const mapContainer = createMapContainer(config.mapImage);
  const legend = createLegend(config.typeLabels);
  const zoomControls = createZoomControls();
  const minimap = createMinimap(config.mapImage);
  const infoPanel = createInfoPanel();

  // Append UI modules to the container.
  contentContainer.append(mapContainer, legend, zoomControls, minimap, infoPanel);

  // Create and add markers to the marker layer.
  const markerElements = createMarkers(markers, config.spritePositions);
  const markerLayer = mapContainer.querySelector("#marker-layer");
  markerElements.forEach((el) => markerLayer.appendChild(el));

  // Set up interactions for panning, zooming, minimap recentering, legend filtering, etc.
  const mapInteractions = initMapInteractions(mapContainer, zoomControls, minimap);
  attachLegendInteractions(legend, markerElements);
  attachMarkerClickListeners(markerElements, isLoggedIn, infoPanel);

  // Perform an initial render (update zoom and minimap viewport).
  mapInteractions.applyZoom();
}
