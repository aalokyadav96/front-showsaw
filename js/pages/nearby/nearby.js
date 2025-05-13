import { displayAasPaas } from "../../services/aaspaas/aaspaas.js";

async function Nearby(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayAasPaas(contentContainer, isLoggedIn);
}

export { Nearby };
