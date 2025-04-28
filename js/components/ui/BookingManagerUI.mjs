import "../../../css/ui/BookingManagerUI.css";

const BookingManagerUI = (onSlotActions, fetchBookingsByDate) => {
  const container = document.createElement("div");
  container.className = "booking-manager";

  const title = document.createElement("h3");
  title.innerText = "Manage Booking Slots";

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.required = true;

  const timeInput = document.createElement("input");
  timeInput.type = "time";
  timeInput.required = true;

  const capacityInput = document.createElement("input");
  capacityInput.type = "number";
  capacityInput.placeholder = "Capacity";
  capacityInput.min = 1;
  capacityInput.required = true;

  const addButton = document.createElement("button");
  addButton.textContent = "Add Slot";

  const message = document.createElement("div");
  message.className = "manager-message";

  const slotList = document.createElement("ul");
  slotList.className = "slot-list";

  const bookingCalendar = document.createElement("div");
  bookingCalendar.className = "booking-calendar";

  const updateSlotList = (slots) => {
    slotList.innerHTML = "";

    if (!slots.length) {
      const li = document.createElement("li");
      li.innerText = "No slots for selected date.";
      slotList.appendChild(li);
      return;
    }

    slots.forEach((slot, index) => {
      const li = document.createElement("li");
      li.innerText = `⏰ ${slot.time} - Seats: ${slot.capacity}`;

      const editBtn = document.createElement("button");
      editBtn.innerText = "✏️";
      editBtn.onclick = () => {
        timeInput.value = slot.time;
        capacityInput.value = slot.capacity;
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "🗑️";
      deleteBtn.onclick = () => {
        onSlotActions.delete(dateInput.value, slot.time);
        loadSlots(); // reload after deletion
      };

      li.append(editBtn, deleteBtn);
      slotList.appendChild(li);
    });
  };

  const loadSlots = () => {
    const selectedDate = dateInput.value;
    const slots = onSlotActions.get(selectedDate) || [];
    updateSlotList(slots);

    // Also load calendar bookings
    const bookings = fetchBookingsByDate(selectedDate) || [];
    bookingCalendar.innerHTML = `<h4>📅 Bookings for ${selectedDate}</h4>`;
    if (!bookings.length) {
      bookingCalendar.innerHTML += "<p>No bookings yet.</p>";
    } else {
      const ul = document.createElement("ul");
      bookings.forEach(b => {
        const li = document.createElement("li");
        li.innerText = `🪑 ${b.time} — ${b.name} (${b.seats} seats)`;
        ul.appendChild(li);
      });
      bookingCalendar.appendChild(ul);
    }
  };

  dateInput.addEventListener("change", loadSlots);

  addButton.addEventListener("click", () => {
    const date = dateInput.value;
    const time = timeInput.value;
    const capacity = parseInt(capacityInput.value);

    if (!date || !time || capacity < 1) {
      message.innerText = "Invalid input.";
      message.style.color = "crimson";
      return;
    }

    const success = onSlotActions.add(date, time, capacity);
    if (success) {
      message.innerText = "Slot added.";
      message.style.color = "green";
      timeInput.value = "";
      capacityInput.value = "";
      loadSlots();
    } else {
      message.innerText = "Slot exists or error.";
      message.style.color = "crimson";
    }
  });

  container.append(
    title,
    dateInput,
    timeInput,
    capacityInput,
    addButton,
    message,
    slotList,
    bookingCalendar
  );

  return container;
};

export default BookingManagerUI;

// import "../../../css/ui/BookingManagerUI.css";

// const BookingManagerUI = (onAddSlot) => {
//   const container = document.createElement("div");
//   container.className = "booking-manager";

//   const htwo = document.createElement("h3");
//   htwo.innerText = "Manage Bookings";

//   const timeInput = document.createElement("input");
//   timeInput.type = "time";
//   timeInput.required = true;
//   timeInput.name = "time";

//   const capacityInput = document.createElement("input");
//   capacityInput.type = "number";
//   capacityInput.placeholder = "Capacity";
//   capacityInput.min = 1;
//   capacityInput.required = true;
//   capacityInput.name = "capacity";

//   const addButton = document.createElement("button");
//   addButton.type = "button";
//   addButton.textContent = "Add Slot";

//   const message = document.createElement("div");
//   message.className = "manager-message";

//   const slotList = document.createElement("ul");
//   slotList.className = "slot-list";

//   const updateSlotList = (slots) => {
//     slotList.innerHTML = "";
//     if (!slots.length) {
//       const empty = document.createElement("li");
//       empty.textContent = "No slots added.";
//       slotList.appendChild(empty);
//       return;
//     }

//     slots.forEach(({ time, capacity }) => {
//       const li = document.createElement("li");
//       li.textContent = `Time: ${time}, Capacity: ${capacity}`;
//       slotList.appendChild(li);
//     });
//   };

//   addButton.addEventListener("click", () => {
//     const time = timeInput.value;
//     const capacity = parseInt(capacityInput.value, 10);

//     if (!time || capacity < 1) {
//       message.innerText = "Please enter a valid time and capacity.";
//       message.style.color = "crimson";
//       return;
//     }

//     const success = onAddSlot({ time, capacity });
//     if (success) {
//       message.innerText = "Slot added successfully!";
//       message.style.color = "green";
//       timeInput.value = "";
//       capacityInput.value = "";
//       updateSlotList(success); // success returns updated slots
//     } else {
//       message.innerText = "Slot already exists or invalid.";
//       message.style.color = "crimson";
//     }
//   });

//   container.append(htwo, timeInput, capacityInput, addButton, message, slotList);
//   return container;
// };

// export default BookingManagerUI;
