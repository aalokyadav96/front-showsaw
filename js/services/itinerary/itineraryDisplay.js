import {apiFetch} from "../../api/api.js"; 
// itinerary.js
function displayItinerary(isLoggedIn, divContainerNode) {
    // Clear previous content
    divContainerNode.innerHTML = '';
  
    if (!isLoggedIn) {
      divContainerNode.innerHTML =
        '<p>Please log in to view and manage your itineraries.</p>';
      return;
    }
  
    // --- Search Form ---
    const searchForm = document.createElement('form');
    searchForm.id = 'searchForm';
    searchForm.innerHTML = `
      <input type="text" name="start_date" placeholder="Start Date (YYYY-MM-DD)">
      <input type="text" name="location" placeholder="Location">
      <input type="text" name="status" placeholder="Status (Draft/Confirmed)">
      <button type="submit">Search</button>
    `;
    divContainerNode.appendChild(searchForm);
  
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(searchForm);
      const query = new URLSearchParams();
      for (const pair of formData.entries()) {
        if (pair[1].trim() !== '') query.append(pair[0], pair[1].trim());
      }
      searchItineraries(query.toString());
    });
  
    // --- Create Itinerary Button ---
    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create Itinerary';
    createBtn.addEventListener('click', () => {
      // Navigate to the itinerary creation page
      window.location.href = '/create-itinerary';
    });
    divContainerNode.appendChild(createBtn);
  
    // --- Itinerary List Container ---
    const listDiv = document.createElement('div');
    listDiv.id = 'itineraryList';
    divContainerNode.appendChild(listDiv);
  
    // --- Load and Render All Itineraries Initially ---
    loadItineraries();
  
    // ---------- Helper Functions ----------
  
    // Load itineraries using GET /api/itineraries
    async function loadItineraries() {
      try {
        const response = await apiFetch('/itineraries');
        const itineraries = response;
        renderItineraryList(itineraries);
      } catch (error) {
        console.error(error);
        listDiv.innerHTML = '<p>Error loading itineraries.</p>';
      }
    }
  
    // Render the itinerary list with action buttons
    function renderItineraryList(itineraries) {
      listDiv.innerHTML = '';
      if (itineraries.length === 0) {
        listDiv.innerHTML = '<p>No itineraries found.</p>';
        return;
      }
      const ul = document.createElement('ul');
      itineraries.forEach((itinerary) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${itinerary.name}</strong> (${itinerary.status})`;
  
        // --- View Button: Uses GET /api/itineraries/all/:id ---
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.addEventListener('click', () => viewItinerary(itinerary.itineraryid));
        li.appendChild(viewBtn);
  
        // --- Edit Button: Navigate to edit page (uses PUT /api/itineraries/:id later) ---
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editItinerary(itinerary.itineraryid));
        li.appendChild(editBtn);
  
        // --- Delete Button: Uses DELETE /api/itineraries/:id ---
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteItinerary(itinerary.itineraryid));
        li.appendChild(deleteBtn);
  
        // --- Fork Button: Uses POST /api/itineraries/:id/fork ---
        const forkBtn = document.createElement('button');
        forkBtn.textContent = 'Fork';
        forkBtn.addEventListener('click', () => forkItinerary(itinerary.itineraryid));
        li.appendChild(forkBtn);
  
        // --- Publish Button: Uses PUT /api/itineraries/:id/publish ---
        // Only show if not yet published
        if (!itinerary.published) {
          const publishBtn = document.createElement('button');
          publishBtn.textContent = 'Publish';
          publishBtn.addEventListener('click', () =>
            publishItinerary(itinerary.itineraryid)
          );
          li.appendChild(publishBtn);
        }
        ul.appendChild(li);
      });
      listDiv.appendChild(ul);
    }
  
    // View a single itinerary using GET /api/itineraries/all/:id
    async function viewItinerary(id) {
      try {
        const response = await apiFetch(`/itineraries/all/${id}`);
        const itinerary = response;
        // For this example, we'll simply alert the details.
        // In a real app, navigate to a detailed view page.
        alert(JSON.stringify(itinerary, null, 2));
      } catch (error) {
        console.error(error);
        alert('Error loading itinerary details');
      }
    }
  
    // Edit an itinerary (navigate to an edit page)
    async function editItinerary(id) {
      // Navigate to the edit page with the itinerary ID as a query parameter.
      window.location.href = `/edit-itinerary?id=${id}`;
    }
  
    // Delete an itinerary using DELETE /api/itineraries/:id
    async function deleteItinerary(id) {
      if (!confirm('Are you sure you want to delete this itinerary?')) return;
      try {
        const response = await apiFetch(`/itineraries/${id}`, 'DELETE');
        alert('Itinerary deleted successfully');
        // Refresh the list
        loadItineraries();
      } catch (error) {
        console.error(error);
        alert('Error deleting itinerary');
      }
    }
  
    // Fork an itinerary using POST /api/itineraries/:id/fork
    async function forkItinerary(id) {
      try {
        const response = await apiFetch(`/itineraries/${id}/fork`,'POST');
        alert('Itinerary forked successfully');
        // Refresh the list
        loadItineraries();
      } catch (error) {
        console.error(error);
        alert('Error forking itinerary');
      }
    }
  
    // Publish an itinerary using PUT /api/itineraries/:id/publish
    async function publishItinerary(id) {
      try {
        const response = await apiFetch(`/itineraries/${id}/publish`, 'PUT');
        alert('Itinerary published successfully');
        // Refresh the list
        loadItineraries();
      } catch (error) {
        console.error(error);
        alert('Error publishing itinerary');
      }
    }
  
    // Search itineraries using GET /api/itineraries/search
    async function searchItineraries(queryString) {
      try {
        const response = await apiFetch(`/itineraries/search?${queryString}`);
        const itineraries = response;
        renderItineraryList(itineraries);
      } catch (error) {
        console.error(error);
        alert('Error searching itineraries');
      }
    }
  }
  
  export { displayItinerary };
  