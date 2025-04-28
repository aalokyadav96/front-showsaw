import { navigate } from "../../routes/index.js";
import { apiFetch } from "../../api/api.js";
import SnackBar from "../../components/ui/Snackbar.mjs";
import Button from "../../components/base/Button.js";
import { createFormGroup } from "../../components/createFormGroup.js";

export async function deleteArtistForm(isLoggedIn, artistID, isCreator) {
    alert("noted");
}

export async function editArtistForm(isLoggedIn, artistID, isCreator) {
    const editSection = document.getElementById("editartist");
    console.log(editSection);

    if (!isLoggedIn) {
        navigate("/login");
        return;
    }

    if (!isCreator) {
        return;
    }

    try {
        const artist = await apiFetch(`/artists/${artistID}`);
        console.log(artist);

        editSection.innerHTML = "";

        const formContainer = document.createElement("div");
        formContainer.className = "form-container";

        const formHeading = document.createElement("h2");
        formHeading.textContent = "Edit Artist";

        const form = document.createElement("form");
        form.id = "edit-artist-form";
        form.className = "edit-artist-form";

        const formGroups = [
            { label: "Artist Name", inputType: "text", inputId: "artist-name", inputValue: artist.name, placeholder: "Artist Name", isRequired: true },
            {
                label: "Artist Type", inputType: "select", inputId: "artist-category", inputValue: artist.category, options: [
                    { value: artist.category, label: artist.category },
                    { value: "singer", label: "Singer" },
                    { value: "band", label: "Band" },
                    { value: "comedian", label: "Comedian" },
                    { value: "actor", label: "Actor" },
                    { value: "poet", label: "Poet" },
                    { value: "musician", label: "Musician" },
                    { value: "dancer", label: "Dancer" },
                    { value: "magician", label: "Magician" },
                    { value: "painter", label: "Painter" },
                    { value: "photographer", label: "Photographer" },
                    { value: "sculptor", label: "Sculptor" },
                    { value: "other", label: "Other" },
                ], isRequired: true
            },
            { label: "Biography", inputType: "textarea", inputId: "artist-bio", inputValue: artist.bio, placeholder: "Artist Biography", isRequired: true },
            { label: "Date of Birth", inputType: "date", inputId: "artist-dob", inputValue: artist.dob, isRequired: true },
            { label: "Place", inputType: "text", inputId: "artist-place", inputValue: artist.place, placeholder: "Place", isRequired: true },
            { label: "Country", inputType: "text", inputId: "artist-country", inputValue: artist.country, placeholder: "Country", isRequired: true },
            { label: "Genres", inputType: "text", inputId: "artist-genres", inputValue: artist.genres.join(", "), placeholder: "Genres (comma separated)" },
            { label: "Socials", inputType: "textarea", inputId: "artist-socials", inputValue: JSON.stringify(artist.socials, null, 2), placeholder: "Socials (JSON format)" },
            { label: "Artist Banner", inputType: "file", inputId: "artist-banner", additionalProps: { accept: "image/*" } },
            { label: "Artist Photo", inputType: "file", inputId: "artist-photo", additionalProps: { accept: "image/*" } },
        ];

        formGroups.forEach(group => form.appendChild(createFormGroup(group)));

        // 👉 Band Members Section
        const bandSection = document.createElement("div");
        bandSection.className = "band-members-section";

        const bandHeader = document.createElement("h3");
        bandHeader.textContent = "Band Members";
        bandSection.appendChild(bandHeader);

        const membersContainer = document.createElement("div");
        membersContainer.id = "band-members-container";
        bandSection.appendChild(membersContainer);

        const addMemberBtn = Button("Add Member", "add-member-btn", { click: addBandMember });
        bandSection.appendChild(addMemberBtn);

        form.appendChild(bandSection);

        // Load existing members if any
        if (artist.members && artist.members.length > 0) {
            artist.members.forEach(member => {
                addBandMember(member);
            });
        }

        const updateButton = document.createElement("button");
        updateButton.type = "submit";
        updateButton.className = "button update-btn";
        updateButton.textContent = "Update Artist";

        const cancelButton = Button("Cancel", "cancel-btn", {
            click: () => (editSection.innerHTML = ""),
        });
        cancelButton.type = "button";

        form.appendChild(updateButton);
        form.appendChild(cancelButton);

        formContainer.appendChild(formHeading);
        formContainer.appendChild(form);

        editSection.appendChild(formContainer);

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await updateArtist(event, artistID);
        });

    } catch (error) {
        console.error("Edit Artist Form Error:", error);
        SnackBar(`Error loading artist: ${error.message}`, 3000);
    }
}

