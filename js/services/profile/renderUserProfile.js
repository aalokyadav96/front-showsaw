import { SRC_URL, state } from "../../state/state.js";
import Sightbox from "../../components/ui/Sightbox.mjs";
import { toggleFollow } from "./toggleFollow.js";
import Modal from "../../components/ui/Modal.mjs";
import { formatDate } from "./profileHelpers.js";
import { generateBannerForm, generateAvatarForm } from "./generators.js";
import Button from "../../components/base/Button.js";
import { displayUserProfileData } from "./otherUserProfileService.js";
import { displayFollowSuggestions } from "./displayFollowSugg.js";


// /* Utility function to append multiple children */
// function appendChildren(parent, ...children) {
//     children.forEach(child => parent.appendChild(child));
// }

function appendChildren(parent, ...children) {
    children.forEach(child => {
        if (child instanceof Node) {
            parent.appendChild(child);
        } else {
            console.error("Invalid child passed to appendChildren:", child);
        }
    });
}


/* Creates the banner image */
function createBanner(profile) {
    const bgImg = document.createElement("span");
    bgImg.className = "bg_img";
    const bannerPicture = profile.banner_picture || `${profile.username}.jpg`;
    bgImg.style.backgroundImage = `url(${SRC_URL}/userpic/banner/${bannerPicture})`;
    bgImg.addEventListener("click", () => Sightbox(`${SRC_URL}/userpic/banner/${bannerPicture}`, "image"));
    return bgImg;
}

/* Creates the banner edit button (only for profile owner) */
// function createBannerEditButton(profile) {
//     if (profile.userid !== state.user) return null;

//     const editButton = document.createElement("div");
//     editButton.className = "edit-banner-pic";
//     editButton.addEventListener("click", () => {
//         const content = document.createElement("div");
//         const contentx = document.createElement("div");
//         content.appendChild(generateBannerForm(contentx, profile.username));

//         const modal = Modal({
//             title: "Edit Banner",
//             content,
//             onClose: () => modal.remove(),
//         });
//     });
//     return editButton;
// }
function createBannerEditButton(profile) {
    if (profile.userid !== state.user) return document.createDocumentFragment(); 

    const editButton = document.createElement("div");
    editButton.className = "edit-banner-pic";
    editButton.addEventListener("click", () => {
        const content = document.createElement("div");
        const contentx = document.createElement("div");
        content.appendChild(generateBannerForm(contentx, profile.username));

        const modal = Modal({
            title: "Edit Banner",
            content,
            onClose: () => modal.remove(),
        });
    });

    return editButton;
}

/* Creates the profile picture area */
function createProfilePicture(profile) {
    const profileArea = document.createElement("div");
    profileArea.className = "profile_area";

    const thumb = document.createElement("span");
    thumb.className = "thumb";
    const img = document.createElement("img");
    img.src = `${SRC_URL}/userpic/${profile.username}.jpg`;
    img.alt = "Profile Picture";
    img.className = "imgful";
    thumb.appendChild(img);
    thumb.addEventListener("click", () => Sightbox(`${SRC_URL}/userpic/${profile.username}.jpg`, "image"));

    profileArea.appendChild(thumb);

    // Add Edit Profile Pic button if user owns the profile
    if (profile.userid === state.user) {
        const editProfileButton = document.createElement("button");
        editProfileButton.className = "edit-profile-pic";
        editProfileButton.addEventListener("click", () => {
            const content = document.createElement("div");
            const contentx = document.createElement("div");
            content.id = "hfgfy";
            contentx.id = "g54365";
            content.appendChild(generateAvatarForm(contentx, profile.username));

            const modal = Modal({
                title: "Edit Profile Picture",
                content,
                onClose: () => modal.remove(),
            });
        });
        profileArea.appendChild(editProfileButton);
    }

    return profileArea;
}

/* Creates the profile details section */
function createProfileDetails(profile, isLoggedIn) {
    const profileDetails = document.createElement("div");
    profileDetails.className = "profile-details";

    const username = document.createElement("h2");
    username.className = "username";
    username.textContent = profile.username || "Not provided";

    const name = document.createElement("p");
    name.className = "name";
    name.textContent = profile.name || "";

    // const email = document.createElement("p");
    // email.className = "email";
    // email.textContent = profile.email || "";

    const bio = document.createElement("p");
    bio.className = "bio";
    bio.textContent = profile.bio || "";

    const profileActions = createProfileActions(profile, isLoggedIn);

    const profileInfo = createProfileInfo(profile);

    appendChildren(profileDetails, username, name, bio, profileActions, profileInfo);
    return profileDetails;
}

