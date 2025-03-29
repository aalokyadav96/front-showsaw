import { apiFetch } from "../../api/api.js";

function createItinerary(isLoggedIn, divContainerNode) {
    // Clear previous content
    divContainerNode.textContent = '';

    if (!isLoggedIn) {
        const message = document.createElement('p');
        message.textContent = 'Please log in to view and manage your itineraries.';
        divContainerNode.appendChild(message);
        return;
    }

    const heading = document.createElement('h2');
    heading.textContent = 'Create Itinerary';

    const form = document.createElement('form');
    form.id = 'createItineraryForm';
    form.className = "create-section";

    const fields = [
        { name: 'name', type: 'text', placeholder: 'Itinerary Name', required: true, id: "name", label: "Itinerary Name" },
        { name: 'description', type: 'textarea', placeholder: 'Description', required: true, id: "description", label: "Description" },
        { name: 'start_date', type: 'date', required: true, id: "start_date", label: "Start Date" },
        { name: 'end_date', type: 'date', required: true, id: "end_date", label: "End Date" },
        { name: 'locations', type: 'text', placeholder: 'Locations (comma-separated)', required: true, id: "locations", label: "Locations" }
    ];

    fields.forEach(field => {
        const formGroup = document.createElement("div");
        formGroup.className = "form-group";
        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        input.name = field.name;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.required) input.required = true;

        // Create label if applicable
        if (field.label) {
            const label = document.createElement("label");
            label.setAttribute("for", field.id);
            label.textContent = field.label;
            formGroup.appendChild(label);
        }

        formGroup.appendChild(input);
        form.appendChild(formGroup);
        form.appendChild(document.createElement('br'));
    });

    // Status dropdown
    const statusSelect = document.createElement('select');
    statusSelect.name = 'status';
    ['Draft', 'Confirmed'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusSelect.appendChild(option);
    });
    form.appendChild(statusSelect);
    form.appendChild(document.createElement('br'));

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Create';
    form.appendChild(submitButton);

    const message = document.createElement('p');
    message.id = 'message';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        const itineraryData = {
            name: formData.get('name'),
            description: formData.get('description'),
            start_date: formData.get('start_date'),
            end_date: formData.get('end_date'),
            locations: formData.get('locations').split(',').map(loc => loc.trim()),
            status: formData.get('status')
        };

        try {
            const response = await apiFetch('/itineraries', 'POST', JSON.stringify(itineraryData));
            if (!response.ok) throw new Error('Failed to create itinerary');

            message.textContent = 'Itinerary created successfully!';
            setTimeout(() => window.location.href = '/itinerary', 1000);
        } catch (error) {
            console.error(error);
            message.textContent = 'Error creating itinerary.';
        }
    });

    divContainerNode.appendChild(heading);
    divContainerNode.appendChild(form);
    divContainerNode.appendChild(message);
}

export { createItinerary };
