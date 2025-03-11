import "../../../css/ui/ZoomBox.css";
import { SRC_URL } from "../../api/api.js";

class ZoomBox {
  /**
   * @param {string[]} images - Array of image paths.
   * @param {number} [initialIndex=0] - Starting image index.
   * @param {object} [options={}] - Optional configurations.
   * @param {boolean} [options.loop=true] - Whether to enable infinite cycling.
   * @param {number} [options.throttleDelay=20] - Throttle delay (in ms) for high-frequency events.
   */
  constructor(images, initialIndex = 0, options = {}) {
    this.images = images;
    this.currentIndex = initialIndex;
    this.loop = options.loop !== undefined ? options.loop : true;
    this.throttleDelay = options.throttleDelay || 20;

    // Transformation state
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    this.angle = 0;
    this.flip = false;

    // Target values for smooth zoom/pan animation
    this.targetZoomLevel = this.zoomLevel;
    this.targetPanX = this.panX;
    this.targetPanY = this.panY;
    this.animating = false;

    // Interaction state
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.lastTap = 0;
    this.initialPinchDistance = null;
    this.initialZoom = 1;

    // Create DOM elements
    this.createElements();

    // Bind and throttle event handlers
    this.handleEvent = this.handleEvent.bind(this);
    this.handleMouseMoveThrottled = this._throttle(this.onMouseMove.bind(this), this.throttleDelay);
    this.handleTouchMoveThrottled = this._throttle(this.onTouchMove.bind(this), this.throttleDelay);
    this.handleWheelThrottled = this._throttle(this.onWheel.bind(this), this.throttleDelay);

    // Attach a single delegated event listener to the overlay
    const events = [
      "mousedown",
      "mousemove",
      "mouseup",
      "touchstart",
      "touchmove",
      "touchend",
      "wheel",
      "click",
    ];
    events.forEach((type) => {
      this.zoombox.addEventListener(type, this.handleEvent);
    });

    // Keyboard events are attached to the document
    this.handleKeyDown = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);

    // Insert the ZoomBox overlay into the app container
    document.getElementById("app").appendChild(this.zoombox);

    // Fade in the overlay
    requestAnimationFrame(() => {
      this.zoombox.style.opacity = "1";
    });

