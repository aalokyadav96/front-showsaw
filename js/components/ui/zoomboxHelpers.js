import { dispatchZoomBoxEvent } from "../../utils/eventDispatcher.js";

/* =========================
   Basic UI Creation Functions
   ========================= */

// Create overlay with fade-in/out support
export const createOverlay = () => {
    const el = document.createElement("div");
    el.className = "zoombox-overlay";
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s ease";
    return el;
};

// Create the primary image element
export const createImageElement = (src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "ZoomBox Image";
    img.style.transition = "transform 0.2s ease-out";
    img.style.willChange = "transform";
    // ← here’s the key:
    img.style.transformOrigin = "50% 50%";
    return img;
  };
  
// export const createImageElement = (src) => {
//     const img = document.createElement("img");
//     img.src = src;
//     img.alt = "ZoomBox Image";
//     img.style.transition = "transform 0.2s ease-out";
//     img.style.willChange = "transform";
//     return img;
// };

// Apply dark mode if needed
export const applyDarkMode = (el) => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        el.classList.add("dark-mode");
    }
};

// Preload images: current, next, previous
export const preloadImages = (images, index) => {
    const preloadIndexes = [
        index,
        (index + 1) % images.length,
        (index - 1 + images.length) % images.length
    ];
    preloadIndexes.forEach((i) => {
        const img = new Image();
        img.src = images[i];
    });
};

/* =========================
   Transformation & Zoom Logic
   ========================= */

// Update the image transformation (translation, zoom, rotation, flip)
export const updateTransform = (img, state) => {
    // make 100% sure we’re scaling & rotating around the center:
    img.style.transformOrigin = "50% 50%";
  
    // build the transform string
    const transformStr = [
      `translate(${state.panX}px, ${state.panY}px)`,
      `scale(${state.zoomLevel})`,
      `rotate(${state.angle}deg)`,
      state.flip ? "scaleX(-1)" : ""
    ].join(" ");
  
    img.style.transform = transformStr;
    updateCursor(img, state);
  };
  
  // export const updateTransform = (img, state) => {
//     // When flipped, invert the X scale
//     const transformStr = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoomLevel}) rotate(${state.angle}deg) ${state.flip ? "scaleX(-1)" : ""}`;
//     img.style.transform = transformStr;
//     updateCursor(img, state); // update the cursor style based on zoom
// };

// Update cursor style based on zoom status
export const updateCursor = (img, state) => {
    if (state.zoomLevel > 1) {
        img.style.cursor = state.isDragging ? "grabbing" : "grab";
    } else {
        img.style.cursor = "auto";
    }
};

// Show a temporary zoom indicator overlay displaying the current zoom percentage
let zoomIndicatorTimeout;
export const showZoomIndicator = (container, zoomLevel) => {
    let indicator = container.querySelector(".zoombox-zoom-indicator");
    if (!indicator) {
        indicator = document.createElement("div");
        indicator.className = "zoombox-zoom-indicator";
        // Style in your CSS or inline here:
        indicator.style.position = "absolute";
        indicator.style.bottom = "10px";
        indicator.style.right = "10px";
        indicator.style.padding = "5px 10px";
        indicator.style.background = "rgba(0,0,0,0.6)";
        indicator.style.color = "#fff";
        indicator.style.borderRadius = "3px";
        indicator.style.fontSize = "14px";
        container.appendChild(indicator);
    }
    indicator.textContent = `${Math.round(zoomLevel * 100)}%`;
    indicator.style.opacity = "1";
    clearTimeout(zoomIndicatorTimeout);
    zoomIndicatorTimeout = setTimeout(() => {
        indicator.style.opacity = "0";
    }, 1000);
};

