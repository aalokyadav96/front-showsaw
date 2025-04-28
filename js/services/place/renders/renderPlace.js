import { renderRestaurant } from "./renderRestaurant.js";
import { renderCafe } from "./renderCafe.js";
import { renderShop } from "./renderShop.js";
import { renderPark } from "./renderPark.js";
import { renderArena } from "./renderArena.js";
import { renderBusiness } from "./renderBusiness.js";
import { renderDefault } from "./renderDefault.js";


// Grouped place-specific render functions
const renderers = {
  restaurant: renderRestaurant,
  cafe: renderCafe,
  shop: renderShop,
  park: renderPark,
  arena: renderArena,
  business: renderBusiness,
  // More types can be added here as needed
  default: renderDefault,  // Default render for unknown categories
};

// Main render function
export function renderPlace(data, container, isCreator) {
  const category = (data.category || "").toLowerCase();

  // If a specific renderer exists for the place category, use it
  const renderFunction = renderers[category] || renderers.default;

  // Call the appropriate render function
  renderFunction(data, container, isCreator);
}
