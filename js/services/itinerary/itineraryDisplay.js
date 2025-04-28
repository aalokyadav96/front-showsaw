import { apiFetch } from "../../api/api.js";
import { navigate } from "../../routes/index.js";
import { editItinerary } from "./itineraryEdit.js";

function displayItinerary(isLoggedIn, divContainerNode) {
  divContainerNode.innerHTML = '';

  if (!isLoggedIn) {
    divContainerNode.innerHTML = '<p>Please log in to view and manage your itineraries.</p>';
    return;
  }

  // Main container layout: list on the left, details on the right
  const layout = document.createElement('div');
  layout.className = 'itinerary-layout';

  const leftPane = document.createElement('div');
  leftPane.className = 'itinerary-left';

  const rightPane = document.createElement('div');
  rightPane.className = 'itinerary-right';
  rightPane.innerHTML = '<p>Select an itinerary to see details here.</p>';

  layout.append(leftPane, rightPane);
  divContainerNode.appendChild(layout);

  // --- Search Form ---
  const searchForm = document.createElement('form');
  searchForm.id = 'searchForm';
  searchForm.innerHTML = `
    <input type="text" name="start_date" placeholder="Start Date (YYYY-MM-DD)">
    <input type="text" name="location" placeholder="Location">
    <input type="text" name="status" placeholder="Status (Draft/Confirmed)">
    <button type="submit">Search</button>
  `;

  // --- Create Button ---
  const createBtn = document.createElement('button');
  createBtn.textContent = 'Create Itinerary';
  createBtn.className = 'itinerary-create-btn';
  createBtn.addEventListener('click', () => navigate('/create-itinerary'));

  const listDiv = document.createElement('div');
  listDiv.id = 'itineraryList';

  leftPane.append(searchForm, createBtn, listDiv);

  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const qs = new URLSearchParams();
    for (let [k, v] of formData.entries()) {
      if (v.trim()) qs.append(k, v.trim());
    }
    searchItineraries(qs.toString());
  });

  loadItineraries();

  // --- Core Methods ---

  async function loadItineraries() {
    listDiv.innerHTML = '<p>Loading...</p>';
    try {
      const list = await apiFetch('/itineraries');
      renderItineraryList(list);
    } catch {
      listDiv.innerHTML = '<p>Error loading itineraries.</p>';
    }
  }

  async function searchItineraries(qs) {
    listDiv.innerHTML = '<p>Searching...</p>';
    try {
      const list = await apiFetch(`/itineraries/search?${qs}`);
      renderItineraryList(list);
    } catch {
      listDiv.innerHTML = '<p>Error searching itineraries.</p>';
    }
  }

  function renderItineraryList(itineraries) {
    listDiv.innerHTML = '';
    if (!itineraries.length) {
      listDiv.innerHTML = '<p>No itineraries found.</p>';
      return;
    }
    const ul = document.createElement('ul');
    itineraries.forEach(it => ul.appendChild(createItineraryListItem(it)));
    listDiv.appendChild(ul);
  }

  function createItineraryListItem(it) {
    const li = document.createElement('li');
    li.style.marginBottom = '10px';
    li.innerHTML = `<strong>${it.name}</strong> (${it.status}) `;

    const buttons = [
      { label: 'View',    fn: () => viewItinerary(it.itineraryid) },
      { label: 'Edit',    fn: () => editItinerary(isLoggedIn, rightPane, it.itineraryid) },
      { label: 'Delete',  fn: () => deleteItinerary(it.itineraryid) },
      { label: 'Fork',    fn: () => forkItinerary(it.itineraryid) },
      // only show Publish if not already published
      ...(it.published ? [] : [{ label: 'Publish', fn: () => publishItinerary(it.itineraryid) }])
    ];

    buttons.forEach(({ label, fn }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.marginLeft = '5px';
      btn.addEventListener('click', fn);
      li.appendChild(btn);
    });

    return li;
  }

  async function viewItinerary(id) {
    rightPane.innerHTML = '<p>Loading details…</p>';
    try {
      const it = await apiFetch(`/itineraries/all/${id}`);
      renderItineraryDetails(it);
    } catch {
      rightPane.innerHTML = '<p>Error loading itinerary details.</p>';
    }
  }

  function renderItineraryDetails(it) {
    // Clear and build header
    rightPane.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = it.name;
    const meta = document.createElement('p');
    meta.innerHTML = `
      <strong>Status:</strong> ${it.status} &nbsp;|&nbsp;
      <strong>Start:</strong> ${it.start_date} &nbsp;|&nbsp;
      <strong>End:</strong> ${it.end_date}
    `;
    const desc = document.createElement('p');
    desc.innerHTML = `<strong>Description:</strong> ${it.description || 'N/A'}`;

    rightPane.append(h2, meta, desc);

    // Render each day
    if (!Array.isArray(it.days) || it.days.length === 0) {
      rightPane.append(document.createElement('p').appendChild(document.createTextNode('No schedule available.')));
      return;
    }

    it.days.forEach((day, di) => {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'itinerary-day';

      const dayHeader = document.createElement('h3');
      dayHeader.textContent = `Day ${di + 1}: ${day.date}`;
      dayDiv.appendChild(dayHeader);

      day.visits.forEach((visit, vi) => {
        const visitDiv = document.createElement('div');
        visitDiv.className = 'itinerary-visit';

        const timeP = document.createElement('p');
        timeP.innerHTML = `<strong>Time:</strong> ${visit.start_time} – ${visit.end_time}`;

        const locP = document.createElement('p');
        locP.innerHTML = `<strong>Location:</strong> ${visit.location}`;

        visitDiv.append(timeP, locP);

        // Transport only for visits after the first one
        if (vi > 0 && visit.transport) {
          const transP = document.createElement('p');
          transP.innerHTML = `<strong>Transport:</strong> ${visit.transport}`;
          visitDiv.appendChild(transP);
        }

        dayDiv.appendChild(visitDiv);
      });

      rightPane.appendChild(dayDiv);
    });
  }

  function editItineraryHandler(isLoggedIn, pane, id) {
    pane.innerHTML = '';
    editItinerary(isLoggedIn, pane, id);
  }

  async function deleteItinerary(id) {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    try {
      await apiFetch(`/itineraries/${id}`, 'DELETE');
      alert('Itinerary deleted successfully');
      loadItineraries();
      rightPane.innerHTML = '<p>Select an itinerary to see details here.</p>';
    } catch {
      alert('Error deleting itinerary');
    }
  }

  async function forkItinerary(id) {
    try {
      await apiFetch(`/itineraries/${id}/fork`, 'POST');
      alert('Itinerary forked successfully');
      loadItineraries();
    } catch {
      alert('Error forking itinerary');
    }
  }

  async function publishItinerary(id) {
    try {
      await apiFetch(`/itineraries/${id}/publish`, 'PUT');
      alert('Itinerary published successfully');
      loadItineraries();
    } catch {
      alert('Error publishing itinerary');
    }
  }
}

