import { apiFetch } from "../../api/api.js";
import SnackBar from '../../components/ui/Snackbar.mjs';
import { navigate } from "../../routes/index.js";
import displayPlace from "./displayPlace.js";
import { createFormGroup } from "../../components/createFormGroup.js";

async function updatePlace(isLoggedIn, placeId) {
    if (!isLoggedIn) {
        SnackBar("Please log in to update place.", 3000);
        return;
    }

    const name = document.getElementById("place-name").value.trim();
    const capacity = document.getElementById("capacity").value;
    const category = document.getElementById("category").value;
    const address = document.getElementById("place-address").value.trim();
    const description = document.getElementById("place-description").value.trim();

    const bannerInput = document.getElementById("banner");
    if (!bannerInput) {
        console.error("File input with id 'banner' not found.");
        SnackBar("Error: Unable to find file input.", 3000);
        return;
    }

    const bannerFile = bannerInput.files.length > 0 ? bannerInput.files[0] : null;

    // Validate input values
    if (!name || !capacity || !category || !address || !description) {
        SnackBar("Please fill in all required fields.", 3000);
        return;
    }

    const formData = new FormData();
    formData.append('name', name); // Assuming you meant 'name' here
    formData.append('capacity', capacity);
    formData.append('category', category);
    formData.append('address', address);
    formData.append('description', description);
    if (bannerFile) {
        formData.append('banner', bannerFile);
    }

    try {
        const result = await apiFetch(`/places/place/${placeId}`, 'PUT', formData);
        SnackBar(`Place updated successfully: ${result.name}`, 3000);
        // navigate('/place/' + placeId);
        displayPlace(isLoggedIn, placeId)
    } catch (error) {
        SnackBar(`Error updating place: ${error.message}`, 3000);
    }
}

async function editPlaceForm(isLoggedIn, placeId, content) {
    const createSection = content;
    if (isLoggedIn) {
        try {
            // Fetch place data from the server (uncomment when the API is available)
            const place = await apiFetch(`/places/place/${placeId}`);

            // Clear the content of createSection
            createSection.innerHTML = '';

            // Create the form container
            const formContainer = document.createElement('div');
            formContainer.classList.add('form-container');

            const formHeading = document.createElement('h2');
            formHeading.textContent = 'Edit Place';

            // Create the form
            const form = document.createElement('form');
            form.id = 'edit-place-form';
            form.classList.add('edit-place-form');

            // Add form groups
            const formGroups = [
                { label: 'Name', inputType: 'text', inputId: 'place-name', inputValue: place.name, placeholder: 'Place Name', isRequired: true },
                { label: 'Description', inputType: 'textarea', inputId: 'place-description', inputValue: place.description, placeholder: 'Description', isRequired: true },
                { label: 'Address', inputType: 'text', inputId: 'place-address', inputValue: place.address, placeholder: 'Location', isRequired: true },
                { label: 'Capacity', inputType: 'number', inputId: 'capacity', inputValue: place.capacity, placeholder: 'Capacity', isRequired: true },
                // { label: 'Category', inputType: 'select', inputId: 'category', inputValue: place.category, placeholder: 'Category', isRequired: true },
                { 
                    label: "Category", 
                    inputId: "category", 
                    inputType: "select", 
                    // inputValue: place.category,
                    isRequired: true, 
                    placeholder: 'Category',
                    options: [
                        { value: place.category, label: place.category },
                        { value: "Restaurant", label: "Restaurant" },
                        { value: "Cafe", label: "Café" },
                        { value: "Hotel", label: "Hotel" },
                        { value: "Park", label: "Park" },
                        { value: "Business", label: "Business" },
                        { value: "Shop", label: "Shop" },
                        { value: "Museum", label: "Museum" },
                        { value: "Gym", label: "Gym" },
                        { value: "Theater", label: "Theater" },
                        { value: "Arena", label: "Arena" },
                        { value: "Other", label: "Other" }
                    ] 
                },
                { label: 'Place Banner', inputType: 'file', inputId: 'banner', additionalProps: { accept: 'image/*' } },
            ];

            formGroups.forEach(group => {
                form.appendChild(createFormGroup(group));
            });

            // Update Button
            const updateButton = document.createElement('button');
            updateButton.type = 'submit';
            updateButton.classList.add('update-btn');
            updateButton.textContent = 'Update Place';
            form.appendChild(updateButton);

            // Append form to formContainer
            formContainer.appendChild(formHeading);
            formContainer.appendChild(form);

            // Append formContainer to createSection
            createSection.appendChild(formContainer);

            // Attach event listener to the form for submitting the update
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await updatePlace(isLoggedIn, placeId);
            });

        } catch (error) {
            SnackBar(`Error loading place: ${error.message}`, 3000);
        }
    } else {
        navigate('/login');
    }
}

async function deletePlace(isLoggedIn, placeId) {
    if (!isLoggedIn) {

        SnackBar("Please log in to delete your place.", 3000);
        return;
    }
    if (confirm("Are you sure you want to delete this place?")) {
        try {
            await apiFetch(`/places/place/${placeId}`, 'DELETE');

            SnackBar("Place deleted successfully.", 3000);
            navigate('/places'); // Redirect to home or another page
        } catch (error) {

            SnackBar(`Error deleting place: ${error.message || 'Unknown error'}`, 3000);
        }
    }
}

export { editPlaceForm, updatePlace, deletePlace };