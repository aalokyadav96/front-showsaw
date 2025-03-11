import "../../../css/profilePage.css";
import { displayProfile  } from "../../services/profile/userProfileService";
import { displayUserProfile  } from "../../services/profile/otherUserProfileService";

async function UserProfile(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    const content = document.createElement("div");
    content.classList = "profilepage";
    contentContainer.appendChild(content);
    displayProfile(isLoggedIn, content);
}

export { UserProfile, displayUserProfile  };
