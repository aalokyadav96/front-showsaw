import { apiFetch } from "../../api/api.js";

function createInputField({ name, type, placeholder, required, id, label }) {
    const formGroup = document.createElement("div");
    formGroup.className = "form-group";

    if (label) {
        const labelElem = document.createElement("label");
        labelElem.setAttribute("for", id);
        labelElem.textContent = label;
        formGroup.appendChild(labelElem);
    }

    const input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    if (type !== 'textarea') input.type = type;

    Object.assign(input, { name, id, placeholder, required });
    formGroup.appendChild(input);

    return formGroup;
}

function createStatusDropdown() {
    const group = document.createElement("div");
    group.className = "form-group";

    const label = document.createElement("label");
    label.setAttribute("for", "status");
    label.textContent = "Status";

    const select = document.createElement("select");
    select.name = "status";
    select.id = "status";

    ['Draft', 'Confirmed'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        select.appendChild(option);
    });

    group.appendChild(label);
    group.appendChild(select);
    return group;
}

function createItinerary(isLoggedIn, divContainerNode) {
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
        form.appendChild(createInputField(field));
        form.appendChild(document.createElement('br'));
    });

    form.appendChild(createStatusDropdown());
    form.appendChild(document.createElement('br'));

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Create';
    form.appendChild(submitButton);

    const message = document.createElement('p');
    message.id = 'message';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Creating...';
        message.textContent = '';
        message.className = '';

        const formData = new FormData(this);

        const locations = formData.get('locations')
            .split(',')
            .map(loc => loc.trim())
            .filter(loc => loc.length > 0);

        const itineraryData = {
            name: formData.get('name'),
            description: formData.get('description'),
            start_date: formData.get('start_date'),
            end_date: formData.get('end_date'),
            locations,
            status: formData.get('status')
        };

        if (new Date(itineraryData.end_date) < new Date(itineraryData.start_date)) {
            message.textContent = 'End date cannot be earlier than start date.';
            message.className = 'message error';
            submitButton.disabled = false;
            submitButton.textContent = 'Create';
            return;
        }

        if (locations.length === 0) {
            message.textContent = 'Please enter at least one valid location.';
            message.className = 'message error';
            submitButton.disabled = false;
            submitButton.textContent = 'Create';
            return;
        }

        try {
            const response = await apiFetch('/itineraries', 'POST', JSON.stringify(itineraryData));
            if (!response.ok) throw new Error('Failed to create itinerary');

            message.textContent = 'Itinerary created successfully!';
            message.className = 'message success';

            // SPA redirect or fallback
            setTimeout(() => {
                if (window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent("navigate", { detail: "/itinerary" }));
                } else {
                    window.location.href = '/itinerary';
                }
            }, 1000);
        } catch (error) {
            console.error(error);
            message.textContent = 'Error creating itinerary.';
            message.className = 'message error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Create';
        }
    });

    divContainerNode.appendChild(heading);
    divContainerNode.appendChild(form);
    divContainerNode.appendChild(message);
}

export { createItinerary };