export { displayItinerary };

// import { apiFetch } from "../../api/api.js";
// import { navigate } from "../../routes/index.js";
// import { editItinerary } from "./itineraryEdit.js";

// function displayItinerary(isLoggedIn, divContainerNode) {
//   divContainerNode.innerHTML = '';

//   if (!isLoggedIn) {
//     divContainerNode.innerHTML = '<p>Please log in to view and manage your itineraries.</p>';
//     return;
//   }

//   // Main container layout: list on the left, details on the right
//   const layout = document.createElement('div');
//   layout.className = 'itinerary-layout';

//   // Left side (List + Search)
//   const leftPane = document.createElement('div');
//   leftPane.className = 'itinerary-left';

//   // Right side (Details)
//   const rightPane = document.createElement('div');
//   rightPane.className = 'itinerary-right';
//   rightPane.innerHTML = '<p>Select an itinerary to see details here.</p>';

//   layout.appendChild(leftPane);
//   layout.appendChild(rightPane);
//   divContainerNode.appendChild(layout);

//   // --- Search Form ---
//   const searchForm = document.createElement('form');
//   searchForm.id = 'searchForm';
//   searchForm.innerHTML = `
//     <input type="text" name="start_date" placeholder="Start Date (YYYY-MM-DD)">
//     <input type="text" name="location" placeholder="Location">
//     <input type="text" name="status" placeholder="Status (Draft/Confirmed)">
//     <button type="submit">Search</button>
//   `;
  
//   // --- Create Button ---
//   const createBtn = document.createElement('button');
//   createBtn.textContent = 'Create Itinerary';
//   createBtn.className = 'itinerary-create-btn';
//   createBtn.addEventListener('click', () => navigate('/create-itinerary'));
//   leftPane.appendChild(createBtn);

//   // --- List Container ---
//   const listDiv = document.createElement('div');
//   listDiv.id = 'itineraryList';
//   leftPane.appendChild(listDiv);

//   searchForm.addEventListener('submit', function (e) {
//     e.preventDefault();
//     const formData = new FormData(searchForm);
//     const query = new URLSearchParams();
//     for (const [key, value] of formData.entries()) {
//       if (value.trim()) query.append(key, value.trim());
//     }
//     searchItineraries(query.toString());
//   });

