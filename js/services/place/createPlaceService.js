import { createElement } from "../../components/createElement.js";
import Snackbar from '../../components/ui/Snackbar.mjs';
import { navigate } from "../../routes/index.js";
import { createPlace } from "./placeService.js";

function createForm(fields, onSubmit) {
    const form = createElement('form');

    // Handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(form); // Support file inputs
        try {
            await onSubmit(formData);
            Snackbar("Place created successfully!", 3000);
            navigate('/places'); // Redirect to places after success
        } catch (error) {
            console.error("Error creating place:", error);
            Snackbar("Failed to create place. Please try again.", 3000);
        }
    }

    // Attach the submit event listener
    form.addEventListener('submit', handleFormSubmit);

    // Build form fields
    fields.forEach(field => {
        const formGroup = createElement('div', { class: 'form-group' });

        // Create label
        const label = createElement('label', { for: field.id }, [field.label]);
        formGroup.appendChild(label);

        let inputElement;
        if (field.type === 'select') {
            // Create a select dropdown
            inputElement = createElement('select', { id: field.id, name: field.id, required: field.required }, 
                field.options.map(option => 
                    createElement('option', { value: option.value }, [option.label])
                )
            );
        } else {
            // Create regular input or textarea
            inputElement = createElement(field.type === 'textarea' ? 'textarea' : 'input', {
                id: field.id,
                name: field.id,
                type: field.type || 'text',
                placeholder: field.placeholder,
                value: field.value || '',
                ...(field.required ? { required: true } : {}),
                ...(field.type === 'file' && field.accept ? { accept: field.accept } : {}),
                ...(field.min ? { min: field.min } : {}),
            });
        }

        formGroup.appendChild(inputElement);
        form.appendChild(formGroup);
    });

    // Add submit button
    form.appendChild(createElement('button', { type: 'submit' }, ["Submit"]));
    return form;
}

async function createPlaceForm(isLoggedIn, createSection) {
    // Ensure the section is cleared
    createSection.innerHTML = "";

    if (isLoggedIn) {
        const formFields = [
            { 
                id: "category", 
                label: "Category", 
                type: "select", 
                required: true, 
                options: [
                    { value: "", label: "Select a category" },
                    { value: "restaurant", label: "Restaurant" },
                    { value: "cafe", label: "Café" },
                    { value: "hotel", label: "Hotel" },
                    { value: "park", label: "Park" },
                    { value: "museum", label: "Museum" },
                    { value: "gym", label: "Gym" },
                    { value: "theater", label: "Theater" },
                    { value: "other", label: "Other" }
                ] 
            },
            { id: "place-name", label: "Place Name", placeholder: "Enter the place name", required: true },
            { id: "place-address", label: "Address", placeholder: "Enter the address", required: true },
            { id: "place-city", label: "City", placeholder: "Enter the city", required: true },
            { id: "place-country", label: "Country", placeholder: "Enter the country", required: true },
            { id: "place-zipcode", label: "Zip Code", placeholder: "Enter the zip code", required: true },
            { id: "place-description", label: "Description", type: "textarea", placeholder: "Provide a description", required: true },
            { id: "capacity", label: "Capacity", type: "number", placeholder: "Enter the capacity", required: true, min: 1 },
            { id: "phone", label: "Phone Number", placeholder: "Enter the phone number" },
            { id: "place-banner", label: "Place Banner", type: "file", accept: "image/*" }
        ];

        // Create the form with a proper submission callback
        const form = createForm(formFields, async (formData) => {
            return await createPlace(formData); // Send the formData to the service
        });

        createSection.appendChild(createElement('h2', {}, ["Create Place"]));
        createSection.appendChild(form);
    } else {
        Snackbar("You must be logged in to create a place.", 3000);
        navigate('/login');
    }
}

export { createPlaceForm, createForm };
