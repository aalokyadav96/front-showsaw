import { apiFetch } from "../../api/api.js";

async function editTicket(ticketId, eventId) {
    try {
        // Fetch current ticket details from the backend
        const ticketData = await apiFetch(`/ticket/event/${eventId}/${ticketId}`, 'GET');

        if (!ticketData || !ticketData.ticketid) {
            alert("Failed to load ticket data.");
            return;
        }

        // Show the edit form with the ticket data populated
        const editEventDiv = document.getElementById('editevent');
        editEventDiv.innerHTML = `
            <h3>Edit Ticket</h3>
            <form id="edit-ticket-form">
                <input type="hidden" id="ticket-id" value="${ticketData.ticketid}" />
                <label for="ticket-name">Name:</label>
                <input type="text" id="ticket-name" value="${ticketData.name}" required />
                <label for="ticket-price">Price:</label>
                <input type="number" id="ticket-price" value="${ticketData.price}" required />
                <label for="ticket-quantity">Quantity Available:</label>
                <input type="number" id="ticket-quantity" value="${ticketData.quantity}" required />
                <button type="submit">Update Ticket</button>
            </form>
            <button id="cancel-edit-form">Cancel</button>
        `;

        // Attach event listeners
        document.getElementById('edit-ticket-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            updateTicket(ticketId, eventId);
        });
        document.getElementById('cancel-edit-form').addEventListener('click', clearTicketForm);
    } catch (error) {
        console.error("Error loading ticket data:", error);
        alert("An error occurred while loading the ticket data.");
    }
}

// Update the ticket
async function updateTicket(ticketId, eventId) {
    const name = document.getElementById('ticket-name').value.trim();
    const price = parseFloat(document.getElementById('ticket-price').value);
    const quantity = parseInt(document.getElementById('ticket-quantity').value);

    const updatedTicket = { name, price, quantity };

    try {
        const response = await apiFetch(`/ticket/event/${eventId}/${ticketId}`, 'PUT', JSON.stringify(updatedTicket), {
            'Content-Type': 'application/json'
        });

        if (response.success) {
            alert('Ticket updated successfully!');
            clearTicketForm();
            // Refresh tickets
        } else {
            alert(`Failed to update ticket: ${response.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error("Error updating ticket:", error);
        alert("An error occurred while updating the ticket.");
    }
}

// Clear ticket form
function clearTicketForm() {
    const editEventDiv = document.getElementById('editevent');
    editEventDiv.innerHTML = ""; // Clear the form content
}

async function deleteTicket(ticketId, eventId) {
    if (confirm('Are you sure you want to delete this ticket?')) {
        try {
            const response = await apiFetch(`/ticket/event/${eventId}/${ticketId}`, 'DELETE');

            // Check if the response was successful (status 200-299 range)
            if (response.success) {
                // Check if the response contains a message
                // const responseData = await response.json();
                // if (responseData.success) {
                alert('Ticket deleted successfully!');
                // Optionally, refresh the ticket list or update the UI
                // displayEvent(eventId); // Uncomment if you have access to eventId
                // }
            } else {
                // Handle cases where response is not OK (i.e., status 400 or 500 range)
                const errorData = await response.json();
                alert(`Failed to delete ticket: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('An error occurred while deleting the ticket.');
        }
    }
}


export { clearTicketForm, deleteTicket, editTicket };