/* Creates the profile actions (Edit, Follow, Delete) */
function createProfileActions(profile, isLoggedIn) {
    const profileActions = document.createElement("div");
    profileActions.className = "profile-actions";

    if (profile.userid === state.user) {
        const editButton = document.createElement("button");
        editButton.className = "btn edit-btn";
        editButton.dataset.action = "edit-profile";
        editButton.textContent = "Edit Profile";
        profileActions.appendChild(editButton);
    }

    if (isLoggedIn && profile.userid !== state.user) {
        const followButton = document.createElement("button");
        followButton.className = "btn follow-button";
        followButton.dataset.action = "toggle-follow";
        followButton.dataset.userid = profile.userid;
        followButton.textContent = profile.is_following ? "Unfollow" : "Follow";
        followButton.addEventListener("click", () => toggleFollow(profile.userid, followButton, profile));
        profileActions.appendChild(followButton);
    }

    return profileActions;
}

/* Creates the profile information section */
function createProfileInfo(profile) {
    const profileInfo = document.createElement("div");
    profileInfo.className = "profile-info";

    const infoItems = [
        { label: "Last Login", value: formatDate(profile.last_login) || "Never logged in" },
        { label: "Account Status", value: profile.is_active ? "Active" : "Inactive" },
        { label: "Verification Status", value: profile.is_verified ? "Verified" : "Not Verified" },
    ];

    infoItems.forEach(({ label, value }) => {
        const infoItem = document.createElement("div");
        infoItem.className = "info-item";
        infoItem.innerHTML = `<strong>${label}:</strong> ${value}`;
        profileInfo.appendChild(infoItem);
    });

    return profileInfo;
}

/* Creates the statistics section */
function createStatistics(profile) {
    const statistics = document.createElement("div");
    statistics.className = "statistics";

    const stats = [
        { label: "Posts", value: profile.profile_views || 0 },
        { label: "Followers", value: profile.followerscount || 0 },
        { label: "Following", value: profile.followscount || 0 },
    ];

    stats.forEach(({ label, value }) => {
        const statItem = document.createElement("p");
        statItem.className = "hflex";
        statItem.innerHTML = `<strong>${value}</strong> ${label}`;
        statistics.appendChild(statItem);
    });

    return statistics;
}

/* Main Profile Generator */
// function profilGen(profile, isLoggedIn) {
//     const profileContainer = document.createElement("div");
//     profileContainer.className = "profile-container hflex";

//     const section = document.createElement("section");
//     section.className = "channel";

//     const suggs = document.createElement("section");
//     displayFollowSuggestions(profile.userid, suggs);

//     appendChildren(
//         section,
//         createBanner(profile),
//         createBannerEditButton(profile),
//         createProfilePicture(profile),
//         createProfileDetails(profile, isLoggedIn),
//         createStatistics(profile),
//         suggs
//     );

//     // Load User Data Button
//     const udata = document.createElement("div");
//     udata.className = "udata-info";
//     const loadUserDataButton = Button("Load UserData", "load-user-data", {
//         click: () => displayUserProfileData(isLoggedIn, udata, profile.userid),
//     });

//     appendChildren(section, loadUserDataButton, udata);

//     if (profile.userid === state.user) {
//         const deleteProfileButton = document.createElement("button");
//         deleteProfileButton.className = "btn delete-btn";
//         deleteProfileButton.dataset.action = "delete-profile";
//         deleteProfileButton.textContent = "Delete Profile";
//         section.appendChild(deleteProfileButton);
//     }

//     profileContainer.appendChild(section);
//     return profileContainer;
// }