// Show zoom limit feedback (min or max reached)
export const showZoomLimitFeedback = (container, limitType) => {
    const feedback = document.createElement("div");
    feedback.className = "zoombox-zoom-limit-feedback";
    // Style via CSS or inline:
    feedback.style.position = "absolute";
    feedback.style.top = "50%";
    feedback.style.left = "50%";
    feedback.style.transform = "translate(-50%, -50%)";
    feedback.style.padding = "10px 20px";
    feedback.style.background = "rgba(255,0,0,0.7)";
    feedback.style.color = "#fff";
    feedback.style.borderRadius = "5px";
    feedback.style.fontSize = "16px";
    feedback.textContent = limitType === "min" ? "Minimum Zoom Reached" : "Maximum Zoom Reached";
    container.appendChild(feedback);
    setTimeout(() => {
        feedback.remove();
    }, 1000);
};

// Smooth zoom handling: adjusts zoom and keeps the image centered at the cursor
// Smooth zoom handling: adjusts zoom and keeps the image centered at the cursor
// Smooth zoom handling: adjusts zoom and keeps the image centered at the cursor
// Smooth zoom handling: adjusts zoom and keeps the image centered at the cursor
// let zoomAnimationFrame = null;
// let zoomVelocity = 0; // for inertia

// export const smoothZoom = (event, img, state, container) => {
//     event.preventDefault();

//     const naturalW = img.naturalWidth;
//     const naturalH = img.naturalHeight;
//     const prevZoom = state.zoomLevel;
//     const zoomDirection = event.deltaY > 0 ? -1 : 1; // note: reversed to match scroll
//     const zoomSpeed = 0.0015; // how much zoom per wheel unit
//     const maxZoom = Math.max(naturalW / img.width, naturalH / img.height, 10);
//     const minZoom = 0.5; // allow zooming out a little

//     const rect = img.getBoundingClientRect();
//     const cursorX = event.clientX;
//     const cursorY = event.clientY;

//     const offsetX = (cursorX - rect.left) / rect.width;
//     const offsetY = (cursorY - rect.top) / rect.height;

//     // apply zoom impulse
//     zoomVelocity += zoomDirection * zoomSpeed * state.zoomLevel;

//     if (zoomAnimationFrame) cancelAnimationFrame(zoomAnimationFrame);

//     const animateZoom = () => {
//         if (Math.abs(zoomVelocity) < 0.00001) {
//             zoomVelocity = 0;
//             return;
//         }

//         state.zoomLevel += zoomVelocity;

//         // Clamp zoom level and apply inertia bounce if needed
//         if (state.zoomLevel < minZoom) {
//             state.zoomLevel = minZoom;
//             zoomVelocity = -zoomVelocity * 0.4; // bounce effect
//         }
//         if (state.zoomLevel > maxZoom) {
//             state.zoomLevel = maxZoom;
//             zoomVelocity = -zoomVelocity * 0.4; // bounce effect
//         }

//         // Focus lock: adjust pan so the cursor stays pointing to same image spot
//         const newRect = img.getBoundingClientRect();
//         const newWidth = newRect.width;
//         const newHeight = newRect.height;

//         const dx = (offsetX - 0.5) * (newWidth - rect.width);
//         const dy = (offsetY - 0.5) * (newHeight - rect.height);

//         state.panX -= dx;
//         state.panY -= dy;

//         // Pan clamping with elasticity
//         const viewWidth = window.innerWidth;
//         const viewHeight = window.innerHeight;
//         const imgWidth = img.offsetWidth * state.zoomLevel;
//         const imgHeight = img.offsetHeight * state.zoomLevel;
//         const maxPanX = Math.max(0, (imgWidth - viewWidth) / 2);
//         const maxPanY = Math.max(0, (imgHeight - viewHeight) / 2);

//         const elasticity = 0.2;

//         if (imgWidth <= viewWidth) {
//             state.panX += (0 - state.panX) * elasticity;
//         } else {
//             if (state.panX > maxPanX) state.panX += (maxPanX - state.panX) * elasticity;
//             if (state.panX < -maxPanX) state.panX += (-maxPanX - state.panX) * elasticity;
//         }

