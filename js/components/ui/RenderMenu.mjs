import { displayMenu } from "../../services/menu/menuService.js";
import "../../../css/ui/renderMenu.css";

const renderMenu = (content, isCreator, placeId, isLoggedIn) => {
    displayMenu(content, placeId, isCreator, isLoggedIn)
};

export default renderMenu;


// import "../../../css/ui/renderMenu.css";
// import { createElement } from '../../components/createElement.js';
// import { Button } from '../../components/base/Button.js';

// const renderMenu = (content, isCreator, menu = []) => {
//     // Clear existing content
//     content.innerHTML = "";

//     if (isCreator) {
//         const addButton = Button("Add Menu", "add-menu-btn", {
//             click: () => showAddMenuForm(menu, menuSection),
//         });
//         content.appendChild(addButton);
//     }

//     if (menu.length == 0) {
//         content.appendChild(createElement('p', {}, ["No Menu available"]));
//     }

//     const menuSection = createElement('section', { id: 'menu', class: 'menu-section' }, [
//         ...menu.map(category =>
//             createElement('div', { class: 'menu-item' }, [
//                 createElement('h3', {}, [category.name]),
//                 ...category.items.map(item =>
//                     createElement('p', {}, [`${item.name} - $${item.price}`])
//                 )
//             ])
//         )
//     ]);

//     content.appendChild(menuSection);
// };

// // Show Add Menu Form
// const showAddMenuForm = (menu, menuSection) => {
//     const form = createElement('div', { class: 'add-menu-form' }, [
//         createElement('input', {
//             type: 'text',
//             class: 'category-name-input',
//             placeholder: 'Enter category name',
//         }),
//         createElement('input', {
//             type: 'text',
//             class: 'item-name-input',
//             placeholder: 'Enter item name',
//         }),
//         createElement('input', {
//             type: 'number',
//             class: 'item-price-input',
//             placeholder: 'Enter item price',
//         }),
//         Button("Add", "submit-menu-btn", {
//             click: () => handleAddMenu(menu, menuSection, form),
//         }),
//     ]);

//     menuSection.parentElement.insertBefore(form, menuSection); // Insert form above menu section
// };

// // Handle Add Menu
// const handleAddMenu = (menu, menuSection, form) => {
//     const categoryNameInput = form.querySelector(".category-name-input");
//     const itemNameInput = form.querySelector(".item-name-input");
//     const itemPriceInput = form.querySelector(".item-price-input");

//     const categoryName = categoryNameInput.value.trim();
//     const itemName = itemNameInput.value.trim();
//     const itemPrice = parseFloat(itemPriceInput.value);

//     if (!categoryName || !itemName || isNaN(itemPrice) || itemPrice <= 0) {
//         alert("Please fill out all fields correctly.");
//         return;
//     }

//     // Find or create the category
//     let category = menu.find(cat => cat.name === categoryName);
//     if (!category) {
//         category = { name: categoryName, items: [] };
//         menu.push(category);
//     }

//     // Add new item to category
//     category.items.push({ name: itemName, price: itemPrice });

//     // Re-render the menu
//     renderMenu(true, menuSection.parentElement, menu);

//     // Clear the form
//     form.remove();
// };

// export default renderMenu;
