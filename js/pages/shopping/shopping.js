import { displayShopping } from "../../services/shopping/shopping.js";

async function Shopping(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayShopping(contentContainer, isLoggedIn);
}

export { Shopping };
