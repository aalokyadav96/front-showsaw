const TicketCard = ({ isl ,creator, name, price, quantity, attributes = {}, onClick }) => {
  const card = document.createElement('div');
  card.className = 'ticket-card';

  // Add attributes dynamically
  Object.entries(attributes).forEach(([key, value]) => {
    card.setAttribute(key, value);
  });

  const nameElement = document.createElement('h3');
  nameElement.textContent = name;

  const priceElement = document.createElement('p');
  priceElement.textContent = `Price: $${(price / 100).toFixed(2)}`;

  const availableElement = document.createElement('p');
  availableElement.className = 'availability'; // For easier updates
  availableElement.textContent = `Available: ${quantity}`;

  card.appendChild(nameElement);
  card.appendChild(priceElement);
  card.appendChild(availableElement);

  if (!creator && isl) {
    const button = document.createElement('button');
    if (quantity > 0) {
      button.textContent = 'Buy Ticket';
      button.addEventListener('click', () => onClick(name, quantity));
    } else {
      button.textContent = 'Sold Out';
      button.style.backgroundColor = "#ddd";
      button.style.color = "#000";
      button.disabled = true;
    }
    card.appendChild(button);
  }

  return card;
};

export default TicketCard;


// // TicketCard component
// const TicketCard = ({ creator, name, price, quantity, onClick }) => {
//   const card = document.createElement('div');
//   card.className = 'ticket-card';

//   const nameElement = document.createElement('h3');
//   nameElement.textContent = name;

//   const priceElement = document.createElement('p');
//   priceElement.textContent = `Price: $${(price / 100).toFixed(2)}`;

//   const availableElement = document.createElement('p');
//   availableElement.textContent = `Available: ${quantity}`;

//   card.appendChild(nameElement);
//   card.appendChild(priceElement);
//   card.appendChild(availableElement);

//   if (!creator) {
//     const button = document.createElement('button');
//     card.appendChild(button);
//     if (quantity > 0) {
//       button.textContent = 'Buy Ticket';
//       button.addEventListener('click', () => onClick(name, quantity));
//     } else {
//       button.textContent = 'Sold Out';
//       button.style.backgroundColor = "#ddd";
//       button.style.color = "#000";
//       button.disabled = true;
//     }
//   }

//   return card;
// };

// export default TicketCard;


// // TicketCard component
// const TicketCard = ({ name, price, quantity, onClick }) => {
//   const card = document.createElement('div');
//   card.className = 'ticket-card';

//   const nameElement = document.createElement('h3');
//   nameElement.textContent = name;

//   const priceElement = document.createElement('p');
//   priceElement.textContent = `Price: $${(price / 100).toFixed(2)}`;

//   const availableElement = document.createElement('p');
//   availableElement.textContent = `Available: ${quantity}`;

//   const quantityInput = document.createElement('input');
//   quantityInput.type = 'number';
//   quantityInput.className = 'ticket-quantity-input';
//   quantityInput.min = "1";
//   quantityInput.max = Math.min(quantity, 5).toString();
//   quantityInput.value = "1";

//   const button = document.createElement('button');
//   if (quantity > 0) {
//     button.textContent = 'Buy Ticket';
//     button.addEventListener('click', (event) => onClick(event, quantityInput.value));
//   } else {
//     button.textContent = 'Sold Out';
//     button.style.backgroundColor = "#ddd";
//     button.style.color = "#000";
//     button.disabled = true;
//   }
//   card.appendChild(nameElement);
//   card.appendChild(priceElement);
//   card.appendChild(availableElement);
//   card.appendChild(quantityInput);
//   card.appendChild(button);

//   return card;
// };

// export default TicketCard;


// // const TicketCard = ({ name, price, quantity, onClick }) => {
// //   const card = document.createElement('div');
// //   card.className = 'ticket-card';

// //   const nameElement = document.createElement('h3');
// //   nameElement.textContent = name;

// //   const priceElement = document.createElement('p');
// //   priceElement.textContent = `Price: $${price}`;

// //   const availableElement = document.createElement('p');
// //   availableElement.textContent = `Available: $${quantity}`;

// //   const quantityInput = document.createElement('input');
// //   quantityInput.type = 'number';
// //   quantityInput.className = 'ticket-quantity-input';
// //   quantityInput.min = "1";
// //   quantityInput.max = "5";
// //   quantityInput.value = "1";

// //   const button = document.createElement('button');
// //   button.textContent = 'Buy Ticket';
// //   button.addEventListener('click', (event) => onClick(event));

// //   card.appendChild(nameElement);
// //   card.appendChild(priceElement);
// //   card.appendChild(availableElement);
// //   card.appendChild(quantityInput);
// //   card.appendChild(button);

// //   return card;
// // };

// //   export default TicketCard;
