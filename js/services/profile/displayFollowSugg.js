import { SRC_URL, apiFetch } from "../../api/api.js";
import Snackbar from '../../components/ui/Snackbar.mjs';
import { navigate } from "../../routes/index.js";

async function displayFollowSuggestions(userid, suggestionsSection) {
    // const suggestionsSection = document.getElementById("follow-suggestions");
    suggestionsSection.innerHTML = ""; // Clear existing content

    try {
        const suggestions = await apiFetch(`/suggestions/follow?${userid}`);
console.log(suggestions);
        if (suggestions && suggestions.length > 0) {
            const heading = document.createElement("h3");
            heading.textContent = "Suggested Users to Follow:";
            suggestionsSection.appendChild(heading);

            const suggestionsList = document.createElement("div");
            suggestionsList.id = "suggestions-list";

            suggestions.forEach(user => {
                const listItem = document.createElement("div");
                listItem.className = "suggestion-item";

                // Profile picture (fallback if empty)
                const profilePic = document.createElement("img");
                profilePic.className = "profile-picture";
                profilePic.src = user.userid ? SRC_URL + `/userpic/thumb/${user.userid}.jpg` : "/default-avatar.jpg";
                profilePic.alt = `${user.username}'s profile`;
                profilePic.setAttribute("loading", "lazy");
                profilePic.addEventListener("click", () => navigate(`/user/${user.username}`));

                // Username
                const username = document.createElement("span");
                username.className = "username";
                username.textContent = user.username;

                // Bio
                const bio = document.createElement("span");
                bio.className = "bio";
                bio.textContent = user.bio;

                // // Follow Button
                // const followButton = document.createElement("button");
                // followButton.className = "follow-btn";
                // followButton.textContent = user.is_following ? "Following" : "Follow";
                // followButton.dataset.userid = user.userid;
                // followButton.onclick = () => toggleFollow(user.userid, followButton);

                // Append elements
                listItem.appendChild(profilePic);
                listItem.appendChild(username);
                listItem.appendChild(bio);
                // listItem.appendChild(viewProfileButton);
                // listItem.appendChild(followButton);
                suggestionsList.appendChild(listItem);
            });

            suggestionsSection.appendChild(suggestionsList);
        } else {
            const noSuggestionsMessage = document.createElement("p");
            noSuggestionsMessage.textContent = "No follow suggestions available.";
            suggestionsSection.appendChild(noSuggestionsMessage);
        }
    } catch (error) {
        console.error("Error loading follow suggestions:", error);

        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load suggestions.";
        suggestionsSection.appendChild(errorMessage);

        Snackbar("Error loading follow suggestions.", 3000);
    }
}

export {displayFollowSuggestions};