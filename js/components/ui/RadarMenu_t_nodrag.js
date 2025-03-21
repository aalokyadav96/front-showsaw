// RadarMenu.js
import "../../../css/ui/RadarMenu.css";

const RadarMenu = (menuItems = [], options = {}) => {
  const {
    buttonText = "+",
    menuSize = 560,    // overall width/height of the circular menu in px
    radius = 112,      // distance from center to each item (approximately)
    baseAngle = 270,   // initial rotation applied to the ring (matches Naver’s UI)
    startAngle = 0     // additional rotation offset (can be adjusted)
  } = options;

  // Current rotation offset (updated on wheel or touch drag)
  let angleOffset = startAngle;

  // For touch support: store the initial touch angle relative to the center.
  let initialTouchAngle = null;

  // Create the outer wrapper (centers button & menu)
  const wrapper = document.createElement("div");
  wrapper.classList.add("radar-wrapper");

  // Create the toggle button
  const toggleButton = document.createElement("div");
  toggleButton.classList.add("naver-button");
  toggleButton.textContent = buttonText;

  // Create the circular menu container
  const radarMenu = document.createElement("div");
  radarMenu.classList.add("radar-menu");
  radarMenu.style.width = `${menuSize}px`;
  radarMenu.style.height = `${menuSize}px`;

  // Inner container similar to Naver’s .sr_tool_wrap
  const toolWrap = document.createElement("div");
  toolWrap.classList.add("sr_tool_wrap");

  // Create the rotating list container (like Naver’s .sr_tool_list)
  const toolList = document.createElement("ul");
  toolList.classList.add("sr_tool_list");
  // The entire list rotates by (baseAngle + angleOffset)
  toolList.style.transform = `rotate(${baseAngle + angleOffset}deg)`;

  // Center of the menu (for computing positions)
  const center = menuSize / 2;
  const itemSize = 50; // width and height for each menu item

  // Create list items based on provided menuItems
  const generateMenuItems = () => {
    toolList.innerHTML = ""; // clear any existing items
    const totalItems = menuItems.length;
    
    menuItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.classList.add("sr_tool_item");

      // Compute the item’s angle (evenly spaced around the circle)
      // Angle 0 means “top” (12 o’clock)
      const angle = (360 / totalItems) * index; // in degrees
      const rad = angle * (Math.PI / 180); // convert to radians

      // Compute x,y positions relative to the center of the menu
      // Using: x = center + r * sin(angle) - halfItemWidth
      //         y = center - r * cos(angle) - halfItemHeight
      const left = center - (itemSize / 2) + radius * Math.sin(rad);
      const top = center - (itemSize / 2) - radius * Math.cos(rad);
      li.style.left = `${left}px`;
      li.style.top = `${top}px`;

      // Do NOT rotate the li.
      // Instead, we will counter-rotate the inner <a> element.

      // Create a link inside the li (similar to Naver’s <a class="sr_tool_a">)
      const a = document.createElement("a");
      a.classList.add("sr_tool_a");
      a.href = "#";
      a.textContent = item.text;

      // Counter rotate the <a> so that it remains upright:
      a.style.transform = `rotate(-${baseAngle + angleOffset}deg)`;

      // On click, show a quick pop animation then run the action.
      a.addEventListener("click", (e) => {
        e.preventDefault();
        li.style.animation = "clickEffect 0.3s ease-in-out";
        setTimeout(() => {
          li.style.animation = "";
          radarMenu.classList.remove("active");
        }, 300);
        if (item.action) {
          item.action();
        }
      });

      li.appendChild(a);
      toolList.appendChild(li);
    });
  };

  // Generate items once initially.
  generateMenuItems();

  // Build the structure:
  toolWrap.appendChild(toolList);
  radarMenu.appendChild(toolWrap);
  wrapper.appendChild(toggleButton);
  wrapper.appendChild(radarMenu);

  // Function to update the rotations on toolList and each <a>
  const updateRotations = () => {
    const totalRotation = baseAngle + angleOffset;
    toolList.style.transform = `rotate(${totalRotation}deg)`;
    Array.from(toolList.querySelectorAll(".sr_tool_a")).forEach((a) => {
      a.style.transform = `rotate(-${totalRotation}deg)`;
    });
  };

  // Toggle the circular menu when the button is clicked
  toggleButton.addEventListener("click", (e) => {
    e.stopPropagation();
    radarMenu.classList.toggle("active");
    if (radarMenu.classList.contains("active")) {
      generateMenuItems();
      updateRotations();
    }
  });

  // Close menu if user clicks outside the component
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      radarMenu.classList.remove("active");
    }
  });

  // Use mouse wheel to rotate the menu ring.
  radarMenu.addEventListener("wheel", (e) => {
    e.preventDefault();
    // Adjust the offset (rotate by ±15° per wheel event)
    angleOffset += e.deltaY > 0 ? 15 : -15;
    updateRotations();
  }, { passive: false });

  // Add touch support for mobile devices
  radarMenu.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      // Get touch point and compute angle relative to the center of the menu
      const touch = e.touches[0];
      const rect = radarMenu.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = touch.clientX - centerX;
      const dy = touch.clientY - centerY;
      initialTouchAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    }
  }, {passive:false});

  radarMenu.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && initialTouchAngle !== null) {
      e.preventDefault(); // Prevent scrolling while rotating
      const touch = e.touches[0];
      const rect = radarMenu.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = touch.clientX - centerX;
      const dy = touch.clientY - centerY;
      const currentTouchAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Calculate the difference in angle from the last touch event
      const angleDiff = currentTouchAngle - initialTouchAngle;
      angleOffset += angleDiff;
      initialTouchAngle = currentTouchAngle;
      updateRotations();
    }
  }, { passive: false });

  radarMenu.addEventListener("touchend", () => {
    initialTouchAngle = null;
  });

  // Optional: keyboard shortcut (Alt + M) to toggle the menu
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key.toLowerCase() === "m") {
      radarMenu.classList.toggle("active");
      if (radarMenu.classList.contains("active")) {
        generateMenuItems();
        updateRotations();
      }
    }
  });

  return wrapper;
};

export default RadarMenu;
export { RadarMenu };