function profilGen(profile, isLoggedIn) {
    const profileContainer = document.createElement("div");
    profileContainer.className = "profile-container hflex";

    const section = document.createElement("section");
    section.className = "channel";

    const suggs = document.createElement("section");
    displayFollowSuggestions(profile.userid, suggs);

    // const banner = createBanner(profile);
    // const bannerEditButton = createBannerEditButton(profile);
    // const profilePic = createProfilePicture(profile);
    // const profileDetails = createProfileDetails(profile, isLoggedIn);
    // const statistics = createStatistics(profile);
    
    // console.log("Banner:", banner instanceof Node, banner);
    // console.log("Banner Edit Button:", bannerEditButton instanceof Node, bannerEditButton);
    // console.log("Profile Picture:", profilePic instanceof Node, profilePic);
    // console.log("Profile Details:", profileDetails instanceof Node, profileDetails);
    // console.log("Statistics:", statistics instanceof Node, statistics);
    // console.log("Suggestions:", suggs instanceof Node, suggs);
    
    // appendChildren(section, banner, bannerEditButton, profilePic, profileDetails, statistics, suggs);
    
    appendChildren(
        section,
        createBanner(profile),
        createBannerEditButton(profile),
        createProfilePicture(profile),
        createProfileDetails(profile, isLoggedIn),
        createStatistics(profile),
        suggs
    );

    // Load User Data Button
    const udata = document.createElement("div");
    udata.className = "udata-info";
    const loadUserDataButton = Button("Load UserData", "load-user-data", {
        click: () => displayUserProfileData(isLoggedIn, udata, profile.userid),
    });

    appendChildren(section, loadUserDataButton, udata);

    if (profile.userid === state.user) {
        const deleteProfileButton = document.createElement("button");
        deleteProfileButton.className = "btn delete-btn";
        deleteProfileButton.dataset.action = "delete-profile";
        deleteProfileButton.textContent = "Delete Profile";
        section.appendChild(deleteProfileButton);
    }

    profileContainer.appendChild(section);
    return profileContainer;
}

export { displayFollowSuggestions };

export default profilGen;

// import { SRC_URL, state } from '../../state/state.js';
// import Sightbox from '../../components/ui/Sightbox.mjs';
// import { toggleFollow } from "./toggleFollow.js";
// import Modal from '../../components/ui/Modal.mjs';
// import { formatDate } from "./profileHelpers.js";
// import { generateBannerForm, generateAvatarForm } from "./generators.js";
// import Button from '../../components/base/Button.js';
// import { attachProfileEventListeners } from "./userProfileService.js";
// import { displayUserProfileData } from "./otherUserProfileService.js";


// function appendChildren(parent, ...children) {
//     children.forEach(child => parent.appendChild(child));
// }

// function profilGen(profile, isLoggedIn) {
//     const profileContainer = document.createElement('div');
//     profileContainer.className = 'profile-container hflex';

//     const section = document.createElement('section');
//     section.className = 'channel';

//     // Background Image
//     const bgImg = document.createElement('span');
//     bgImg.className = 'bg_img';

//     // Determine the background image source
//     const bannerPicture = profile.banner_picture || `${profile.username}.jpg`;
//     bgImg.style.backgroundImage = `url(${SRC_URL}/userpic/banner/${bannerPicture})`;

//     // Add click event to display the image
//     bgImg.addEventListener('click', () => Sightbox(`${SRC_URL}/userpic/banner/${bannerPicture}`, 'image'));

//     if (profile.userid == state.user) {
//         const showEditButton = document.createElement('div');
//         showEditButton.textContent = '';
//         showEditButton.className = 'edit-banner-pic';
//         showEditButton.addEventListener('click', () => {
//             const content = document.createElement('div');
//             const contentx = document.createElement('div');
//             content.appendChild(generateBannerForm(contentx, profile.username));

//             const modal = Modal({
//                 title: 'Edit Banner',
//                 content,
//                 onClose: () => modal.remove(),
//             });
//         });

//         section.appendChild(showEditButton);
//         attachProfileEventListeners(profileContainer);
//     }

//     const profileArea = document.createElement('div');
//     profileArea.className = 'profile_area';

//     // Profile Picture
//     const thumb = document.createElement('span');
//     thumb.className = 'thumb';
//     const img = document.createElement('img');
//     img.src = `${SRC_URL}/userpic/${profile.username}.jpg`;
//     img.alt = 'Profile Picture';
//     img.className = 'imgful';
//     thumb.appendChild(img);
//     thumb.addEventListener('click', () => Sightbox(`${SRC_URL}/userpic/${profile.username}.jpg`, 'image'));

//     if (profile.userid == state.user) {
//         const showModalButton = document.createElement('button');
//         showModalButton.textContent = '';
//         showModalButton.className = 'edit-profile-pic';
//         showModalButton.addEventListener('click', () => {
//             const content = document.createElement('div');
//             const contentx = document.createElement('div');
//             content.id = "hfgfy";
//             contentx.id = "g54365";
//             content.appendChild(generateAvatarForm(contentx, profile.username));