function addBandMember(existingMember = null) {
    const container = document.getElementById("band-members-container");

    const memberDiv = document.createElement("div");
    memberDiv.className = "band-member";

    memberDiv.innerHTML = `
        <input type="text" placeholder="Member Name" class="member-name" value="${existingMember?.name || ""}" required />
        <input type="text" placeholder="Role (optional)" class="member-role" value="${existingMember?.role || ""}" />
        <input type="date" placeholder="DOB (optional)" class="member-dob" value="${existingMember?.dob || ""}" />
        <button type="button" class="remove-member-btn">Remove</button>
    `;

    memberDiv.querySelector(".remove-member-btn").addEventListener("click", () => {
        container.removeChild(memberDiv);
    });

    container.appendChild(memberDiv);
}

async function updateArtist(event, artistId) {
    event.preventDefault();

    const formData = new FormData();
    const category = document.getElementById("artist-category").value;
    const name = document.getElementById("artist-name").value;
    const bio = document.getElementById("artist-bio").value;
    const dob = document.getElementById("artist-dob").value;
    const place = document.getElementById("artist-place").value;
    const country = document.getElementById("artist-country").value;
    const genres = document.getElementById("artist-genres").value;
    const socials = document.getElementById("artist-socials").value;
    const banner = document.getElementById("artist-banner").files[0];
    const photo = document.getElementById("artist-photo").files[0];

    if (category) formData.append("category", category);
    if (name) formData.append("name", name);
    if (bio) formData.append("bio", bio);
    if (dob) formData.append("dob", dob);
    if (place) formData.append("place", place);
    if (country) formData.append("country", country);
    if (genres) formData.append("genres", genres);
    if (socials) formData.append("socials", socials);
    if (banner) formData.append("banner", banner);
    if (photo) formData.append("photo", photo);

    // 👉 Collect Band Members
    const members = [];
    const memberElements = document.querySelectorAll(".band-member");
    memberElements.forEach(member => {
        const name = member.querySelector(".member-name").value.trim();
        if (name) {
            members.push({
                name,
                role: member.querySelector(".member-role").value.trim(),
                dob: member.querySelector(".member-dob").value,
            });
        }
    });

    if (members.length > 0) {
        formData.append("members", JSON.stringify(members));
    }

    try {
        const response = await apiFetch(`/artists/${artistId}`, "PUT", formData);

        if (response) {
            SnackBar("Artist updated successfully!", 3000);
            navigate(`/artist/${artistId}`);
        } else {
            const errorData = await response;
            SnackBar(`Error: ${errorData.message}`, 3000);
        }
    } catch (error) {
        SnackBar(`Failed to update artist: ${error.message}`, 3000);
    }
}

// import { navigate } from "../../routes/index.js";
// import { apiFetch } from "../../api/api.js";
// import SnackBar from "../../components/ui/Snackbar.mjs";
// import Button from "../../components/base/Button.js";
// import { createFormGroup } from "../../components/createFormGroup.js";


// export async function deleteArtistForm(isLoggedIn, artistID, isCreator) {
//     alert("noted");
// }

// export async function editArtistForm(isLoggedIn, artistID, isCreator) {
//     const editSection = document.getElementById("editartist");
//     console.log(editSection);

//     if (!isLoggedIn) {
//         navigate("/login");
//         return;
//     }

//     if (!isCreator) {
//         return;
//     }

//     try {
//         // Fetch artist data
//         const artist = await apiFetch(`/artists/${artistID}`);
//         console.log(artist);

//         // Clear existing content
//         editSection.innerHTML = "";

//         // Create form container
//         const formContainer = document.createElement("div");
//         formContainer.className = "form-container";

//         const formHeading = document.createElement("h2");
//         formHeading.textContent = "Edit Artist";

//         // Create the form
//         const form = document.createElement("form");
//         form.id = "edit-artist-form";
//         form.className = "edit-artist-form";

