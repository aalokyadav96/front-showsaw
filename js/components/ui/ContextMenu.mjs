import "../../../css/ui/ContextMenu.css";

const ContextMenu = (options, x, y) => {
  // Remove any existing context menu before adding a new one
  const existingMenu = document.querySelector(".context-menu");
  if (existingMenu) existingMenu.remove();

  // Create the menu
  const menu = document.createElement("div");
  menu.className = "context-menu";

  options.forEach(({ label, action }) => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";
    menuItem.textContent = label;

    menuItem.addEventListener("click", (event) => {
      event.stopPropagation();
      action();
      menu.remove();
    });

    menu.appendChild(menuItem);
  });

  // Append menu to body
  document.body.appendChild(menu);

  // Ensure menu stays within the viewport
  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (x + menuWidth > viewportWidth) x = viewportWidth - menuWidth;
  if (y + menuHeight > viewportHeight) y = viewportHeight - menuHeight;

  menu.style.top = `${y}px`;
  menu.style.left = `${x}px`;

  // Close menu when clicking anywhere else
  const closeMenu = () => menu.remove();
  document.body.addEventListener("click", closeMenu, { once: true });

  // Close menu on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  }, { once: true });

  return menu;
};

export default ContextMenu;
