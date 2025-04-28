import "../../../css/ui/BookingForm.css";

const BookingForm = (onSubmit) => {
  const form = document.createElement("form");
  form.className = "booking-form";

  const htwo = document.createElement("h3");
  htwo.innerText = "Book a Table";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Your Name";
  nameInput.required = true;
  nameInput.name = "name";

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.required = true;
  dateInput.name = "date";

  // Prevent past dates
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  const seatsInput = document.createElement("input");
  seatsInput.type = "number";
  seatsInput.placeholder = "Number of Seats";
  seatsInput.min = 1;
  seatsInput.required = true;
  seatsInput.name = "seats";

  const message = document.createElement("div");
  message.className = "booking-message"; // style this in CSS

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Book Now";

  form.append(htwo, nameInput, dateInput, seatsInput, submitButton, message);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const date = dateInput.value;
    const seats = parseInt(seatsInput.value, 10);

    // Validation
    if (!name || name.length < 2) {
      message.innerText = "Please enter a valid name.";
      message.style.color = "crimson";
      return;
    }

    if (!date || new Date(date) < new Date(today)) {
      message.innerText = "Please choose a valid future date.";
      message.style.color = "crimson";
      return;
    }

    if (!seats || seats < 1) {
      message.innerText = "Please select at least 1 seat.";
      message.style.color = "crimson";
      return;
    }

    const bookingDetails = {
      name,
      date,
      seats,
    };

    try {
      onSubmit(bookingDetails);
      form.reset();
      message.innerText = "Booking confirmed!";
      message.style.color = "green";
    } catch (err) {
      message.innerText = "Booking failed. Try again.";
      message.style.color = "crimson";
    }
  });

  return form;
};

export default BookingForm;