//         // Define form fields
//         const formGroups = [
//             { label: "Artist Name", inputType: "text", inputId: "artist-name", inputValue: artist.name, placeholder: "Artist Name", isRequired: true },
//             {
//                 label: "Artist Type", inputType: "select", inputId: "artist-category", inputValue: artist.category, options: [
//                     { value: artist.category, label: artist.category },
//                     { value: "singer", label: "Singer" },
//                     { value: "comedian", label: "Comedian" },
//                     { value: "actor", label: "Actor" },
//                     { value: "poet", label: "Poet" },
//                     { value: "musician", label: "Musician" },
//                     { value: "dancer", label: "Dancer" },
//                     { value: "magician", label: "Magician" },
//                     { value: "painter", label: "Painter" },
//                     { value: "photographer", label: "Photographer" },
//                     { value: "sculptor", label: "Sculptor" },
//                     { value: "other", label: "Other" },
//                 ], isRequired: true
//             },
//             { label: "Biography", inputType: "textarea", inputId: "artist-bio", inputValue: artist.bio, placeholder: "Artist Biography", isRequired: true },
//             { label: "Date of Birth", inputType: "date", inputId: "artist-dob", inputValue: artist.dob, isRequired: true },
//             { label: "Place", inputType: "text", inputId: "artist-place", inputValue: artist.place, placeholder: "Place", isRequired: true },
//             { label: "Country", inputType: "text", inputId: "artist-country", inputValue: artist.country, placeholder: "Country", isRequired: true },
//             { label: "Genres", inputType: "text", inputId: "artist-genres", inputValue: artist.genres.join(", "), placeholder: "Genres (comma separated)" },
//             { label: "Socials", inputType: "textarea", inputId: "artist-socials", inputValue: JSON.stringify(artist.socials, null, 2), placeholder: "Socials (JSON format)" },
//             { label: "Artist Banner", inputType: "file", inputId: "artist-banner", additionalProps: { accept: "image/*" } },
//             { label: "Artist Photo", inputType: "file", inputId: "artist-photo", additionalProps: { accept: "image/*" } },
//         ];

//         // Generate form fields dynamically
//         formGroups.forEach(group => form.appendChild(createFormGroup(group)));

//         // Create buttons
//         const updateButton = document.createElement("button");
//         updateButton.type = "submit";
//         updateButton.className = "button update-btn";
//         updateButton.textContent = "Update Artist";

//         const cancelButton = Button("Cancel", "cancel-btn", {
//             click: () => (editSection.innerHTML = ""),
//         });
//         cancelButton.type = "button";

//         // Append buttons to the form
//         form.appendChild(updateButton);
//         form.appendChild(cancelButton);

//         // Add heading and form to the container
//         formContainer.appendChild(formHeading);
//         formContainer.appendChild(form);

//         // Add container to the section
//         editSection.appendChild(formContainer);

//         // Handle form submission
//         form.addEventListener("submit", async (event) => {
//             event.preventDefault();
//             await updateArtist(event, artistID);
//         });

//     } catch (error) {
//         console.error("Edit Artist Form Error:", error);
//         SnackBar(`Error loading artist: ${error.message}`, 3000);
//     }
// }

// async function updateArtist(event, artistId) {
//     event.preventDefault(); // Prevent default form submission behavior

//     // Gather form data with only the changed fields
//     const formData = new FormData();
//     const category = document.getElementById("artist-category").value;
//     const name = document.getElementById("artist-name").value;
//     const bio = document.getElementById("artist-bio").value;
//     const dob = document.getElementById("artist-dob").value;
//     const place = document.getElementById("artist-place").value;
//     const country = document.getElementById("artist-country").value;
//     const genres = document.getElementById("artist-genres").value;
//     const socials = document.getElementById("artist-socials").value;
//     const banner = document.getElementById("artist-banner").files[0];
//     const photo = document.getElementById("artist-photo").files[0];

//     // Add non-empty fields to FormData
//     if (category) formData.append("category", category);
//     if (name) formData.append("name", name);
//     if (bio) formData.append("bio", bio);
//     if (dob) formData.append("dob", dob);
//     if (place) formData.append("place", place);
//     if (country) formData.append("country", country);
//     if (genres) formData.append("genres", genres);
//     if (socials) formData.append("socials", socials);
//     if (banner) formData.append("banner", banner);
//     if (photo) formData.append("photo", photo);

//     try {
//         // Send the form data to the server using a PATCH request
//         // const response = await apiFetch(`/artists/${artistId}`, {
//         //     // method: "PATCH", // PATCH for partial updates
//         //     method: "PUT", // PUT for partial updates
//         //     body: formData,
//         // });

//         const response = await apiFetch(`/artists/${artistId}`, "PUT", formData);

//         // Handle server response
//         // if (response.ok) {
//         if (response) {
//             SnackBar("Artist updated successfully!", 3000);
//             navigate(`/artist/${artistId}`); // Redirect to artist details page
//         } else {
//             // const errorData = await response.json();
//             const errorData = await response;
//             SnackBar(`Error: ${errorData.message}`, 3000);
//         }
//     } catch (error) {
//         SnackBar(`Failed to update artist: ${error.message}`, 3000);
//     }
// }