//             const modal = Modal({
//                 title: 'Example Modal',
//                 content,
//                 onClose: () => modal.remove(),
//             });
//         });

//         profileArea.appendChild(showModalButton);
//     }

//     profileArea.appendChild(thumb);

//     // Profile Details
//     const profileDetails = document.createElement('div');
//     profileDetails.className = 'profile-details';

//     const username = document.createElement('h2');
//     username.className = 'username';
//     username.textContent = profile.username || 'Not provided';

//     const name = document.createElement('p');
//     name.className = 'name';
//     name.textContent = profile.name || '';

//     const email = document.createElement('p');
//     email.className = 'email';
//     email.textContent = profile.email || '';

//     const bio = document.createElement('p');
//     bio.className = 'bio';
//     bio.textContent = profile.bio || '';

//     const profileActions = document.createElement('div');
//     profileActions.className = 'profile-actions';

//     if (profile.userid == state.user) {
//         const editButton = document.createElement("button");
//         editButton.className = "btn edit-btn";
//         editButton.dataset.action = "edit-profile";
//         editButton.textContent = "Edit Profile";
//         profileActions.appendChild(editButton);
//     }


//     if (isLoggedIn && profile.userid !== state.user) {
//         const followButton = document.createElement("button");
//         followButton.className = "btn follow-button";
//         followButton.dataset.action = "toggle-follow";
//         followButton.dataset.userid = profile.userid;
//         followButton.addEventListener('click', () => toggleFollow(profile.userid, followButton, profile));
//         followButton.textContent = profile.is_following ? "Unfollow" : "Follow";

//         profileActions.appendChild(followButton);
//     }

//     const profileInfo = document.createElement('div');
//     profileInfo.className = 'profile-info';

//     const infoItems = [
//         { label: 'Last Login', value: formatDate(profile.last_login) || 'Never logged in' },
//         { label: 'Account Status', value: profile.is_active ? 'Active' : 'Inactive' },
//         { label: 'Verification Status', value: profile.is_verified ? 'Verified' : 'Not Verified' },
//     ];

//     infoItems.forEach(({ label, value }) => {
//         const infoItem = document.createElement('div');
//         infoItem.className = 'info-item';
//         infoItem.innerHTML = `<strong>${label}:</strong> ${value}`;
//         profileInfo.appendChild(infoItem);
//     });

//     appendChildren(profileDetails, username, name, email, bio, profileActions, profileInfo);

//     // Statistics
//     const statistics = document.createElement('div');
//     statistics.className = 'statistics';

//     const stats = [
//         { label: 'Posts', value: profile.profile_views || 0 },
//         { label: 'Followers', value: profile.followerscount || 0 },
//         { label: 'Following', value: profile.followscount || 0 },
//     ];

//     stats.forEach(({ label, value }) => {
//         const statItem = document.createElement('p');
//         statItem.className = 'hflex';
//         statItem.innerHTML = `<strong>${value}</strong> ${label}`;
//         statistics.appendChild(statItem);
//     });

//     // Follow Suggestions
//     const followSuggestions = document.createElement('div');
//     followSuggestions.id = 'follow-suggestions';
//     followSuggestions.className = 'follow-suggestions';

//     // appendChildren(section, bgImg, profileArea, profileDetails);
//     appendChildren(section, bgImg, profileArea, profileDetails, statistics, followSuggestions);

//     const udata = document.createElement('div');
//     udata.className = 'udata-info';

//     function displayUserData() {
//         displayUserProfileData(isLoggedIn, udata, profile.userid)
//     }

//     const addInfoButton = Button("Load UserData", "load-user-data", {
//         click: displayUserData,
//     });
//     section.appendChild(addInfoButton);
//     section.appendChild(udata);

//     if (profile.userid == state.user) {
//         const deleteProfileButton = document.createElement("button");
//         deleteProfileButton.className = "btn delete-btn";
//         deleteProfileButton.dataset.action = "delete-profile";
//         deleteProfileButton.textContent = "Delete Profile";

//         const deleteActions = document.createElement("div");
//         deleteActions.className = "profile-actions";
//         deleteActions.appendChild(deleteProfileButton);

//         section.append(deleteActions);
//     }

//     profileContainer.appendChild(section);

//     return profileContainer;
// }

// export default profilGen;
