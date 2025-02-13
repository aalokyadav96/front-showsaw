// import { createElement } from '../../components/createElement.js';
// import { Button } from '../../components/base/Button.js';
// import { apiFetch } from '../../api/api.js';

// const renderMenu = async (isCreator, content, menu = []) => {
//     // Clear existing content
//     content.innerHTML = "";

//     // Fetch menu from API
//     const menu = await fetchMenu();

//     if (isCreator) {
//         const addButton = Button("Add Menu", "add-menu-btn", {
//             click: () => showAddMenuForm(menu, content),
//         });
//         content.appendChild(addButton);
//     }

//     const menuSection = createElement('section', { id: 'menu', class: 'menu-section' }, [
//         ...menu.map(category =>
//             createElement('div', { class: 'menu-item' }, [
//                 createElement('h3', {}, [category.name]),
//                 ...category.items.map(item =>
//                     createElement('div', { class: 'menu-item-row' }, [
//                         createElement('p', {}, [`${item.name} - $${item.price}`]),
//                         isCreator ? createElement('div', { class: 'actions' }, [
//                             Button("✏️", "edit-item-btn", {
//                                 click: () => showEditItemForm(menu, category, item, content),
//                             }),
//                             Button("🗑️", "delete-item-btn", {
//                                 click: () => deleteMenuItem(menu, category, item, content),
//                             })
//                         ]) : null
//                     ])
//                 ),
//                 isCreator ? Button("🗑️ Delete Category", "delete-category-btn", {
//                     click: () => deleteCategory(menu, category, content),
//                 }) : null
//             ])
//         )
//     ]);

//     content.appendChild(menuSection);
// };

// // **Fetch Menu from API**
// const fetchMenu = async () => {
//     try {
//         const response = await apiFetch(`${API_URL}`);
//         return response.data || [];
//     } catch (error) {
//         console.error("Failed to fetch menu:", error);
//         return [];
//     }
// };

// // **Show Add Menu Form**
// const showAddMenuForm = (menu, content) => {
//     const form = createElement('div', { class: 'add-menu-form' }, [
//         createElement('input', { type: 'text', class: 'category-name-input', placeholder: 'Category name' }),
//         createElement('input', { type: 'text', class: 'item-name-input', placeholder: 'Item name' }),
//         createElement('input', { type: 'number', class: 'item-price-input', placeholder: 'Item price' }),
//         Button("Add", "submit-menu-btn", {
//             click: () => handleAddMenu(menu, content, form),
//         }),
//     ]);

//     content.insertBefore(form, content.querySelector("#menu"));
// };

// // **Handle Add Menu**
// const handleAddMenu = async (menu, content, form) => {
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

//     try {
//         const response = await apiFetch(`${API_URL}`, "POST", { categoryName, itemName, itemPrice });
//         if (response.success) {
//             renderMenu(true, content);
//         }
//     } catch (error) {
//         console.error("Failed to add menu item:", error);
//     }

//     form.remove();
// };

// // **Show Edit Item Form**
// const showEditItemForm = (menu, category, item, content) => {
//     const form = createElement('div', { class: 'edit-menu-form' }, [
//         createElement('input', { type: 'text', class: 'item-name-input', value: item.name }),
//         createElement('input', { type: 'number', class: 'item-price-input', value: item.price }),
//         Button("Save", "save-item-btn", {
//             click: () => handleEditMenuItem(menu, category, item, content, form),
//         }),
//         Button("Cancel", "cancel-edit-btn", { click: () => form.remove() }),
//     ]);

//     content.insertBefore(form, content.querySelector("#menu"));
// };

// // **Handle Edit Menu Item**
// const handleEditMenuItem = async (menu, category, item, content, form) => {
//     const itemNameInput = form.querySelector(".item-name-input");
//     const itemPriceInput = form.querySelector(".item-price-input");