//         if (imgHeight <= viewHeight) {
//             state.panY += (0 - state.panY) * elasticity;
//         } else {
//             if (state.panY > maxPanY) state.panY += (maxPanY - state.panY) * elasticity;
//             if (state.panY < -maxPanY) state.panY += (-maxPanY - state.panY) * elasticity;
//         }

//         // Slowly reduce velocity
//         zoomVelocity *= 0.85; // friction

//         img.style.transformOrigin = `50% 50%`;
//         updateTransform(img, state);

//         showZoomIndicator(container, state.zoomLevel);
//         dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });

//         zoomAnimationFrame = requestAnimationFrame(animateZoom);
//     };

//     animateZoom();
// };

// let zoomAnimationFrame = null;

// // Crazy deluxe smooth zoom
// export const smoothZoom = (event, img, state, container) => {
//     event.preventDefault();

//     const naturalW = img.naturalWidth;
//     const naturalH = img.naturalHeight;
//     const prevZoom = state.zoomLevel;
//     const zoomDirection = event.deltaY > 0 ? 0.9 : 1.1;
//     const maxZoom = Math.max(naturalW / img.width, naturalH / img.height, 10);

//     const rect = img.getBoundingClientRect();
//     const cursorX = event.clientX;
//     const cursorY = event.clientY;
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;
//     const offsetX = cursorX - centerX;
//     const offsetY = cursorY - centerY;

//     const targetZoom = Math.max(0.5, Math.min(state.zoomLevel * zoomDirection, maxZoom)); // allow a bit zoom out below 1x

//     // If we reach limits, show feedback
//     if (targetZoom === 0.5 || targetZoom === maxZoom) {
//         showZoomLimitFeedback(container, (targetZoom === 0.5 ? "min" : "max"));
//     }

//     if (zoomAnimationFrame) cancelAnimationFrame(zoomAnimationFrame);

//     const animateZoom = () => {
//         const zoomDelta = targetZoom - state.zoomLevel;
//         const zoomStep = zoomDelta * 0.15; // zoom easing factor

//         if (Math.abs(zoomStep) < 0.001) {
//             state.zoomLevel = targetZoom;
//         } else {
//             state.zoomLevel += zoomStep;
//             zoomAnimationFrame = requestAnimationFrame(animateZoom);
//         }

//         // Calculate smooth zoom around cursor
//         const zoomFactor = state.zoomLevel / prevZoom;
//         state.panX -= offsetX * (zoomFactor - 1);
//         state.panY -= offsetY * (zoomFactor - 1);

//         const viewWidth = window.innerWidth;
//         const viewHeight = window.innerHeight;
//         const imgWidth = img.offsetWidth * state.zoomLevel;
//         const imgHeight = img.offsetHeight * state.zoomLevel;

//         const maxPanX = Math.max(0, (imgWidth - viewWidth) / 2);
//         const maxPanY = Math.max(0, (imgHeight - viewHeight) / 2);

//         // Elastic pan bounds
//         const elasticity = 0.2; // 0 = hard clamp, 1 = super bouncy

//         if (imgWidth <= viewWidth) {
//             state.panX += (0 - state.panX) * elasticity;
//         } else {
//             if (state.panX > maxPanX) state.panX += (maxPanX - state.panX) * elasticity;
//             if (state.panX < -maxPanX) state.panX += (-maxPanX - state.panX) * elasticity;
//         }

//         if (imgHeight <= viewHeight) {
//             state.panY += (0 - state.panY) * elasticity;
//         } else {
//             if (state.panY > maxPanY) state.panY += (maxPanY - state.panY) * elasticity;
//             if (state.panY < -maxPanY) state.panY += (-maxPanY - state.panY) * elasticity;
//         }

//         img.style.transformOrigin = `50% 50%`;
//         updateTransform(img, state);

//         showZoomIndicator(container, state.zoomLevel);
//         dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
//     };

//     animateZoom();
// };

// let zoomAnimationFrame = null;

