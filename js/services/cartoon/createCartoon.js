import { navigate } from "../../routes/index.js";
import SnackBar from '../../components/ui/Snackbar.mjs';
import { createFormField } from "../event/createEventHelpers.js";
import Button from "../../components/base/Button.js";
import { apiFetch } from "../../api/api.js";

export async function createCartoonForm(isLoggedIn, content) {
    const createSection = document.createElement("div");
    createSection.className = "create-section";

    if (isLoggedIn) {
        // Create and append the header
        const header = document.createElement("h2");
        header.textContent = "Create Cartoon";
        createSection.appendChild(header);

        // Define form fields
        const formFields = [
            {
                type: "select", id: "cartoon-category", label: "Cartoon Type", required: true,
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
            { type: "text", id: "cartoon-name", label: "Cartoon Name", required: true },
            { type: "textarea", id: "cartoon-bio", label: "Cartoon's Biography", required: true },
            { type: "date", id: "cartoon-dob", label: "Date of Birth", required: true },
            { type: "text", id: "cartoon-place", label: "Cartoon Place", required: true },
            { type: "text", id: "cartoon-country", label: "Country", required: true },
            { type: "text", id: "cartoon-genres", label: "Genres (comma separated)" },
            { type: "url", id: "cartoon-socials", label: "Socials" },
            { type: "file", id: "cartoon-banner", label: "Cartoon Banner", accept: "image/*" },
            { type: "file", id: "cartoon-photo", label: "Cartoon Photo", accept: "image/*" },
        ];


        // // Create and append form fields
        // formFields.forEach(field => createSection.appendChild(createFormField(field)));

        formFields.forEach(field => {
            if (field.id === "cartoon-place") {
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
        let createButton = Button("Create Cartoon", "create-cartoon-btn", { click: createCartoon });
        createSection.appendChild(createButton);

        content.appendChild(createSection);

    } else {
        SnackBar("Please log in to create an cartoon.", 3000);
        navigate('/login');
    }
}

async function createCartoon(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Gather form data
    const formData = new FormData();
    formData.append("category", document.getElementById("cartoon-category").value);
    formData.append("name", document.getElementById("cartoon-name").value);
    formData.append("bio", document.getElementById("cartoon-bio").value);
    formData.append("dob", document.getElementById("cartoon-dob").value);
    formData.append("place", document.getElementById("cartoon-place").value);
    formData.append("country", document.getElementById("cartoon-country").value);
    formData.append("genres", document.getElementById("cartoon-genres").value || "");
    formData.append("socials", document.getElementById("cartoon-socials").value || "");

    // Handle file inputs
    const banner = document.getElementById("cartoon-banner").files[0];
    const photo = document.getElementById("cartoon-photo").files[0];
    console.log("Banner input:", document.getElementById("cartoon-banner"));
    console.log("Banner file:", banner);

    if (banner) formData.append("banner", banner);
    if (photo) formData.append("photo", photo);

    try {
        // Send the form data to the server
        // const response = await apiFetch("/cartoons", {
        //     method: "POST",
        //     body: formData,
        // });

        const response = await apiFetch("/cartoons", "POST", formData);

        console.log(response);

        // Handle server response
        // if (response.ok) {
        if (response) {
            SnackBar("Cartoon created successfully!", 3000);
            navigate(`/cartoon/${response.id}`); // Redirect to cartoons list or relevant page
            // navigate(`/cartoons`); // Redirect to cartoons list or relevant page
        } else {
            // const errorData = await response.json();
            const errorData = await response;
            SnackBar(`Error: ${errorData.message}`, 3000);
        }
    } catch (error) {
        SnackBar(`Failed to create cartoon: ${error.message}`, 3000);
    }
}