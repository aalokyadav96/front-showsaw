import { apiFetch } from "../../api/api.js";

function editItinerary(isLoggedIn, divContainerNode) {
    // Clear previous content
    divContainerNode.textContent = '';

    if (!isLoggedIn) {
        const message = document.createElement('p');
        message.textContent = 'Please log in to view and manage your itineraries.';
        divContainerNode.appendChild(message);
        return;
    }

    const heading = document.createElement('h2');
    heading.textContent = 'Edit Itinerary';

    const form = document.createElement('form');
    form.id = 'editItineraryForm';
    form.className = "create-section";

    const itineraryId = document.createElement('input');
    itineraryId.type = 'hidden';
    itineraryId.id = 'itineraryId';
    form.appendChild(itineraryId);

    const fields = [
        { name: 'name', type: 'text', placeholder: 'Itinerary Name', required: true, label: "Itinerary Name", id: "it-name" },
        { name: 'description', type: 'textarea', placeholder: 'Description', required: true, label: "Description", id: "it-description" },
        { name: 'start_date', type: 'date', required: true , label: "Start Date", id: "it-start_date"},
        { name: 'end_date', type: 'date', required: true, label: "End Date", id: "it-end_date" },
        { name: 'locations', type: 'text', placeholder: 'Locations (comma-separated)', required: true, label: "Locations", id: "it-locations" }
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
        input.id = field.name;
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
    statusSelect.id = 'status';
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
    submitButton.textContent = 'Update';
    form.appendChild(submitButton);

    const message = document.createElement('p');
    message.id = 'message';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const itineraryIdValue = itineraryId.value;
        const formData = new FormData(this);

        const updatedData = {
            name: formData.get('name'),
            description: formData.get('description'),
            start_date: formData.get('start_date'),
            end_date: formData.get('end_date'),
            locations: formData.get('locations').split(',').map(loc => loc.trim()),
            status: formData.get('status')
        };

        try {
            const response = await apiFetch(`/itineraries/${itineraryIdValue}`, 'PUT', JSON.stringify(updatedData));
            if (!response.ok) throw new Error('Failed to update itinerary');

            message.textContent = 'Itinerary updated successfully!';
            setTimeout(() => window.location.href = '/', 1000);
        } catch (error) {
            console.error(error);
            message.textContent = 'Error updating itinerary.';
        }
    });

    async function loadItinerary() {
        const urlParams = new URLSearchParams(window.location.search);
        const itineraryIdValue = urlParams.get('id');
        if (!itineraryIdValue) {
            message.textContent = 'No itinerary ID provided.';
            return;
        }

        try {
            const response = await apiFetch(`/itineraries/all/${itineraryIdValue}`, 'GET');
            // if (!response.ok) throw new Error('Failed to fetch itinerary');

            const itinerary = response;
            itineraryId.value = itinerary.itineraryid;
            document.getElementById('name').value = itinerary.name;
            document.getElementById('description').value = itinerary.description;
            document.getElementById('start_date').value = itinerary.start_date;
            document.getElementById('end_date').value = itinerary.end_date;
            document.getElementById('locations').value = itinerary.locations.join(', ');
            document.getElementById('status').value = itinerary.status;
        } catch (error) {
            console.error(error);
            message.textContent = 'Error loading itinerary details.';
        }
    }

    divContainerNode.appendChild(heading);
    divContainerNode.appendChild(form);
    divContainerNode.appendChild(message);

    loadItinerary();
}

export { editItinerary };