// export const smoothZoom = (event, img, state, container) => {
//     event.preventDefault();

//     const naturalW = img.naturalWidth;
//     const naturalH = img.naturalHeight;
//     const prevZoom = state.zoomLevel;
//     const targetZoomChange = event.deltaY > 0 ? 0.9 : 1.1;
//     const maxZoom = Math.max(naturalW / img.width, naturalH / img.height, 10);

//     // Get image position and cursor coordinates
//     const rect = img.getBoundingClientRect();
//     const cursorX = event.clientX;
//     const cursorY = event.clientY;
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;
//     const offsetX = cursorX - centerX;
//     const offsetY = cursorY - centerY;

//     const targetZoom = Math.max(1, Math.min(state.zoomLevel * targetZoomChange, maxZoom));

//     // Cancel any ongoing animation
//     if (zoomAnimationFrame) cancelAnimationFrame(zoomAnimationFrame);

//     const animateZoom = () => {
//         const zoomDelta = targetZoom - state.zoomLevel;
//         const step = zoomDelta * 0.2; // Easing factor (smaller = slower)

//         if (Math.abs(step) < 0.001) {
//             state.zoomLevel = targetZoom;
//         } else {
//             state.zoomLevel += step;
//             zoomAnimationFrame = requestAnimationFrame(animateZoom);
//         }

//         // Adjust pan so that the image zooms into the cursor position
//         const zoomFactor = state.zoomLevel / prevZoom;
//         state.panX -= offsetX * (zoomFactor - 1);
//         state.panY -= offsetY * (zoomFactor - 1);

//         // Calculate limits
//         const viewWidth = window.innerWidth;
//         const viewHeight = window.innerHeight;
//         const imgWidth = img.offsetWidth * state.zoomLevel;
//         const imgHeight = img.offsetHeight * state.zoomLevel;

//         const maxPanX = Math.max(0, (imgWidth - viewWidth) / 2);
//         const maxPanY = Math.max(0, (imgHeight - viewHeight) / 2);

//         // Ease pan back into bounds
//         if (imgWidth <= viewWidth) {
//             state.panX += (0 - state.panX) * 0.2;
//         } else {
//             if (state.panX > maxPanX) state.panX += (maxPanX - state.panX) * 0.2;
//             if (state.panX < -maxPanX) state.panX += (-maxPanX - state.panX) * 0.2;
//         }

//         if (imgHeight <= viewHeight) {
//             state.panY += (0 - state.panY) * 0.2;
//         } else {
//             if (state.panY > maxPanY) state.panY += (maxPanY - state.panY) * 0.2;
//             if (state.panY < -maxPanY) state.panY += (-maxPanY - state.panY) * 0.2;
//         }

//         // Use center origin for consistent zoom behavior
//         img.style.transformOrigin = `50% 50%`;
//         updateTransform(img, state);

//         showZoomIndicator(container, state.zoomLevel);
//         dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
//     };

//     animateZoom();
// };

// export const smoothZoom = (event, img, state, container) => {
//     event.preventDefault();

//     const naturalW = img.naturalWidth;
//     const naturalH = img.naturalHeight;
//     const prevZoom = state.zoomLevel;

//     // Update zoom level
//     state.zoomLevel *= event.deltaY > 0 ? 0.9 : 1.1;
//     const maxZoom = Math.max(naturalW / img.width, naturalH / img.height, 10);
//     const clampedZoom = Math.max(1, Math.min(state.zoomLevel, maxZoom));

//     if (clampedZoom !== state.zoomLevel) {
//         showZoomLimitFeedback(container, (clampedZoom === 1 ? "min" : "max"));
//     }
//     state.zoomLevel = clampedZoom;

//     // Get image position and cursor coordinates
//     const rect = img.getBoundingClientRect();
//     const cursorX = event.clientX;
//     const cursorY = event.clientY;

//     // Get image center
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;

//     // Get cursor offset from center
//     const offsetX = cursorX - centerX;
//     const offsetY = cursorY - centerY;

