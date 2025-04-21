import { navigate } from "../../routes/index.js";
import SnackBar from '../../components/ui/Snackbar.mjs';
import { createFormField } from "../event/createEventHelpers.js";
import Button from "../../components/base/Button.js";
import { apiFetch } from "../../api/api.js";

export async function createArtistForm(isLoggedIn, content) {
    const createSection = document.createElement("div");
    createSection.className = "create-section";

    if (isLoggedIn) {
        // Create and append the header
        const header = document.createElement("h2");
        header.textContent = "Create Artist";
        createSection.appendChild(header);

        // Define form fields
        const formFields = [
            {
                type: "select", id: "artist-category", label: "Artist Type", required: true,
                options: [
                    { value: "", label: "Select a Type" },
                    { value: "singer", label: "Singer" },
                    { value: "comedian", label: "Comedian" },
                    { value: "actor", label: "Actor" },
                    { value: "poet", label: "Poet" },
                    { value: "musician", label: "Musician" },
                    { value: "dancer", label: "Dancer" },
                    { value: "magician", label: "Magician" },
                    { value: "painter", label: "Painter" },
                    { value: "photographer", label: "Photographer" },
                    { value: "sculptor", label: "Sculptor" },
                    { value: "other", label: "Other" }
                ]
            },
            { type: "text", id: "artist-name", label: "Artist Name", required: true },
            { type: "textarea", id: "artist-bio", label: "Artist's Biography", required: true },
            { type: "date", id: "artist-dob", label: "Date of Birth", required: true },
            { type: "text", id: "artist-place", label: "Artist Place", required: true },
            { type: "text", id: "artist-country", label: "Country", required: true },
            { type: "text", id: "artist-genres", label: "Genres (comma separated)" },
            { type: "url", id: "artist-socials", label: "Socials" },
            { type: "file", id: "artist-banner", label: "Artist Banner", accept: "image/*" },
            { type: "file", id: "artist-photo", label: "Artist Photo", accept: "image/*" },
        ];


        // // Create and append form fields
        // formFields.forEach(field => createSection.appendChild(createFormField(field)));

        formFields.forEach(field => {
            if (field.id === "artist-place") {
                // Wrap input in a container for positioning
                const wrapper = document.createElement("div");
                wrapper.className = "suggestions-container";

                const input = createFormField(field);
                wrapper.appendChild(input);

                const autocompleteList = document.createElement("ul");
                autocompleteList.id = "ac-list";
                autocompleteList.classList.add("ac-list");

                wrapper.appendChild(autocompleteList);

                createSection.appendChild(wrapper);
            } else {
                createSection.appendChild(createFormField(field));
            }
        });

        // Create and append the create button
        let createButton = Button("Create Artist", "create-artist-btn", { click: createArtist });
        createSection.appendChild(createButton);

        content.appendChild(createSection);

    } else {
        SnackBar("Please log in to create an artist.", 3000);
        navigate('/login');
    }
}

async function createArtist(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Gather form data
    const formData = new FormData();
    formData.append("category", document.getElementById("artist-category").value);
    formData.append("name", document.getElementById("artist-name").value);
    formData.append("bio", document.getElementById("artist-bio").value);
    formData.append("dob", document.getElementById("artist-dob").value);
    formData.append("place", document.getElementById("artist-place").value);
    formData.append("country", document.getElementById("artist-country").value);
    formData.append("genres", document.getElementById("artist-genres").value || "");
    formData.append("socials", document.getElementById("artist-socials").value || "");

    // Handle file inputs
    const banner = document.getElementById("artist-banner").files[0];
    const photo = document.getElementById("artist-photo").files[0];
    console.log("Banner input:", document.getElementById("artist-banner"));
    console.log("Banner file:", banner);

    if (banner) formData.append("banner", banner);
    if (photo) formData.append("photo", photo);

    try {
        // Send the form data to the server
        // const response = await apiFetch("/artists", {
        //     method: "POST",
        //     body: formData,
        // });

        const response = await apiFetch("/artists", "POST", formData);

        console.log(response);

        // Handle server response
        // if (response.ok) {
        if (response) {
            SnackBar("Artist created successfully!", 3000);
            navigate(`/artist/${response.id}`); // Redirect to artists list or relevant page
            // navigate(`/artists`); // Redirect to artists list or relevant page
        } else {
            // const errorData = await response.json();
            const errorData = await response;
            SnackBar(`Error: ${errorData.message}`, 3000);
        }
    } catch (error) {
        SnackBar(`Failed to create artist: ${error.message}`, 3000);
    }
}