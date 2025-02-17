import "../../../css/profilePage.css";
import { displayProfile  } from "../../services/profile/userProfileService";
import { displayUserProfile  } from "../../services/profile/otherUserProfileService";

async function UserProfile(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayProfile(isLoggedIn, contentContainer);
}

export { UserProfile, displayUserProfile  };