//     // Adjust pan so that the image zooms into the cursor position
//     const zoomFactor = state.zoomLevel / prevZoom;
//     state.panX -= offsetX * (zoomFactor - 1);
//     state.panY -= offsetY * (zoomFactor - 1);

//     // Calculate limits
//     const viewWidth = window.innerWidth;
//     const viewHeight = window.innerHeight;
//     const imgWidth = img.offsetWidth * state.zoomLevel;
//     const imgHeight = img.offsetHeight * state.zoomLevel;

//     const maxPanX = Math.max(0, (imgWidth - viewWidth) / 2);
//     const maxPanY = Math.max(0, (imgHeight - viewHeight) / 2);

//     // Ease pan back into bounds
//     if (imgWidth <= viewWidth) {
//         state.panX += (0 - state.panX) * 0.2;
//     } else {
//         if (state.panX > maxPanX) state.panX += (maxPanX - state.panX) * 0.2;
//         if (state.panX < -maxPanX) state.panX += (-maxPanX - state.panX) * 0.2;
//     }

//     if (imgHeight <= viewHeight) {
//         state.panY += (0 - state.panY) * 0.2;
//     } else {
//         if (state.panY > maxPanY) state.panY += (maxPanY - state.panY) * 0.2;
//         if (state.panY < -maxPanY) state.panY += (-maxPanY - state.panY) * 0.2;
//     }

//     // Use center origin for consistent zoom behavior
//     img.style.transformOrigin = `50% 50%`;
//     updateTransform(img, state);

//     // Show zoom indicator overlay update
//     showZoomIndicator(container, state.zoomLevel);

//     dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
// };

export const smoothZoom = (event, img, state, container) => {
    event.preventDefault();

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const prevZoom = state.zoomLevel;

    // Update zoom level
    state.zoomLevel *= event.deltaY > 0 ? 0.9 : 1.1;
    const maxZoom = Math.max(naturalW / img.width, naturalH / img.height, 10);
    const clampedZoom = Math.max(1, Math.min(state.zoomLevel, maxZoom));

    if (clampedZoom !== state.zoomLevel) {
        showZoomLimitFeedback(container, (clampedZoom === 1 ? "min" : "max"));
    }
    state.zoomLevel = clampedZoom;

    // Get image position and cursor coordinates
    const rect = img.getBoundingClientRect();
    const cursorX = event.clientX;
    const cursorY = event.clientY;

    // Get image center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Get cursor offset from center
    const offsetX = cursorX - centerX;
    const offsetY = cursorY - centerY;

    // Adjust pan so that the image zooms into the cursor position
    const zoomFactor = state.zoomLevel / prevZoom;
    state.panX -= offsetX * (zoomFactor - 1);
    state.panY -= offsetY * (zoomFactor - 1);

    // Clamp pan to ensure the image stays within the viewport
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const imgWidth = img.offsetWidth * state.zoomLevel;
    const imgHeight = img.offsetHeight * state.zoomLevel;

    const maxPanX = Math.max(0, (imgWidth - viewWidth) / 2);
    const maxPanY = Math.max(0, (imgHeight - viewHeight) / 2);

    if (imgWidth <= viewWidth) {
        state.panX = 0;
    } else {
        state.panX = Math.min(maxPanX, Math.max(-maxPanX, state.panX));
    }

    if (imgHeight <= viewHeight) {
        state.panY = 0;
    } else {
        state.panY = Math.min(maxPanY, Math.max(-maxPanY, state.panY));
    }

    // Use center origin for consistent zoom behavior
    img.style.transformOrigin = `50% 50%`;
    updateTransform(img, state);

    // Show zoom indicator overlay update
    showZoomIndicator(container, state.zoomLevel);

    dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
};

// export const smoothZoom = (event, img, state, container) => {
//     event.preventDefault();

//     const naturalW = img.naturalWidth;
//     const naturalH = img.naturalHeight;
//     const prevZoom = state.zoomLevel;

