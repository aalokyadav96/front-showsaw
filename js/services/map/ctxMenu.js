import ContextMenu from "../../components/ui/ContextMenu.mjs";

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    alert("f");
    const menuOptions = [
      { label: "Option 1", action: () => console.log("Option 1 clicked") },
      { label: "Option 2", action: () => console.log("Option 2 clicked") },
      { label: "Option 3", action: () => console.log("Option 3 clicked") },
    ];
  
    ContextMenu(menuOptions, event.pageX, event.pageY);
  });
  