import { SRC_URL, state } from "../../state/state.js";
import { apiFetch } from "../../api/api.js";
import { handleError } from "../../utils/utils.js";
import Snackbar from '../../components/ui/Snackbar.mjs';
import { renderPage } from "../../routes/index.js";
import { createForm } from "../../components/createForm.js"; 
import {formatDate, showLoadingMessage, removeLoadingMessage, capitalize } from "./profileHelpers.js";


function generateBannerForm(content, username) {
    const bannerPictureSrc = `${SRC_URL}/userpic/banner/${username + '.jpg'}`;
    const fields = [
        {
            label: "Banner Picture",
            id: "edit-banner-picture",
            currentSrc: bannerPictureSrc,
            previewId: "banner-picture-preview",
        },
    ];
    return createForm(content, fields, "edit-banner-form", "update-banner-pics-btn", "Update Banner Pics", () => {
        const formData = new FormData(document.getElementById("edit-banner-form"));
        updateProfilePics('banner', formData);
    });
}

function generateAvatarForm(content, username) {
    const profilePictureSrc = `${SRC_URL}/userpic/${username + '.jpg'}`;
    const fields = [
        {
            label: "Profile Picture",
            id: "edit-avatar-picture",
            currentSrc: profilePictureSrc,
            previewId: "profile-picture-preview",
        },
    ];
    return createForm(content, fields, "edit-avatar-form", "update-avatar-pics-btn", "Update Profile Pics", () => {
        const formData = new FormData(document.getElementById("edit-avatar-form"));
        updateProfilePics('avatar', formData);
    });
}


// Generate the HTML content for the profile
function generateProfileHTML(profile) {
    return `
        <div class="profile-container hflex">    
            <section class="channel">
            <span class="bg_img" style="background-image:url(/userpic/${profile.profile_picture || 'default.png'});"></span>
                <div class="profile_area">
                    <span class="thumb">
                        <img src="${SRC_URL}/userpic/${profile.profile_picture || 'default.png'}" class="imgful" alt="Profile Picture"/>
                    </span>     
                </div> 
                <div class="profile-details">
                    <h2 class="username">${profile.username || 'Not provided'}</h2>
                    <p class="name">${profile.name || ''}</p>
                    <p class="email">${profile.email || ''}</p>
                    <p class="bio">${profile.bio || ''}</p>
                    <div class="profile-actions">
                        <button class="btn edit-btn" data-action="edit-profile">Edit Profile</button>
                    </div>
                    <div class="profile-info">
                        <div class="info-item"><strong>Last Login:</strong> ${formatDate(profile.last_login) || 'Never logged in'}</div>
                        <div class="info-item"><strong>Account Status:</strong> ${profile.is_active ? 'Active' : 'Inactive'}</div>
                        <div class="info-item"><strong>Verification Status:</strong> ${profile.is_verified ? 'Verified' : 'Not Verified'}</div>
                    </div>
                </div>
                <!--div class="statistics">
                    <p class="hflex"><strong>${profile.profile_views || 0}</strong> Posts</p>
                    <p class="hflex"><strong>${profile.followers?.length || 0}</strong> Followers</p>
                    <p class="hflex"><strong>${profile.follows?.length || 0}</strong> Following</p>
                </div>
                <div id="follow-suggestions" class="follow-suggestions"></div-->
                <br>
                <div class="profile-actions">
                    <button class="btn delete-btn" data-action="delete-profile">Delete Profile</button>
                </div>
            </section>
        </div>
    `;
}


async function updatePicture(type) {
    if (!state.token) {
        Snackbar(`Please log in to update your ${type} picture.`, 3000);
        return;
    }

    const fileInput = document.getElementById(`edit-${type}-picture`);
    if (!fileInput || !fileInput.files[0]) {
        Snackbar(`No ${type} picture selected.`, 3000);
        return;
    }

    showLoadingMessage(`Updating ${type} picture...`);

    try {
        const formData = new FormData();
        formData.append(`${type}_picture`, fileInput.files[0]);

        const updatedProfile = await apiFetch(`/profile/${type}`, 'PUT', formData);
        if (!updatedProfile) throw new Error(`No response received for ${type} picture update.`);

        state.userProfile = { ...state.userProfile, ...updatedProfile };
        localStorage.setItem("userProfile", JSON.stringify(state.userProfile));

        Snackbar(`${capitalize(type)} picture updated successfully.`, 3000);
        renderPage();
    } catch (error) {
        console.error(`Error updating ${type} picture:`, error);
        handleError(`Error updating ${type} picture. Please try again.`);
    } finally {
        removeLoadingMessage();
    }
}


async function updateProfilePics(type) {
    await updatePicture(type);
}

function generateFormField(label, id, type, value) {
    if (type === "textarea") {
        return `
            <label for="${id}">${label}</label>
            <textarea id="${id}" name="${id}">${value}</textarea>
        `;
    }
    return `
        <label for="${id}">${label}</label>
        <input id="${id}" name="${id}" type="${type}" value="${value}" />
    `;
}



export { generateBannerForm, generateAvatarForm, generateFormField, generateProfileHTML };