    // Initialize the first image
    this.updateImage();
  }

  /* ----------------------------------
     DOM Creation & Helper Methods
  -------------------------------------*/

  createElements() {
    // Overlay container
    this.zoombox = document.createElement("div");
    this.zoombox.className = "zoombox-overlay";
    this.zoombox.style.opacity = "0";
    this.zoombox.style.transition = "opacity 0.3s ease";
    this.zoombox.style.touchAction = "none"; // Disable native gestures

    // Auto-detect dark mode
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      this.zoombox.classList.add("dark-mode");
    }

    // Content container
    this.content = document.createElement("div");
    this.content.className = "zoombox-content";

    // Main image element
    this.img = document.createElement("img");
    this.img.alt = "ZoomBox Image";
    this.img.style.transition = "transform 0.2s ease-out";
    this.img.style.willChange = "transform";
    this.img.loading = "lazy";
    // Store the base dimensions once the image loads
    this.img.onload = () => {
      this.baseImageWidth = this.img.naturalWidth;
      this.baseImageHeight = this.img.naturalHeight;
      // Optionally, center the image if it's smaller than the container:
      this.clampCurrentPan();
      this.updateTransform();
    };
    this.content.appendChild(this.img);

    // Navigation buttons (if multiple images)
    if (this.images.length > 1) {
      this.prevButton = document.createElement("button");
      this.prevButton.className = "zoombox-prev-btn";
      this.prevButton.textContent = "⮘";
      this.prevButton.dataset.action = "prev";
      this.content.appendChild(this.prevButton);

      this.nextButton = document.createElement("button");
      this.nextButton.className = "zoombox-next-btn";
      this.nextButton.textContent = "⮚";
      this.nextButton.dataset.action = "next";
      this.content.appendChild(this.nextButton);
    }

    // Close button
    this.closeButton = document.createElement("button");
    this.closeButton.className = "zoombox-close-btn";
    this.closeButton.textContent = "✖";
    this.closeButton.dataset.action = "close";
    this.content.appendChild(this.closeButton);

    this.zoombox.appendChild(this.content);
  }

  /**
   * Throttle function to limit the frequency of callback execution.
   * @param {Function} func - The callback function.
   * @param {number} delay - Delay in milliseconds.
   * @returns {Function}
   */
  _throttle(func, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  /**
   * Clamps the given pan values based on the container size and the scaled image dimensions.
   * @param {number} panX - Candidate panX value.
   * @param {number} panY - Candidate panY value.
   * @param {number} zoomLevel - The zoom level to compute the scaled dimensions.
   * @returns {[number, number]} - The clamped [panX, panY].
   */
  clampPan(panX, panY, zoomLevel) {
    const containerRect = this.content.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Calculate scaled image dimensions using the base (natural) size
    const scaledWidth = this.baseImageWidth * zoomLevel;
    const scaledHeight = this.baseImageHeight * zoomLevel;

    let clampedX = panX;
    let clampedY = panY;

    // For horizontal clamping: 
    // The left edge (panX) cannot be > 0, and the right edge (panX + scaledWidth) cannot be < containerWidth.
    if (scaledWidth > containerWidth) {
      if (panX > 0) clampedX = 0;
      if (panX < containerWidth - scaledWidth) clampedX = containerWidth - scaledWidth;
    } else {
      // If image is smaller than container, center it horizontally.
      clampedX = (containerWidth - scaledWidth) / 2;
    }

    // For vertical clamping:
    if (scaledHeight > containerHeight) {
      if (panY > 0) clampedY = 0;
      if (panY < containerHeight - scaledHeight) clampedY = containerHeight - scaledHeight;
    } else {
      // Center vertically if image is smaller.
      clampedY = (containerHeight - scaledHeight) / 2;
    }

    return [clampedX, clampedY];
  }

  /**
   * Clamps the current pan values based on the current zoom level.
   */
  clampCurrentPan() {
    [this.panX, this.panY] = this.clampPan(this.panX, this.panY, this.zoomLevel);
  }

  /**
   * Updates the CSS transform of the image based on current state.
   */
  updateTransform() {
    this.img.style.transform = `
      translate(${this.panX}px, ${this.panY}px)
      scale(${this.zoomLevel})
      rotate(${this.angle}deg)
      ${this.flip ? "scaleX(-1)" : ""}
    `;
  }

  /**
   * Updates the image source and resets transformation state.
   */
  updateImage() {
    this.img.src = `${SRC_URL}/${this.images[this.currentIndex]}`;
    // Reset transformation state
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    this.angle = 0;
    this.flip = false;
    this.targetZoomLevel = this.zoomLevel;
    this.targetPanX = this.panX;
    this.targetPanY = this.panY;
    // Once image loads, clamp pan values
    this.updateTransform();
    this.preloadImages();
  }

  /**
   * Preloads adjacent images for smoother navigation.
   */
  preloadImages() {
    const indexes = [this.currentIndex];
    if (this.loop || this.currentIndex < this.images.length - 1) {
      indexes.push(this.currentIndex + 1);
    }
    if (this.loop || this.currentIndex > 0) {
      indexes.push(this.currentIndex - 1);
    }
    indexes.forEach((i) => {
      if (i >= 0 && i < this.images.length) {
        const img = new Image();
        img.src = `${SRC_URL}/${this.images[i]}`;
      }
    });
  }

  /**
   * Navigate to a different image.
   * @param {number} direction - -1 for previous, 1 for next.
   */
  navigateImage(direction) {
    const newIndex = this.currentIndex + direction;
    if (this.loop) {
      this.currentIndex = (newIndex + this.images.length) % this.images.length;
      this.updateImage();
    } else {
      if (newIndex >= 0 && newIndex < this.images.length) {
        this.currentIndex = newIndex;
        this.updateImage();
      }
    }
  }

  /* ----------------------------------
     Unified Event Handling (Delegation)
  -------------------------------------*/

  /**
   * Single event handler to delegate events based on type.
   * @param {Event} e - The event object.
   */
  handleEvent(e) {
    const handlers = {
        mousedown: this.onMouseDown,
        mousemove: this.handleMouseMoveThrottled,
        mouseup: this.onMouseUp,
        wheel: this.handleWheelThrottled,
        touchstart: this.onTouchStart,
        touchmove: this.handleTouchMoveThrottled,
        touchend: this.onTouchEnd,
        click: this.onClick,
    };

    if (handlers[e.type]) {
        handlers[e.type].call(this, e);
    }
}

  // handleEvent(e) {
  //   switch (e.type) {
  //     case "mousedown":
  //       this.onMouseDown(e);
  //       break;
  //     case "mousemove":
  //       this.handleMouseMoveThrottled(e);
  //       break;
  //     case "mouseup":
  //       this.onMouseUp(e);
  //       break;
  //     case "wheel":
  //       this.handleWheelThrottled(e);
  //       break;
  //     case "touchstart":
  //       this.onTouchStart(e);
  //       break;
  //     case "touchmove":
  //       this.handleTouchMoveThrottled(e);
  //       break;
  //     case "touchend":
  //       this.onTouchEnd(e);
  //       break;
  //     case "click":
  //       this.onClick(e);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  /* ----------------------------------
     Mouse Event Handlers
  -------------------------------------*/

  onMouseDown(e) {
    if (this.zoomLevel <= 1) return;
    this.isDragging = true;
    this.startX = e.clientX - this.panX;
    this.startY = e.clientY - this.panY;
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    this.panX = e.clientX - this.startX;
    this.panY = e.clientY - this.startY;
    [this.panX, this.panY] = this.clampPan(this.panX, this.panY, this.zoomLevel);
    this.targetPanX = this.panX;
    this.targetPanY = this.panY;
    this.updateTransform();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  /* ----------------------------------
     Wheel (Zoom) Handler with Smooth Animation
  -------------------------------------*/

  onWheel(e) {
    e.preventDefault();
    const rect = this.img.getBoundingClientRect();
    // Get cursor position relative to the image
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    // Set transform origin based on cursor position
    this.img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;

    const prevTargetZoom = this.targetZoomLevel;
    let newTargetZoom = prevTargetZoom * (e.deltaY > 0 ? 0.9 : 1.1);
    newTargetZoom = Math.max(1, Math.min(newTargetZoom, 6));

    const zoomFactor = newTargetZoom / prevTargetZoom;
    let newTargetPanX = this.targetPanX - (cursorX - this.targetPanX) * (zoomFactor - 1);
    let newTargetPanY = this.targetPanY - (cursorY - this.targetPanY) * (zoomFactor - 1);

    // Clamp the target pan values so the image's corners don't leave the container
    [newTargetPanX, newTargetPanY] = this.clampPan(newTargetPanX, newTargetPanY, newTargetZoom);

    this.targetZoomLevel = newTargetZoom;
    this.targetPanX = newTargetPanX;
    this.targetPanY = newTargetPanY;

    if (!this.animating) {
      this.animating = true;
      this.animateTransform();
    }
  }

  /**
   * Smoothly animates the current transform toward the target transform values.
   */
  animateTransform() {
    const lerpFactor = 0.2; // Adjust for faster/slower animation
    const dz = this.targetZoomLevel - this.zoomLevel;
    const dx = this.targetPanX - this.panX;
    const dy = this.targetPanY - this.panY;

    this.zoomLevel += dz * lerpFactor;
    this.panX += dx * lerpFactor;
    this.panY += dy * lerpFactor;

    // Clamp the current pan in case we overshoot
    [this.panX, this.panY] = this.clampPan(this.panX, this.panY, this.zoomLevel);
    this.updateTransform();

    if (Math.abs(dz) > 0.001 || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      requestAnimationFrame(() => this.animateTransform());
    } else {
      this.zoomLevel = this.targetZoomLevel;
      this.panX = this.targetPanX;
      this.panY = this.targetPanY;
      this.updateTransform();
      this.animating = false;
    }
  }

  /* ----------------------------------
     Touch Event Handlers
  -------------------------------------*/

  onTouchStart(e) {
    if (e.touches.length === 2) {
      this.initialPinchDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      this.initialZoom = this.zoomLevel;
    } else if (e.touches.length === 1) {
      const currentTime = Date.now();
      if (currentTime - this.lastTap < 300) {
        // Double-tap: toggle between 1x and 2x zoom
        this.targetZoomLevel = this.zoomLevel === 1 ? 2 : 1;
        this.targetPanX = 0;
        this.targetPanY = 0;
        [this.targetPanX, this.targetPanY] = this.clampPan(this.targetPanX, this.targetPanY, this.targetZoomLevel);
        if (!this.animating) {
          this.animating = true;
          this.animateTransform();
        }
        e.preventDefault();
      }
      this.lastTap = currentTime;

      if (this.zoomLevel > 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX - this.panX;
        this.startY = e.touches[0].clientY - this.panY;
      }
    }
  }

  onTouchMove(e) {
    if (e.touches.length === 2 && this.initialPinchDistance) {
      const newDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = newDistance / this.initialPinchDistance;
      const prevZoom = this.zoomLevel;
      let newZoom = Math.max(1, Math.min(this.initialZoom * scaleFactor, 3));
      const zoomFactor = newZoom / prevZoom;

      const rect = this.img.getBoundingClientRect();
      const midX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
      const midY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
      let newPanX = this.panX - (midX - this.panX) * (zoomFactor - 1);
      let newPanY = this.panY - (midY - this.panY) * (zoomFactor - 1);

      [newPanX, newPanY] = this.clampPan(newPanX, newPanY, newZoom);
      this.zoomLevel = newZoom;
      this.panX = newPanX;
      this.panY = newPanY;
      this.targetZoomLevel = this.zoomLevel;
      this.targetPanX = this.panX;
      this.targetPanY = this.panY;
      this.updateTransform();
    } else if (e.touches.length === 1 && this.isDragging) {
      this.panX = e.touches[0].clientX - this.startX;
      this.panY = e.touches[0].clientY - this.startY;
      [this.panX, this.panY] = this.clampPan(this.panX, this.panY, this.zoomLevel);
      this.targetPanX = this.panX;
      this.targetPanY = this.panY;
      this.updateTransform();
    }
  }

  onTouchEnd(e) {
    if (e.touches.length < 2) {
      this.initialPinchDistance = null;
    }
    if (e.touches.length === 0) {
      this.isDragging = false;
    }
  }

  /* ----------------------------------
     Click & Keyboard Handlers
  -------------------------------------*/

  onClick(e) {
    const action = e.target.dataset.action;
    if (action === "prev") {
      this.navigateImage(-1);
    } else if (action === "next") {
      this.navigateImage(1);
    } else if (action === "close") {
      this.close();
    }
  }

  onKeyDown(e) {
    switch (e.key) {
      case "ArrowRight":
        this.navigateImage(1);
        break;
      case "ArrowLeft":
        this.navigateImage(-1);
        break;
      case "+":
        this.targetZoomLevel = Math.min(3, this.zoomLevel * 1.1);
        this.targetPanX = this.panX;
        this.targetPanY = this.panY;
        [this.targetPanX, this.targetPanY] = this.clampPan(this.targetPanX, this.targetPanY, this.targetZoomLevel);
        if (!this.animating) {
          this.animating = true;
          this.animateTransform();
        }
        break;
      case "-":
        this.targetZoomLevel = Math.max(1, this.zoomLevel / 1.1);
        this.targetPanX = this.panX;
        this.targetPanY = this.panY;
        [this.targetPanX, this.targetPanY] = this.clampPan(this.targetPanX, this.targetPanY, this.targetZoomLevel);
        if (!this.animating) {
          this.animating = true;
          this.animateTransform();
        }
        break;
      case "r":
        this.angle = (this.angle + 90) % 360;
        this.updateTransform();
        break;
      case "h":
        this.flip = !this.flip;
        this.updateTransform();
        break;
      case "Escape":
        this.close();
        break;
      default:
        break;
    }
  }

  /* ----------------------------------
     Close Handler
  -------------------------------------*/

  close() {
    this.zoombox.style.opacity = "0";
    setTimeout(() => {
      this.zoombox.remove();
      document.removeEventListener("keydown", this.handleKeyDown);
    }, 300);
  }
}

export default ZoomBox;

// import "../../../css/ui/ZoomBox.css";
// import { SRC_URL } from "../../api/api.js";

// class ZoomBox {
//   /**
//    * @param {string[]} images - Array of image paths.
//    * @param {number} [initialIndex=0] - Starting image index.
//    * @param {object} [options={}] - Optional configurations.
//    * @param {boolean} [options.loop=true] - Whether to enable infinite cycling.
//    * @param {number} [options.throttleDelay=10] - Throttle delay (in ms) for high-frequency events.
//    */
//   constructor(images, initialIndex = 0, options = {}) {
//     this.images = images;
//     this.currentIndex = initialIndex;
//     this.loop = options.loop !== undefined ? options.loop : true;
//     this.throttleDelay = options.throttleDelay || 10;

//     // Transformation state
//     this.zoomLevel = 1;
//     this.panX = 0;
//     this.panY = 0;
//     this.angle = 0;
//     this.flip = false;

//     // Set up target values for smooth animation
//     this.targetZoomLevel = this.zoomLevel;
//     this.targetPanX = this.panX;
//     this.targetPanY = this.panY;
//     this.animating = false;

//     // Interaction state
//     this.isDragging = false;
//     this.startX = 0;
//     this.startY = 0;
//     this.lastTap = 0;
//     this.initialPinchDistance = null;
//     this.initialZoom = 1;

//     // Create DOM elements
//     this.createElements();

//     // Bind and throttle event handlers
//     this.handleEvent = this.handleEvent.bind(this);
//     this.handleMouseMoveThrottled = this._throttle(this.onMouseMove.bind(this), this.throttleDelay);
//     this.handleTouchMoveThrottled = this._throttle(this.onTouchMove.bind(this), this.throttleDelay);
//     this.handleWheelThrottled = this._throttle(this.onWheel.bind(this), this.throttleDelay);

//     // Attach a single delegated event listener to the overlay
//     const events = [
//       "mousedown",
//       "mousemove",
//       "mouseup",
//       "touchstart",
//       "touchmove",
//       "touchend",
//       "wheel",
//       "click",
//     ];
//     events.forEach((type) => {
//       this.zoombox.addEventListener(type, this.handleEvent);
//     });

//     // Keyboard events are attached to the document
//     this.handleKeyDown = this.onKeyDown.bind(this);
//     document.addEventListener("keydown", this.handleKeyDown);

//     // Insert the ZoomBox overlay into the app container
//     document.getElementById("app").appendChild(this.zoombox);

//     // Fade in the overlay
//     requestAnimationFrame(() => {
//       this.zoombox.style.opacity = "1";
//     });

//     // Initialize the first image
//     this.updateImage();
//   }

//   /* ----------------------------------
//      DOM Creation & Helper Methods
//   -------------------------------------*/

//   createElements() {
//     // Overlay container
//     this.zoombox = document.createElement("div");
//     this.zoombox.className = "zoombox-overlay";
//     this.zoombox.style.opacity = "0";
//     this.zoombox.style.transition = "opacity 0.3s ease";

//     // Auto-detect dark mode
//     if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
//       this.zoombox.classList.add("dark-mode");
//     }

//     // Content container
//     this.content = document.createElement("div");
//     this.content.className = "zoombox-content";

//     // Main image element
//     this.img = document.createElement("img");
//     this.img.alt = "ZoomBox Image";
//     this.img.style.transition = "transform 0.2s ease-out";
//     this.img.style.willChange = "transform";
//     this.img.loading = "lazy";
//     this.content.appendChild(this.img);

//     // Navigation buttons (if multiple images)
//     if (this.images.length > 1) {
//       this.prevButton = document.createElement("button");
//       this.prevButton.className = "zoombox-prev-btn";
//       this.prevButton.textContent = "⮘";
//       this.prevButton.dataset.action = "prev";
//       this.content.appendChild(this.prevButton);

//       this.nextButton = document.createElement("button");
//       this.nextButton.className = "zoombox-next-btn";
//       this.nextButton.textContent = "⮚";
//       this.nextButton.dataset.action = "next";
//       this.content.appendChild(this.nextButton);
//     }

//     // Close button
//     this.closeButton = document.createElement("button");
//     this.closeButton.className = "zoombox-close-btn";
//     this.closeButton.textContent = "✖";
//     this.closeButton.dataset.action = "close";
//     this.content.appendChild(this.closeButton);

//     this.zoombox.appendChild(this.content);
//   }

//   /**
//    * Throttle function to limit the frequency of callback execution.
//    * @param {Function} func - The callback function.
//    * @param {number} delay - Delay in milliseconds.
//    * @returns {Function}
//    */
//   _throttle(func, delay) {
//     let lastCall = 0;
//     return (...args) => {
//       const now = Date.now();
//       if (now - lastCall >= delay) {
//         lastCall = now;
//         func.apply(this, args);
//       }
//     };
//   }

//   /**
//    * Update the CSS transform of the image based on current state.
//    */
//   updateTransform() {
//     this.img.style.transform = `
//       translate(${this.panX}px, ${this.panY}px)
//       scale(${this.zoomLevel})
//       rotate(${this.angle}deg)
//       ${this.flip ? "scaleX(-1)" : ""}
//     `;
//   }

//   /**
//    * Update the image source and reset transformation state.
//    */
//   updateImage() {
//     this.img.src = `${SRC_URL}/${this.images[this.currentIndex]}`;
//     // Reset transformation state
//     this.zoomLevel = 1;
//     this.panX = 0;
//     this.panY = 0;
//     this.angle = 0;
//     this.flip = false;
//     this.updateTransform();
//     this.preloadImages();
//   }

//   /**
//    * Preload adjacent images for smoother navigation.
//    */
//   preloadImages() {
//     const indexes = [this.currentIndex];
//     if (this.loop || this.currentIndex < this.images.length - 1) {
//       indexes.push(this.currentIndex + 1);
//     }
//     if (this.loop || this.currentIndex > 0) {
//       indexes.push(this.currentIndex - 1);
//     }
//     indexes.forEach((i) => {
//       if (i >= 0 && i < this.images.length) {
//         const img = new Image();
//         img.src = `${SRC_URL}/${this.images[i]}`;
//       }
//     });
//   }

//   /**
//    * Navigate to a different image.
//    * @param {number} direction - -1 for previous, 1 for next.
//    */
//   navigateImage(direction) {
//     const newIndex = this.currentIndex + direction;
//     if (this.loop) {
//       this.currentIndex = (newIndex + this.images.length) % this.images.length;
//       this.updateImage();
//     } else {
//       if (newIndex >= 0 && newIndex < this.images.length) {
//         this.currentIndex = newIndex;
//         this.updateImage();
//       }
//     }
//   }

//   /* ----------------------------------
//      Unified Event Handling (Delegation)
//   -------------------------------------*/

//   /**
//    * Single event handler to delegate events based on type.
//    * @param {Event} e - The event object.
//    */
//   handleEvent(e) {
//     switch (e.type) {
//       case "mousedown":
//         this.onMouseDown(e);
//         break;
//       case "mousemove":
//         this.handleMouseMoveThrottled(e);
//         break;
//       case "mouseup":
//         this.onMouseUp(e);
//         break;
//       case "wheel":
//         this.handleWheelThrottled(e);
//         break;
//       case "touchstart":
//         this.onTouchStart(e);
//         break;
//       case "touchmove":
//         this.handleTouchMoveThrottled(e);
//         break;
//       case "touchend":
//         this.onTouchEnd(e);
//         break;
//       case "click":
//         this.onClick(e);
//         break;
//       default:
//         break;
//     }
//   }

//   /* ----------------------------------
//      Mouse Event Handlers
//   -------------------------------------*/

//   onMouseDown(e) {
//     if (this.zoomLevel <= 1) return;
//     this.isDragging = true;
//     this.startX = e.clientX - this.panX;
//     this.startY = e.clientY - this.panY;
//   }

//   onMouseMove(e) {
//     if (!this.isDragging) return;
//     this.panX = e.clientX - this.startX;
//     this.panY = e.clientY - this.startY;
//     this.updateTransform();
//   }

//   onMouseUp() {
//     this.isDragging = false;
//     // Optionally, you can implement momentum/inertia here.
//   }

//   /* ----------------------------------
//      Wheel (Zoom) Handler
//   -------------------------------------*/

//   onWheel(e) {
//     e.preventDefault();
//     const rect = this.img.getBoundingClientRect();
//     // Get cursor position relative to the image
//     const cursorX = e.clientX - rect.left;
//     const cursorY = e.clientY - rect.top;
//     // Set the transform origin so the cursor remains the zoom origin
//     this.img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;

//     // Use the target values as the starting point
//     const prevTargetZoom = this.targetZoomLevel;
//     let newTargetZoom = prevTargetZoom * (e.deltaY > 0 ? 0.9 : 1.1);
//     newTargetZoom = Math.max(1, Math.min(newTargetZoom, 6)); // Clamp zoom between 1 and 6

//     // Calculate the zoom factor
//     const zoomFactor = newTargetZoom / prevTargetZoom;
//     // Update the pan so that the point under the cursor remains fixed
//     const currentTargetPanX = this.targetPanX;
//     const currentTargetPanY = this.targetPanY;
//     const newTargetPanX = currentTargetPanX - (cursorX - currentTargetPanX) * (zoomFactor - 1);
//     const newTargetPanY = currentTargetPanY - (cursorY - currentTargetPanY) * (zoomFactor - 1);

//     // Set target values for the animation
//     this.targetZoomLevel = newTargetZoom;
//     this.targetPanX = newTargetPanX;
//     this.targetPanY = newTargetPanY;

//     // Start the smooth animation (if not already running)
//     if (!this.animating) {
//       this.animating = true;
//       this.animateTransform();
//     }
//   }
//   animateTransform() {
//     const lerpFactor = 0.2; // Adjust this factor for faster or slower animation
//     const dz = this.targetZoomLevel - this.zoomLevel;
//     const dx = this.targetPanX - this.panX;
//     const dy = this.targetPanY - this.panY;

//     // Gradually interpolate values
//     this.zoomLevel += dz * lerpFactor;
//     this.panX += dx * lerpFactor;
//     this.panY += dy * lerpFactor;
//     this.updateTransform();

//     // Continue the animation if the differences are significant
//     if (Math.abs(dz) > 0.001 || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
//       requestAnimationFrame(() => this.animateTransform());
//     } else {
//       // Snap to target values if close enough
//       this.zoomLevel = this.targetZoomLevel;
//       this.panX = this.targetPanX;
//       this.panY = this.targetPanY;
//       this.updateTransform();
//       this.animating = false;
//     }
//   }


//   /* ----------------------------------
//      Touch Event Handlers
//   -------------------------------------*/

//   onTouchStart(e) {
//     if (e.touches.length === 2) {
//       this.initialPinchDistance = Math.hypot(
//         e.touches[0].clientX - e.touches[1].clientX,
//         e.touches[0].clientY - e.touches[1].clientY
//       );
//       this.initialZoom = this.zoomLevel;
//     } else if (e.touches.length === 1) {
//       const currentTime = Date.now();
//       if (currentTime - this.lastTap < 300) {
//         // Double-tap: toggle between 1x and 2x zoom
//         this.zoomLevel = this.zoomLevel === 1 ? 2 : 1;
//         this.panX = 0;
//         this.panY = 0;
//         this.updateTransform();
//         e.preventDefault();
//       }
//       this.lastTap = currentTime;

//       // Begin panning if zoomed in
//       if (this.zoomLevel > 1) {
//         this.isDragging = true;
//         this.startX = e.touches[0].clientX - this.panX;
//         this.startY = e.touches[0].clientY - this.panY;
//       }
//     }
//   }

//   onTouchMove(e) {
//     if (e.touches.length === 2 && this.initialPinchDistance) {
//       const newDistance = Math.hypot(
//         e.touches[0].clientX - e.touches[1].clientX,
//         e.touches[0].clientY - e.touches[1].clientY
//       );
//       const scaleFactor = newDistance / this.initialPinchDistance;
//       const prevZoom = this.zoomLevel;
//       this.zoomLevel = Math.max(1, Math.min(this.initialZoom * scaleFactor, 3));

//       // Center the zoom based on the midpoint between the two touches
//       const rect = this.img.getBoundingClientRect();
//       const midX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
//       const midY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
//       const zoomFactor = this.zoomLevel / prevZoom;
//       this.panX -= (midX - this.panX) * (zoomFactor - 1);
//       this.panY -= (midY - this.panY) * (zoomFactor - 1);

//       this.updateTransform();
//     } else if (e.touches.length === 1 && this.isDragging) {
//       this.panX = e.touches[0].clientX - this.startX;
//       this.panY = e.touches[0].clientY - this.startY;
//       this.updateTransform();
//     }
//   }

//   onTouchEnd(e) {
//     if (e.touches.length < 2) {
//       this.initialPinchDistance = null;
//     }
//     if (e.touches.length === 0) {
//       this.isDragging = false;
//       // Optionally, implement momentum/inertia for touch panning here.
//     }
//   }

//   /* ----------------------------------
//      Click & Keyboard Handlers
//   -------------------------------------*/

//   onClick(e) {
//     // Delegate button actions based on data attributes
//     const action = e.target.dataset.action;
//     if (action === "prev") {
//       this.navigateImage(-1);
//     } else if (action === "next") {
//       this.navigateImage(1);
//     } else if (action === "close") {
//       this.close();
//     }
//   }

//   onKeyDown(e) {
//     switch (e.key) {
//       case "ArrowRight":
//         this.navigateImage(1);
//         break;
//       case "ArrowLeft":
//         this.navigateImage(-1);
//         break;
//       case "+":
//         this.zoomLevel = Math.min(3, this.zoomLevel * 1.1);
//         this.updateTransform();
//         break;
//       case "-":
//         this.zoomLevel = Math.max(1, this.zoomLevel / 1.1);
//         this.updateTransform();
//         break;
//       case "r":
//         this.angle = (this.angle + 90) % 360;
//         this.updateTransform();
//         break;
//       case "h":
//         this.flip = !this.flip;
//         this.updateTransform();
//         break;
//       case "Escape":
//         this.close();
//         break;
//       default:
//         break;
//     }
//   }

//   /* ----------------------------------
//      Close Handler
//   -------------------------------------*/

//   close() {
//     this.zoombox.style.opacity = "0";
//     setTimeout(() => {
//       this.zoombox.remove();
//       document.removeEventListener("keydown", this.handleKeyDown);
//     }, 300);
//   }
// }

// export default ZoomBox;


// // import "../../../css/ui/ZoomBox.css";
// // import { SRC_URL } from "../../api/api.js";

// // const ZoomBox = (images, initialIndex = 0) => {
// //   // Create overlay
// //   const zoombox = document.createElement("div");
// //   zoombox.className = "zoombox-overlay";
// //   zoombox.style.opacity = "0";
// //   zoombox.style.transition = "opacity 0.3s ease";

// //   // Auto-detect dark mode
// //   if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
// //     zoombox.classList.add("dark-mode");
// //   }

// //   // Content container
// //   const content = document.createElement("div");
// //   content.className = "zoombox-content";

// //   // Transformation state
// //   let zoomLevel = 1,
// //     panX = 0,
// //     panY = 0,
// //     angle = 0,
// //     flip = false,
// //     currentIndex = initialIndex,
// //     isDragging = false,
// //     startX = 0,
// //     startY = 0,
// //     lastTap = 0,
// //     initialPinchDistance = null,
// //     initialZoom = 1;

// //   // Create and preload image
// //   const img = document.createElement("img");
// //   img.style.transition = "transform 0.2s ease-out";
// //   img.style.willChange = "transform";
// //   content.appendChild(img);

// //   const preloadImages = (index) => {
// //     [index, (index + 1) % images.length, (index - 1 + images.length) % images.length].forEach((i) => {
// //       const preImg = new Image();
// //       preImg.src = `${SRC_URL}/${images[i]}`;
// //     });
// //   };

// //   const updateImage = () => {
// //     img.src = `${SRC_URL}/${images[currentIndex]}`;
// //     panX = panY = 0;
// //     zoomLevel = 1;
// //     angle = 0;
// //     flip = false;
// //     updateTransform();
// //     preloadImages(currentIndex);
// //   };

// //   const updateTransform = () => {
// //     img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel}) rotate(${angle}deg) ${flip ? "scaleX(-1)" : ""}`;
// //   };

// //   const smoothZoom = (delta, event) => {
// //     const rect = img.getBoundingClientRect();
// //     const cursorX = event.clientX - rect.left;
// //     const cursorY = event.clientY - rect.top;
// //     const prevZoom = zoomLevel;

// //     zoomLevel *= delta > 0 ? 0.9 : 1.1;
// //     zoomLevel = Math.max(1, Math.min(zoomLevel, 6));

// //     const zoomFactor = zoomLevel / prevZoom;
// //     panX -= (cursorX - panX) * (zoomFactor - 1);
// //     panY -= (cursorY - panY) * (zoomFactor - 1);

// //     img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
// //     updateTransform();
// //   };

// //   const navigateImage = (direction) => {
// //     currentIndex = (currentIndex + direction + images.length) % images.length;
// //     updateImage();
// //   };

// //   const closeZoomBox = () => {
// //     zoombox.style.opacity = "0";
// //     setTimeout(() => zoombox.remove(), 300);
// //   };

// //   // Event Handlers
// //   img.addEventListener("wheel", (e) => {
// //     e.preventDefault();
// //     requestAnimationFrame(() => smoothZoom(e.deltaY, e));
// //   });

// //   img.addEventListener("mousedown", (e) => {
// //     if (zoomLevel <= 1) return;
// //     isDragging = true;
// //     startX = e.clientX - panX;
// //     startY = e.clientY - panY;
// //     velocityX = velocityY = 0;
// //   });

// //   document.addEventListener("mousemove", (e) => {
// //     if (!isDragging) return;
// //     panX = e.clientX - startX;
// //     panY = e.clientY - startY;
// //     updateTransform();
// //   });

// //   document.addEventListener("mouseup", () => {
// //     isDragging = false;
// //   });

// //   img.addEventListener("touchstart", (e) => {
// //     if (e.touches.length === 2) {
// //       initialPinchDistance = Math.hypot(
// //         e.touches[0].clientX - e.touches[1].clientX,
// //         e.touches[0].clientY - e.touches[1].clientY
// //       );
// //       initialZoom = zoomLevel;
// //     } else if (e.touches.length === 1) {
// //       const currentTime = new Date().getTime();
// //       if (currentTime - lastTap < 300) {
// //         zoomLevel = zoomLevel === 1 ? 2 : 1;
// //         panX = panY = 0;
// //         updateTransform();
// //         e.preventDefault();
// //       }
// //       lastTap = currentTime;
// //     }
// //   });

// //   img.addEventListener("touchmove", (e) => {
// //     if (e.touches.length === 2 && initialPinchDistance) {
// //       const newDistance = Math.hypot(
// //         e.touches[0].clientX - e.touches[1].clientX,
// //         e.touches[0].clientY - e.touches[1].clientY
// //       );
// //       zoomLevel = Math.max(1, Math.min(3, initialZoom * (newDistance / initialPinchDistance)));
// //       updateTransform();
// //     }
// //   });

// //   document.addEventListener("keydown", (e) => {
// //     if (e.key === "ArrowRight") navigateImage(1);
// //     if (e.key === "ArrowLeft") navigateImage(-1);
// //     if (e.key === "+") zoomLevel = Math.min(3, zoomLevel * 1.1);
// //     if (e.key === "-") zoomLevel = Math.max(1, zoomLevel / 1.1);
// //     if (e.key === "r") angle = (angle + 90) % 360;
// //     if (e.key === "h") flip = !flip;
// //     if (e.key === "Escape") closeZoomBox();
// //     updateTransform();
// //   });

// //   // Navigation Buttons
// //   if (images.length > 1) {
// //     ["⮘", "⮚"].forEach((symbol, index) => {
// //       const button = document.createElement("button");
// //       button.className = index === 0 ? "zoombox-prev-btn" : "zoombox-next-btn";
// //       button.textContent = symbol;
// //       button.addEventListener("click", () => navigateImage(index === 0 ? -1 : 1));
// //       content.appendChild(button);
// //     });
// //   }

// //   // Close Button
// //   const closeButton = document.createElement("button");
// //   closeButton.className = "zoombox-close-btn";
// //   closeButton.textContent = "✖";
// //   closeButton.addEventListener("click", closeZoomBox);
// //   content.appendChild(closeButton);

// //   zoombox.appendChild(content);
// //   requestAnimationFrame(() => (zoombox.style.opacity = "1"));
// //   document.getElementById("app").appendChild(zoombox);
// //   history.pushState({ zoomboxOpen: true }, "");

// //   window.addEventListener("popstate", () => {
// //     if (history.state?.zoomboxOpen) closeZoomBox();
// //   });

// //   updateImage(); // Initialize first image
// // };

// // export default ZoomBox;
