import { displayGigs } from "../../services/gigs/displayGigsService.js";

async function Gigs(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';

    const efventhead = document.createElement("h1");
    efventhead.textContent = "Gigs";
    contentContainer.appendChild(efventhead);
    
    const content = document.createElement("div");
    // content.classList = "gig-details";
    contentContainer.appendChild(content);

    displayGigs(isLoggedIn, content, contentContainer, 1)
}

export { Gigs };