//     // Update zoom level
//     state.zoomLevel *= event.deltaY > 0 ? 0.9 : 1.1;
//     const maxZoom = Math.max(naturalW / img.width, naturalH / img.height, 10);
//     const clampedZoom = Math.max(1, Math.min(state.zoomLevel, maxZoom));
//     // If clamping occurred, show feedback:
//     if (clampedZoom !== state.zoomLevel) {
//         showZoomLimitFeedback(container, (clampedZoom === 1 ? "min" : "max"));
//     }
//     state.zoomLevel = clampedZoom;

//     // Get image position and cursor coordinates
//     const rect = img.getBoundingClientRect();
//     const cursorX = event.clientX;
//     const cursorY = event.clientY;

//     // Get image center
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;

//     // Get cursor offset from center
//     const offsetX = cursorX - centerX;
//     const offsetY = cursorY - centerY;

//     // Adjust pan so that the image zooms into the cursor position
//     const zoomFactor = state.zoomLevel / prevZoom;
//     state.panX -= offsetX * (zoomFactor - 1);
//     state.panY -= offsetY * (zoomFactor - 1);

//     // Clamp pan to ensure the image stays within the viewport
//     const viewWidth = window.innerWidth;
//     const viewHeight = window.innerHeight;
//     const imgWidth = img.offsetWidth * state.zoomLevel;
//     const imgHeight = img.offsetHeight * state.zoomLevel;
//     const maxPanX = (imgWidth - viewWidth) / 2;
//     const maxPanY = (imgHeight - viewHeight) / 2;
//     state.panX = Math.min(maxPanX, Math.max(-maxPanX, state.panX));
//     state.panY = Math.min(maxPanY, Math.max(-maxPanY, state.panY));

//     // Use center origin for consistent zoom behavior
//     img.style.transformOrigin = `50% 50%`;
//     updateTransform(img, state);

//     // Show zoom indicator overlay update
//     showZoomIndicator(container, state.zoomLevel);

//     dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
// };

/* =========================
   Pan (Mouse & Touch) Handling
   ========================= */

// Mouse event handling for panning
export const handleMouseDown = (e, state) => {
    if (state.zoomLevel <= 1) return;
    state.isDragging = true;
    state.startX = e.clientX - state.panX;
    state.startY = e.clientY - state.panY;
    state.velocityX = 0;
    state.velocityY = 0;
};

export const handleMouseMove = (e, state, img) => {
    if (!state.isDragging) return;
    e.preventDefault();
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    state.velocityX = dx - state.panX;
    state.velocityY = dy - state.panY;
    state.panX = dx;
    state.panY = dy;
    updateTransform(img, state);
};

export const handleMouseUp = (state, img) => {
    state.isDragging = false;
    const animate = () => {
        // Compute view constraints for additional friction if beyond limits
        const viewWidth = window.innerWidth;
        const viewHeight = window.innerHeight;
        const imgWidth = img.offsetWidth * state.zoomLevel;
        const imgHeight = img.offsetHeight * state.zoomLevel;
        const maxPanX = (imgWidth - viewWidth) / 2;
        const maxPanY = (imgHeight - viewHeight) / 2;

        // Apply momentum with extra friction at the edges
        state.panX += state.velocityX * 0.95;
        state.panY += state.velocityY * 0.95;

        if (Math.abs(state.panX) > maxPanX) {
            state.velocityX *= 0.8;
        }
        if (Math.abs(state.panY) > maxPanY) {
            state.velocityY *= 0.8;
        }
        state.velocityX *= 0.9;
        state.velocityY *= 0.9;
        updateTransform(img, state);

        if (Math.abs(state.velocityX) > 0.1 || Math.abs(state.velocityY) > 0.1) {
            requestAnimationFrame(animate);
        } else {
            // Dispatch pan-end event when momentum stops
            dispatchZoomBoxEvent("pan-end", { panX: state.panX, panY: state.panY });
        }
    };
    animate();
};

