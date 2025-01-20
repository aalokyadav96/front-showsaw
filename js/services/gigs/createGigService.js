import { apiFetch } from "../../api/api.js";
import { navigate } from "../../routes/index.js";
import SnackBar from '../../components/ui/Snackbar.mjs';
import { displayNewGig } from "./gigService.js";

const formFields = [
    { type: "text", id: "gig-name", placeholder: "Gig Name", required: true },
    { type: "textarea", id: "gig-about", placeholder: "Gig Description", required: true },
    { type: "text", id: "gig-place", placeholder: "Gig Place", required: true },
    { type: "text", id: "gig-area", placeholder: "Gig Area", required: true },
    { type: "text", id: "gig-type", placeholder: "Gig Type (e.g., Workshop, Service)", required: true },
    { type: "text", id: "gig-contact", placeholder: "Gig Contact Information", required: true },
    { type: "number", id: "total-capacity", placeholder: "Total Capacity", required: true },
    { type: "text", id: "pricing-unit", placeholder: "Pricing Unit (e.g., Hour, Session)", required: true },
    { type: "number", id: "base-price", placeholder: "Base Price", required: true },
    { type: "number", id: "discount", placeholder: "Discount (Optional)" },
    { type: "text", id: "category", placeholder: "Category", required: true },
    { type: "file", id: "gig-banner", accept: "image/*", required: true },
    { type: "url", id: "website-url", placeholder: "Website URL (Optional)" },
    { type: "text", id: "tags", placeholder: "Tags (Comma-separated)" },
];

async function createGigForm(isLoggedIn, content) {
    if (!isLoggedIn) {
        SnackBar("Please log in to create a gig.", 3000);
        return navigate('/login');
    }

    // Clear content and build the form UI
    content.innerHTML = "";
    const createSection = document.createElement("div");
    createSection.className = "create-section";
    createSection.innerHTML = `<h2>Create Gig</h2>`;
    formFields.forEach(field => createSection.appendChild(createFormGroup(field)));

    const createButton = document.createElement("button");
    createButton.id = "create-gig-btn";
    createButton.textContent = "Create Gig";
    createSection.appendChild(createButton);

    // Add event listeners
    setupPlaceSuggestions(createSection);
    createButton.addEventListener("click", async () => await handleGigCreation(isLoggedIn, content));

    content.appendChild(createSection);
}

function createFormGroup(field) {
    const formGroup = document.createElement("div");
    formGroup.className = "form-group";

    const inputElement = field.type === "textarea" 
        ? document.createElement("textarea") 
        : document.createElement("input");

    // Assign properties conditionally based on the element type
    if (field.type !== "textarea") {
        inputElement.type = field.type;
    }

    Object.assign(inputElement, {
        id: field.id,
        placeholder: field.placeholder || "",
        required: !!field.required,
        accept: field.accept,
    });

    formGroup.appendChild(inputElement);
    return formGroup;
}


function setupPlaceSuggestions(createSection) {
    const gigPlaceInput = createSection.querySelector("#gig-place");
    const placeSuggestionsBox = document.createElement("div");
    placeSuggestionsBox.id = "place-suggestions";
    placeSuggestionsBox.className = "suggestions-dropdown";
    createSection.appendChild(placeSuggestionsBox);

    gigPlaceInput.addEventListener("input", () => fetchPlaceSuggestions(gigPlaceInput, placeSuggestionsBox));
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#gig-place") && !e.target.closest("#place-suggestions")) {
            placeSuggestionsBox.style.display = "none";
        }
    });
}

async function fetchPlaceSuggestions(gigPlaceInput, placeSuggestionsBox) {
    const query = gigPlaceInput.value.trim();
    if (!query) {
        placeSuggestionsBox.style.display = "none";
        return;
    }

    try {
        const response = await apiFetch(`/api/suggestions/places?query=${query}`);
        const suggestions = await response.json();

        if (suggestions.length > 0) {
            placeSuggestionsBox.innerHTML = suggestions.map(s => 
                `<div class="suggestion-item" data-id="${s.id}">${s.name}</div>`
            ).join('');
        } else {
            placeSuggestionsBox.innerHTML = "No suggestions";
        }

        placeSuggestionsBox.style.display = "block";
        placeSuggestionsBox.querySelectorAll(".suggestion-item").forEach(item => {
            item.addEventListener("click", () => {
                gigPlaceInput.value = item.textContent;
                placeSuggestionsBox.style.display = "none";
            });
        });
    } catch (error) {
        console.error("Error fetching place suggestions:", error);
        placeSuggestionsBox.style.display = "none";
    }
}

async function handleGigCreation(isLoggedIn, content) {
    const formData = new FormData();
    let isValid = true;

    formFields.forEach(({ id, required }) => {
        const element = document.getElementById(id);
        if (element) {
            if (required && !element.value && element.type !== "file") {
                isValid = false;
                SnackBar(`Please fill out the required field: ${id}`, 3000);
                return;
            }

            if (element.type === "file" && element.files.length) {
                formData.append(id, element.files[0]);
            } else {
                formData.append(id, element.value);
            }
        }
    });

    if (!isValid) return;

    try {
        const result = await apiFetch('/gigs/gig', 'POST', formData, true);
        SnackBar(`Gig created successfully: ${result.name}`, 3000);
        content.innerHTML = "";
        // navigate(`/gigs/${result.id}`);
        displayNewGig(isLoggedIn, content, result);
    } catch (error) {
        console.error("Error creating gig:", error);
        SnackBar(`Error creating gig: ${error.message}`, 3000);
    }
}

export { createGigForm };
