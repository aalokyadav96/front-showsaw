import { displayGig } from "../../services/gigs/gigService.js";

function Gig(isLoggedIn, gigid, contentContainer) {
    displayGig(isLoggedIn, gigid, contentContainer)
}


export { Gig };