// Touch event handling for pinch-to-zoom & double tap
export const handleTouchStart = (e, state, img, container) => {
    if (e.touches.length === 2) {
        state.initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        state.initialZoom = state.zoomLevel;
    } else if (e.touches.length === 1) {
        const now = Date.now();
        const tapLength = now - state.lastTap;
        if (tapLength < 300 && tapLength > 0) {
            // Toggle double-tap zoom between 1x and 2x
            state.zoomLevel = state.zoomLevel === 1 ? 2 : 1;
            if (state.zoomLevel === 1) {
                // Auto center if zoom resets to default
                autoCenterImage(img, state);
            } else {
                state.panX = 0;
                state.panY = 0;
                updateTransform(img, state);
            }
            dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
            e.preventDefault();
        }
        state.lastTap = now;
        state.isDragging = true;
        state.startX = e.touches[0].clientX - state.panX;
        state.startY = e.touches[0].clientY - state.panY;
    }
};

export const handleTouchMove = (e, state, img, container) => {
    if (e.touches.length === 2 && state.initialPinchDistance) {
        const newDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        const prevZoom = state.zoomLevel;
        const scaleFactor = newDistance / state.initialPinchDistance;
        state.zoomLevel = Math.max(1, Math.min(3, state.initialZoom * scaleFactor));
  
        const rect = img.getBoundingClientRect();
        const midX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
        const midY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
        const zoomFactor = state.zoomLevel / prevZoom;
  
        state.panX -= (midX - state.panX) * (zoomFactor - 1);
        state.panY -= (midY - state.panY) * (zoomFactor - 1);
  
        updateTransform(img, state);
        showZoomIndicator(container, state.zoomLevel);
        dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
    }
};

export const handleTouchEnd = (e, state, img) => {
    if (e.touches.length < 2) state.initialPinchDistance = null;
    if (!e.touches.length) handleMouseUp(state, img);
};

/* =========================
   Navigation & Control Buttons
   ========================= */

// Create navigation (prev/next) buttons with event dispatching for image change
export const createNavigationButtons = (images, img, state, preload, update) => {
    const prev = document.createElement("button");
    prev.className = "zoombox-prev-btn";
    prev.textContent = "⮘";
    prev.onclick = () => {
        state.currentIndex = (state.currentIndex - 1 + images.length) % images.length;
        img.src = images[state.currentIndex];
        preload(images, state.currentIndex);
        state.zoomLevel = 1;
        state.panX = 0;
        state.panY = 0;
        update(img, state);
        dispatchZoomBoxEvent("imagechange", { index: state.currentIndex, src: images[state.currentIndex] });
    };

    const next = document.createElement("button");
    next.className = "zoombox-next-btn";
    next.textContent = "⮚";
    next.onclick = () => {
        state.currentIndex = (state.currentIndex + 1) % images.length;
        img.src = images[state.currentIndex];
        preload(images, state.currentIndex);
        state.zoomLevel = 1;
        state.panX = 0;
        state.panY = 0;
        update(img, state);
        dispatchZoomBoxEvent("imagechange", { index: state.currentIndex, src: images[state.currentIndex] });
    };

    return [prev, next];
};

// Create a close button for the ZoomBox
export const createCloseButton = (closeFn) => {
    const btn = document.createElement("button");
    btn.className = "zoombox-close-btn";
    btn.textContent = "✖";
    btn.onclick = () => {
        closeFn();
        dispatchZoomBoxEvent("close");
    };
    return btn;
};

