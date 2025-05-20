import { createElement } from "../../components/createElement.js";

export async function displayMerch(contentContainer, merchID, isLoggedIn) {
    // Clear existing content
    contentContainer.innerHTML = "";
    let mcon = createElement('div',{},[merchID]);
    contentContainer.appendChild(mcon);
}