//   loadItineraries();

//   // ---------- Core Methods ----------

//   async function loadItineraries() {
//     listDiv.innerHTML = '<p>Loading...</p>';
//     try {
//       const itineraries = await apiFetch('/itineraries');
//       renderItineraryList(itineraries);
//     } catch (err) {
//       console.error(err);
//       listDiv.innerHTML = '<p>Error loading itineraries.</p>';
//     }
//   }

//   async function searchItineraries(queryString) {
//     listDiv.innerHTML = '<p>Searching...</p>';
//     try {
//       const itineraries = await apiFetch(`/itineraries/search?${queryString}`);
//       renderItineraryList(itineraries);
//     } catch (err) {
//       console.error(err);
//       listDiv.innerHTML = '<p>Error searching itineraries.</p>';
//     }
//   }

//   function renderItineraryList(itineraries) {
//     listDiv.innerHTML = '';
//     if (itineraries.length === 0) {
//       listDiv.innerHTML = '<p>No itineraries found.</p>';
//       return;
//     }

//     const ul = document.createElement('ul');
//     itineraries.forEach(itinerary => ul.appendChild(createItineraryListItem(itinerary)));
//     listDiv.appendChild(ul);
//   }

//   function createItineraryListItem(itinerary) {
//     const li = document.createElement('li');
//     li.style.marginBottom = '10px';
//     li.innerHTML = `<strong>${itinerary.name}</strong> (${itinerary.status}) `;

//     const actions = [
//       { text: 'View', handler: () => viewItinerary(itinerary.itineraryid) },
//       { text: 'Edit', handler: () => editxItinerary(isLoggedIn, itinerary.itineraryid) },
//       { text: 'Delete', handler: () => deleteItinerary(itinerary.itineraryid) },
//       { text: 'Fork', handler: () => forkItinerary(itinerary.itineraryid) },
//     ];

//     if (!itinerary.published) {
//       actions.push({ text: 'Publish', handler: () => publishItinerary(itinerary.itineraryid) });
//     }

//     actions.forEach(({ text, handler }) => {
//       const btn = document.createElement('button');
//       btn.textContent = text;
//       btn.style.marginLeft = '5px';
//       btn.addEventListener('click', handler);
//       li.appendChild(btn);
//     });

//     return li;
//   }

//   async function viewItinerary(id) {
//     try {
//       const itinerary = await apiFetch(`/itineraries/all/${id}`);
//       renderItineraryDetails(itinerary);
//     } catch (err) {
//       console.error(err);
//       rightPane.innerHTML = '<p>Error loading itinerary details.</p>';
//     }
//   }

//   function renderItineraryDetails(itinerary) {
//     rightPane.innerHTML = `
//       <h2>${itinerary.name}</h2>
//       <p><strong>Status:</strong> ${itinerary.status}</p>
//       <p><strong>Location:</strong> ${itinerary.location}</p>
//       <p><strong>Start Date:</strong> ${itinerary.start_date}</p>
//       <p><strong>End Date:</strong> ${itinerary.end_date}</p>
//       <p><strong>Description:</strong> ${itinerary.description || 'N/A'}</p>
//     `;
//   }

//   function editxItinerary(isLoggedIn, id) {
//     // navigate(`/edit-itinerary?id=${id}`);
//     rightPane.innerHTML = "";
//     editItinerary(isLoggedIn, rightPane, id);
//   }

//   async function deleteItinerary(id) {
//     if (!confirm('Are you sure you want to delete this itinerary?')) return;
//     try {
//       await apiFetch(`/itineraries/${id}`, 'DELETE');
//       alert('Itinerary deleted successfully');
//       loadItineraries();
//       rightPane.innerHTML = '<p>Select an itinerary to see details here.</p>';
//     } catch (err) {
//       console.error(err);
//       alert('Error deleting itinerary');
//     }
//   }

//   async function forkItinerary(id) {
//     try {
//       await apiFetch(`/itineraries/${id}/fork`, 'POST');
//       alert('Itinerary forked successfully');
//       loadItineraries();
//     } catch (err) {
//       console.error(err);
//       alert('Error forking itinerary');
//     }
//   }

//   async function publishItinerary(id) {
//     try {
//       await apiFetch(`/itineraries/${id}/publish`, 'PUT');
//       alert('Itinerary published successfully');
//       loadItineraries();
//     } catch (err) {
//       console.error(err);
//       alert('Error publishing itinerary');
//     }
//   }
// }

// export { displayItinerary };