// Create zoom in/out buttons for manual zoom control
export const createZoomButtons = (img, state, container) => {
    const zoomContainer = document.createElement("div");
    zoomContainer.className = "zoombox-zoom-buttons";
    // Style via CSS or inline styles:
    zoomContainer.style.position = "absolute";
    zoomContainer.style.bottom = "8vh";
    zoomContainer.style.right = "20px";
    zoomContainer.style.display = "flex";
    zoomContainer.style.flexDirection = "column";
    zoomContainer.style.gap = "5px";
    zoomContainer.style.zIndex = 10;

    const zoomInBtn = document.createElement("button");
    zoomInBtn.textContent = "+";
    zoomInBtn.className = "zoombox-zoom-in-btn";
    zoomInBtn.onclick = () => {
        // Simulate a positive delta for zoom in
        const fakeEvent = { deltaY: -1, clientX: window.innerWidth/2, clientY: window.innerHeight/2, preventDefault: () => {} };
        smoothZoom(fakeEvent, img, state, container);
    };

    const zoomOutBtn = document.createElement("button");
    zoomOutBtn.textContent = "–";
    zoomOutBtn.className = "zoombox-zoom-out-btn";
    zoomOutBtn.onclick = () => {
        // Simulate a negative delta for zoom out
        const fakeEvent = { deltaY: 1, clientX: window.innerWidth/2, clientY: window.innerHeight/2, preventDefault: () => {} };
        smoothZoom(fakeEvent, img, state, container);
    };

    zoomContainer.appendChild(zoomInBtn);
    zoomContainer.appendChild(zoomOutBtn);

    // Append the zoom buttons container to the main container
    // container.appendChild(zoomContainer);
    return zoomContainer;
};

/* =========================
   Utility Functions
   ========================= */

// Auto center image when resetting zoom (animate panX and panY to 0)
export const autoCenterImage = (img, state) => {
    const animateCenter = () => {
        // Smoothly move panX and panY toward 0
        state.panX *= 0.85;
        state.panY *= 0.85;
        updateTransform(img, state);
        if (Math.abs(state.panX) > 0.5 || Math.abs(state.panY) > 0.5) {
            requestAnimationFrame(animateCenter);
        } else {
            state.panX = 0;
            state.panY = 0;
            updateTransform(img, state);
        }
    };
    animateCenter();
};


// Handle keyboard events for navigation, zooming, rotation, flipping, and closing
export const handleKeyboard = (e, images, img, state, preload, update, close) => {
    const prevZoom = state.zoomLevel;
    switch (e.key) {
        case "ArrowRight":
            state.currentIndex = (state.currentIndex + 1) % images.length;
            img.src = images[state.currentIndex];
            preload(images, state.currentIndex);
            state.zoomLevel = 1;
            state.panX = 0;
            state.panY = 0;
            update(img, state);
            dispatchZoomBoxEvent("imagechange", { index: state.currentIndex, src: images[state.currentIndex] });
            break;
        case "ArrowLeft":
            state.currentIndex = (state.currentIndex - 1 + images.length) % images.length;
            img.src = images[state.currentIndex];
            preload(images, state.currentIndex);
            state.zoomLevel = 1;
            state.panX = 0;
            state.panY = 0;
            update(img, state);
            dispatchZoomBoxEvent("imagechange", { index: state.currentIndex, src: images[state.currentIndex] });
            break;
        case "+":
            state.zoomLevel = Math.min(3, state.zoomLevel * 1.1);
            state.panX *= state.zoomLevel / prevZoom;
            state.panY *= state.zoomLevel / prevZoom;
            update(img, state);
            dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
            break;
        case "-":
            state.zoomLevel = Math.max(1, state.zoomLevel / 1.1);
            state.panX *= state.zoomLevel / prevZoom;
            state.panY *= state.zoomLevel / prevZoom;
            update(img, state);
            dispatchZoomBoxEvent("zoom", { level: state.zoomLevel });
            break;
        case "r":
            state.angle = (state.angle + 90) % 360;
            update(img, state);
            dispatchZoomBoxEvent("rotate", { angle: state.angle });
            break;
        case "h":
            state.flip = !state.flip;
            update(img, state);
            dispatchZoomBoxEvent("flip", { flip: state.flip });
            break;
        case "Escape":
            close();
            break;
    }
};
