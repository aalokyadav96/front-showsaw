import { apiFetch } from "../../api/api.js";
import { navigate, renderPage } from "../../routes/index.js";
import SnackBar from '../../components/ui/Snackbar.mjs';
import { createFormGroup } from "../../components/createFormGroup.js";
import Button from "../../components/base/Button.js";


async function updateEvent(isLoggedIn, eventId) {
    if (!isLoggedIn) {
        SnackBar("Please log in to update event.", 3000);
        return;
    }

    const title = document.getElementById("event-title").value.trim();
    const date = document.getElementById("event-date").value;
    const time = document.getElementById("event-time").value;
    const place = document.getElementById("event-place").value.trim();
    const location = document.getElementById("event-location").value.trim();
    const description = document.getElementById("event-description").value.trim();
    const bannerFile = document.getElementById("event-banner").files[0];

    // Validate input values
    if (!title || !date || !time || !place || !location || !description) {
        SnackBar("Please fill in all required fields.", 3000);
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('place', place);
    formData.append('location', location);
    formData.append('description', description);
    if (bannerFile) {
        formData.append('event-banner', bannerFile);
    }

    try {
        const result = await apiFetch(`/events/event/${eventId}`, 'PUT', formData);
        SnackBar(`Event updated successfully: ${result.title}`, 3000);
        navigate('/event/' + result.eventid);
        renderPage();
    } catch (error) {
        SnackBar(`Error updating event: ${error.message}`, 3000);
    }
}


async function editEventForm(isLoggedIn, eventId) {
    const createSection = document.getElementById("editevent");
    if (isLoggedIn) {
        try {
            // Fetch event data from the server (uncomment when the API is available)
            // const event = await apiFetch(`/event/${eventId}`);
            const eventx = await apiFetch(`/events/event/${eventId}`);
            console.log(eventx);
            // Clear the content of createSection
            createSection.innerHTML = '';

            // Create the form container
            const formContainer = document.createElement('div');
            formContainer.classList.add('form-container');

            const formHeading = document.createElement('h2');
            formHeading.textContent = 'Edit Event';

            // Create the form
            const form = document.createElement('form');
            form.id = 'edit-event-form';
            form.classList.add('edit-event-form');

            // Add form groups
            const formGroups = [
                { label: 'Event Title', inputType: 'text', inputId: 'event-title', inputValue: eventx.title, placeholder: 'Event Title', isRequired: true },
                { label: 'Event Date', inputType: 'date', inputId: 'event-date', inputValue: '2024-11-28', isRequired: true },
                { label: 'Event Time', inputType: 'time', inputId: 'event-time', inputValue: '00:00', isRequired: true },
                { label: 'Event Location', inputType: 'text', inputId: 'event-location', inputValue: eventx.location, placeholder: 'Location', isRequired: true },
                { label: 'Event Place', inputType: 'text', inputId: 'event-place', inputValue: eventx.place, placeholder: 'Place', isRequired: true },
                { label: 'Event Description', inputType: 'textarea', inputId: 'event-description', inputValue: eventx.description, placeholder: 'Description', isRequired: true },
                { label: 'Event Banner', inputType: 'file', inputId: 'event-banner', additionalProps: { accept: 'image/*' } },
            ];

            formGroups.forEach(group => {
                form.appendChild(createFormGroup(group));
            });

            // Update Button
            const updateButton = document.createElement('button');
            updateButton.type = 'submit';
            updateButton.classList.add('update-btn');
            updateButton.textContent = 'Update Event';
            form.appendChild(updateButton);

            // Cancel Button
            // const cancelButton = document.createElement('button');
            // cancelButton.type = 'button'; // Use 'button' to prevent it from acting as a submit button
            // cancelButton.classList.add('cancel-btn');
            // cancelButton.textContent = 'Cancel';
            // cancelButton.addEventListener('click', () => {
            //     navigate('/event/' + eventId); // Navigate back to the event page
            // });

            // form.appendChild(cancelButton);

            const cancelButton = Button("Cancel", "cancel-btn", {
                click: () => document.getElementById('editevent').innerHTML="",
            });
            cancelButton.type = 'button';
            form.appendChild(cancelButton);

            // Append form to formContainer
            formContainer.appendChild(formHeading);
            formContainer.appendChild(form);

            // Append formContainer to createSection
            createSection.appendChild(formContainer);

            // Attach event listener to the form for submitting the update
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await updateEvent(isLoggedIn, eventId);
            });

        } catch (error) {
            SnackBar(`Error loading event: ${error.message}`, 3000);
        }
    } else {
        navigate('/login');
    }
}


export { updateEvent, editEventForm };