//     const updatedName = itemNameInput.value.trim();
//     const updatedPrice = parseFloat(itemPriceInput.value);

//     if (!updatedName || isNaN(updatedPrice) || updatedPrice <= 0) {
//         alert("Please enter valid values.");
//         return;
//     }

//     try {
//         const response = await apiFetch(`${API_URL}/${item.id}`, "PUT", { name: updatedName, price: updatedPrice });
//         if (response.success) {
//             renderMenu(true, content);
//         }
//     } catch (error) {
//         console.error("Failed to update menu item:", error);
//     }

//     form.remove();
// };

// // **Delete Menu Item**
// const deleteMenuItem = async (menu, category, item, content) => {
//     if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

//     try {
//         const response = await apiFetch(`/place/${placeid}/menu/${item.id}`, "DELETE");
//         if (response.success) {
//             renderMenu(true, content);
//         }
//     } catch (error) {
//         console.error("Failed to delete menu item:", error);
//     }
// };

// // **Delete Category**
// const deleteCategory = async (menu, category, content) => {
//     if (!confirm(`Are you sure you want to delete "${category.name}"? This will remove all items in this category.`)) return;

//     try {
//         const response = await apiFetch(`/place/${placeid}/menu/${menuid}/category/${category.id}`, "DELETE");
//         if (response.success) {
//             renderMenu(true, content);
//         }
//     } catch (error) {
//         console.error("Failed to delete category:", error);
//     }
// };

// export default renderMenu;

import { createElement } from '../../components/createElement.js';
import { Button } from '../../components/base/Button.js';

const renderMenu = (isCreator, content, menu = []) => {
    // Clear existing content
    content.innerHTML = "";

    if (isCreator) {
        const addButton = Button("Add Menu", "add-menu-btn", {
            click: () => showAddMenuForm(menu, menuSection),
        });
        content.appendChild(addButton);
    }

    const menuSection = createElement('section', { id: 'menu', class: 'menu-section' }, [
        ...menu.map(category =>
            createElement('div', { class: 'menu-item' }, [
                createElement('h3', {}, [category.name]),
                ...category.items.map(item =>
                    createElement('p', {}, [`${item.name} - $${item.price}`])
                )
            ])
        )
    ]);

    content.appendChild(menuSection);
};

// Show Add Menu Form
const showAddMenuForm = (menu, menuSection) => {
    const form = createElement('div', { class: 'add-menu-form' }, [
        createElement('input', {
            type: 'text',
            class: 'category-name-input',
            placeholder: 'Enter category name',
        }),
        createElement('input', {
            type: 'text',
            class: 'item-name-input',
            placeholder: 'Enter item name',
        }),
        createElement('input', {
            type: 'number',
            class: 'item-price-input',
            placeholder: 'Enter item price',
        }),
        Button("Add", "submit-menu-btn", {
            click: () => handleAddMenu(menu, menuSection, form),
        }),
    ]);

    menuSection.parentElement.insertBefore(form, menuSection); // Insert form above menu section
};

// Handle Add Menu
const handleAddMenu = (menu, menuSection, form) => {
    const categoryNameInput = form.querySelector(".category-name-input");
    const itemNameInput = form.querySelector(".item-name-input");
    const itemPriceInput = form.querySelector(".item-price-input");

    const categoryName = categoryNameInput.value.trim();
    const itemName = itemNameInput.value.trim();
    const itemPrice = parseFloat(itemPriceInput.value);

    if (!categoryName || !itemName || isNaN(itemPrice) || itemPrice <= 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Find or create the category
    let category = menu.find(cat => cat.name === categoryName);
    if (!category) {
        category = { name: categoryName, items: [] };
        menu.push(category);
    }

    // Add new item to category
    category.items.push({ name: itemName, price: itemPrice });

    // Re-render the menu
    renderMenu(true, menuSection.parentElement, menu);

    // Clear the form
    form.remove();
};

export default renderMenu;
