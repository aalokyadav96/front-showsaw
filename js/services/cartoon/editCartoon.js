import { navigate } from "../../routes/index.js";
import { apiFetch } from "../../api/api.js";
import SnackBar from "../../components/ui/Snackbar.mjs";
import Button from "../../components/base/Button.js";
import { createFormGroup } from "../../components/createFormGroup.js";


export async function deleteCartoonForm(isLoggedIn, cartoonID, isCreator) {
    alert("noted");
}

export async function editCartoonForm(isLoggedIn, cartoonID, isCreator) {
    const editSection = document.getElementById("editcartoon");
    console.log(editSection);

    if (!isLoggedIn) {
        navigate("/login");
        return;
    }

    if (!isCreator) {
        return;
    }

    try {
        // Fetch cartoon data
        const cartoon = await apiFetch(`/cartoons/${cartoonID}`);
        console.log(cartoon);

        // Clear existing content
        editSection.innerHTML = "";

        // Create form container
        const formContainer = document.createElement("div");
        formContainer.className = "form-container";

        const formHeading = document.createElement("h2");
        formHeading.textContent = "Edit Cartoon";

        // Create the form
        const form = document.createElement("form");
        form.id = "edit-cartoon-form";
        form.className = "edit-cartoon-form";

        // Define form fields
        const formGroups = [
            { label: "Cartoon Name", inputType: "text", inputId: "cartoon-name", inputValue: cartoon.name, placeholder: "Cartoon Name", isRequired: true },
            {
                label: "Cartoon Type", inputType: "select", inputId: "cartoon-category", inputValue: cartoon.category, options: [
                    { value: cartoon.category, label: cartoon.category },
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
                    { value: "other", label: "Other" },
                ], isRequired: true
            },
            { label: "Biography", inputType: "textarea", inputId: "cartoon-bio", inputValue: cartoon.bio, placeholder: "Cartoon Biography", isRequired: true },
            { label: "Date of Birth", inputType: "date", inputId: "cartoon-dob", inputValue: cartoon.dob, isRequired: true },
            { label: "Place", inputType: "text", inputId: "cartoon-place", inputValue: cartoon.place, placeholder: "Place", isRequired: true },
            { label: "Country", inputType: "text", inputId: "cartoon-country", inputValue: cartoon.country, placeholder: "Country", isRequired: true },
            { label: "Genres", inputType: "text", inputId: "cartoon-genres", inputValue: cartoon.genres.join(", "), placeholder: "Genres (comma separated)" },
            { label: "Socials", inputType: "textarea", inputId: "cartoon-socials", inputValue: JSON.stringify(cartoon.socials, null, 2), placeholder: "Socials (JSON format)" },
            { label: "Cartoon Banner", inputType: "file", inputId: "cartoon-banner", additionalProps: { accept: "image/*" } },
            { label: "Cartoon Photo", inputType: "file", inputId: "cartoon-photo", additionalProps: { accept: "image/*" } },
        ];

        // Generate form fields dynamically
        formGroups.forEach(group => form.appendChild(createFormGroup(group)));

        // Create buttons
        const updateButton = document.createElement("button");
        updateButton.type = "submit";
        updateButton.className = "button update-btn";
        updateButton.textContent = "Update Cartoon";

        const cancelButton = Button("Cancel", "cancel-btn", {
            click: () => (editSection.innerHTML = ""),
        });
        cancelButton.type = "button";

        // Append buttons to the form
        form.appendChild(updateButton);
        form.appendChild(cancelButton);

        // Add heading and form to the container
        formContainer.appendChild(formHeading);
        formContainer.appendChild(form);

        // Add container to the section
        editSection.appendChild(formContainer);

        // Handle form submission
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await updateCartoon(event, cartoonID);
        });

    } catch (error) {
        console.error("Edit Cartoon Form Error:", error);
        SnackBar(`Error loading cartoon: ${error.message}`, 3000);
    }
}

async function updateCartoon(event, cartoonId) {
    event.preventDefault(); // Prevent default form submission behavior

    // Gather form data with only the changed fields
    const formData = new FormData();
    const category = document.getElementById("cartoon-category").value;
    const name = document.getElementById("cartoon-name").value;
    const bio = document.getElementById("cartoon-bio").value;
    const dob = document.getElementById("cartoon-dob").value;
    const place = document.getElementById("cartoon-place").value;
    const country = document.getElementById("cartoon-country").value;
    const genres = document.getElementById("cartoon-genres").value;
    const socials = document.getElementById("cartoon-socials").value;
    const banner = document.getElementById("cartoon-banner").files[0];
    const photo = document.getElementById("cartoon-photo").files[0];

    // Add non-empty fields to FormData
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

    try {
        // Send the form data to the server using a PATCH request
        // const response = await apiFetch(`/cartoons/${cartoonId}`, {
        //     // method: "PATCH", // PATCH for partial updates
        //     method: "PUT", // PUT for partial updates
        //     body: formData,
        // });

        const response = await apiFetch(`/cartoons/${cartoonId}`, "PUT", formData);

        // Handle server response
        // if (response.ok) {
        if (response) {
            SnackBar("Cartoon updated successfully!", 3000);
            navigate(`/cartoon/${cartoonId}`); // Redirect to cartoon details page
        } else {
            // const errorData = await response.json();
            const errorData = await response;
            SnackBar(`Error: ${errorData.message}`, 3000);
        }
    } catch (error) {
        SnackBar(`Failed to update cartoon: ${error.message}`, 3000);
    }
}
