const ZoomBox = (images, initialIndex = 0, options = {}) => {
  const { multiView = false } = options;

  // Create overlay container and content container
  const zoombox = document.createElement('div');
  zoombox.className = 'zoombox-overlay';
  zoombox.style.opacity = '0';
  zoombox.style.transition = 'opacity 0.3s ease';

  // Dark mode auto-detection
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    zoombox.classList.add('dark-mode');
  }

  const content = document.createElement('div');
  content.className = 'zoombox-content';

  // Transformation state
  let zoomLevel = 1;
  let panX = 0,
    panY = 0;
  let currentIndex = initialIndex;
  let isDragging = false;
  let startX = 0,
    startY = 0;
  let velocityX = 0,
    velocityY = 0;
  let lastTap = 0;
  // For pinch-to-zoom
  let initialPinchDistance = null;
  let initialZoom = 1;
  let angle = 90;

  // Preload only nearby images (or the two images for multi-view)
  const preloadImages = (index) => {
    const indexes = multiView
      ? [0, 1]
      : [
        index,
        (index + 1) % images.length,
        (index - 1 + images.length) % images.length,
      ];
    indexes.forEach((i) => {
      const img = new Image();
      img.src = images[i];
    });
  };
  preloadImages(currentIndex);

  // --- Create image(s) ---
  let img; // used in single-view mode
  let bottomImg, topImg, slider; // used in multi-view mode

  if (!multiView) {
    // Single image view
    img = document.createElement('img');
    img.src = images[currentIndex];
    img.alt = 'ZoomBox Image';
    img.style.transition = 'transform 0.2s ease-out';
    img.style.willChange = 'transform';
    content.appendChild(img);
  } else {
    // Multi-view mode (Before/After)
    const multiContainer = document.createElement('div');
    multiContainer.className = 'multiview-container';
    multiContainer.style.position = 'relative';
    multiContainer.style.overflow = 'hidden';

    // Bottom (base) image
    bottomImg = document.createElement('img');
    bottomImg.src = images[0];
    bottomImg.alt = 'ZoomBox Base Image';
    bottomImg.style.width = '100%';
    bottomImg.style.height = 'auto';
    bottomImg.style.transition = 'transform 0.2s ease-out';
    bottomImg.style.willChange = 'transform';
    multiContainer.appendChild(bottomImg);

    // Top (compare) image
    topImg = document.createElement('img');
    topImg.src = images[1];
    topImg.alt = 'ZoomBox Compare Image';
    topImg.style.position = 'absolute';
    topImg.style.top = '0';
    topImg.style.left = '0';
    topImg.style.width = '100%';
    topImg.style.height = 'auto';
    topImg.style.transition = 'transform 0.2s ease-out';
    topImg.style.willChange = 'transform';
    // Initially clip top image to 50%
    topImg.style.clipPath = 'inset(0 50% 0 0)';
    multiContainer.appendChild(topImg);

    // Slider to control the comparison
    slider = document.createElement('div');
    slider.className = 'multiview-slider';
    slider.style.position = 'absolute';
    slider.style.top = '0';
    slider.style.left = '50%';
    slider.style.width = '4px';
    slider.style.height = '100%';
    slider.style.background = '#fff';
    slider.style.cursor = 'ew-resize';
    multiContainer.appendChild(slider);

    content.appendChild(multiContainer);
  }

  // --- Update transformation ---
  const updateTransform = () => {
    const transformStr = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    if (!multiView) {
      img.style.transform = transformStr;
    } else {
      bottomImg.style.transform = transformStr;
      topImg.style.transform = transformStr;
    }
  };

  // --- Update transformation ---
  const rotateImage = (img, angle) => {
    img.style.transform = `rotate(${angle}deg)`;
  };

  // // Smoothed zoom handling
  // const smoothZoom = (delta, event) => {
  //   const naturalWidth = img.naturalWidth;
  //   const naturalHeight = img.naturalHeight;

  //   zoomLevel *= delta > 0 ? 0.9 : 1.1; // Exponential zoom for a natural feel
  //   // zoomLevel = Math.max(1, Math.min(zoomLevel, Math.max(naturalWidth / img.width, naturalHeight / img.height)));
  //   zoomLevel = Math.max(1, Math.min(zoomLevel, Math.max(naturalWidth / img.width, naturalHeight / img.height)));

  //   const rect = img.getBoundingClientRect();
  //   const cursorX = event.clientX - rect.left;
  //   const cursorY = event.clientY - rect.top;

  //   img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
  //   img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  // };

  // Smoothed zoom handling
  const smoothZoom = (delta, event) => {
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    zoomLevel *= delta > 0 ? 0.9 : 1.1; // Exponential zoom for a natural feel
    // zoomLevel = Math.max(1, Math.min(zoomLevel, Math.max(naturalWidth / img.width, naturalHeight / img.height)));
    zoomLevel = Math.max(1, Math.min(zoomLevel, Math.max(naturalWidth / img.width, naturalHeight / img.height)));

    const rect = img.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
    img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  };

  const onWheel = (event) => {
    event.preventDefault();
    requestAnimationFrame(() => smoothZoom(event.deltaY, event));
  };

  // Add event listener for the wheel event
  img.addEventListener('wheel', onWheel);


  /*
    // Smoothed zoom handling
    const smoothZoom = (delta, event) => {
      zoomLevel *= delta > 0 ? 0.9 : 1.1; // Exponential zoom for a natural feel
      zoomLevel = Math.max(1, Math.min(3, zoomLevel));
  
      const rect = img.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
  
      img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
      img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    };
  
    const onWheel = (event) => {
      event.preventDefault();
      requestAnimationFrame(() => smoothZoom(event.deltaY, event));
    };
    */

  // // --- Desktop Wheel Zoom (with exponential scaling) ---
  // const onWheel = (event) => {
  //   event.preventDefault();
  //   const rect = img.getBoundingClientRect(); // Get current image position
  //   const cursorX = event.clientX - rect.left; // Cursor X relative to image
  //   const cursorY = event.clientY - rect.top;  // Cursor Y relative to image

  //   const prevZoom = zoomLevel;
  //   const delta = event.deltaY > 0 ? 0.9 : 1.1; // Scroll down = zoom out, up = zoom in
  //   zoomLevel *= delta;
  //   zoomLevel = Math.max(1, Math.min(3, zoomLevel)); // Limit zoom level (1x - 3x)

  //   // Adjust pan so that zoom is centered at the cursor
  //   const zoomFactor = zoomLevel / prevZoom;
  //   panX -= (cursorX - panX) * (zoomFactor - 1);
  //   panY -= (cursorY - panY) * (zoomFactor - 1);

  //   updateTransform();
  // };


  // --- Touch Handlers for Pinch-to-Zoom and Double-Tap ---
  const onTouchStart = (event) => {
    if (event.touches.length === 2) {
      // Pinch start
      initialPinchDistance = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY
      );
      initialZoom = zoomLevel;
    } else if (event.touches.length === 1) {
      // Detect double-tap
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        // Double-tap toggles zoom between 1x and 2x
        if (zoomLevel === 1) {
          zoomLevel = 2;
        } else {
          zoomLevel = 1;
          panX = 0;
          panY = 0;
        }
        updateTransform();
        event.preventDefault();
      }
      lastTap = currentTime;

      // Begin panning
      isDragging = true;
      startX = event.touches[0].clientX - panX;
      startY = event.touches[0].clientY - panY;
      velocityX = 0;
      velocityY = 0;
    }
  };

  const onTouchMove = (event) => {
    if (event.touches.length === 2 && initialPinchDistance) {
      const newDistance = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY
      );

      const scaleFactor = newDistance / initialPinchDistance;
      const prevZoom = zoomLevel;
      zoomLevel = Math.max(1, Math.min(3, initialZoom * scaleFactor));

      // Centering zoom based on middle point of fingers
      const rect = img.getBoundingClientRect();
      const midX =
        (event.touches[0].clientX + event.touches[1].clientX) / 2 - rect.left;
      const midY =
        (event.touches[0].clientY + event.touches[1].clientY) / 2 - rect.top;

      const zoomFactor = zoomLevel / prevZoom;
      panX -= (midX - panX) * (zoomFactor - 1);
      panY -= (midY - panY) * (zoomFactor - 1);

      updateTransform();
    }
  };


  const onTouchEnd = (event) => {
    if (event.touches.length < 2) {
      initialPinchDistance = null;
    }
    if (!event.touches.length) {
      isDragging = false;
      // Inertia-based panning (momentum)
      const momentum = () => {
        panX += velocityX * 0.95;
        panY += velocityY * 0.95;
        velocityX *= 0.9;
        velocityY *= 0.9;
        updateTransform();
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
          requestAnimationFrame(momentum);
        }
      };
      momentum();
    }
  };


  const onDoubleTap = (event) => {
    const now = Date.now();
    if (now - lastTap < 300) { // Double tap detected
      const rect = img.getBoundingClientRect();
      const tapX = event.clientX - rect.left;
      const tapY = event.clientY - rect.top;

      zoomLevel = zoomLevel === 1 ? 2 : 1;

      panX = zoomLevel === 1 ? 0 : -(tapX * (zoomLevel - 1));
      panY = zoomLevel === 1 ? 0 : -(tapY * (zoomLevel - 1));

      updateTransform();
    }
    lastTap = now;
  };
  img.addEventListener("click", onDoubleTap);

  // --- Mouse Handlers for Desktop Panning ---
  const onMouseDown = (event) => {
    if (zoomLevel <= 1) return;
    isDragging = true;
    startX = event.clientX - panX;
    startY = event.clientY - panY;
    velocityX = 0;
    velocityY = 0;
  };

  const onMouseMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    velocityX = dx - panX;
    velocityY = dy - panY;
    panX = dx;
    panY = dy;
    updateTransform();
  };

  const onMouseUp = () => {
    isDragging = false;
    const momentum = () => {
      panX += velocityX * 0.95;
      panY += velocityY * 0.95;
      velocityX *= 0.9;
      velocityY *= 0.9;
      updateTransform();
      if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
        requestAnimationFrame(momentum);
      }
    };
    momentum();
  };

  // --- Attach Event Listeners ---
  if (!multiView) {
    img.addEventListener('wheel', onWheel, { passive: false });
    img.addEventListener('mousedown', onMouseDown);
    img.addEventListener('touchstart', onTouchStart, { passive: false });
    img.addEventListener('touchmove', onTouchMove, { passive: false });
    img.addEventListener('touchend', onTouchEnd);
  } else {
    // For multi-view, attach events to the base image element
    bottomImg.addEventListener('wheel', onWheel, { passive: false });
    bottomImg.addEventListener('mousedown', onMouseDown);
    bottomImg.addEventListener('touchstart', onTouchStart, { passive: false });
    bottomImg.addEventListener('touchmove', onTouchMove, { passive: false });
    bottomImg.addEventListener('touchend', onTouchEnd);
  }
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // --- Keyboard Shortcuts ---
  const onKeyDown = (event) => {
    const prevZoom = zoomLevel;
    switch (event.key) {
      case 'ArrowRight':
        // Next image (only for single-view)
        if (!multiView) {
          currentIndex = (currentIndex + 1) % images.length;
          img.src = images[currentIndex];
          preloadImages(currentIndex);
          panX = 0;
          panY = 0;
          zoomLevel = 1;
          updateTransform();
        }
        break;
      case 'ArrowLeft':
        if (!multiView) {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          img.src = images[currentIndex];
          preloadImages(currentIndex);
          panX = 0;
          panY = 0;
          zoomLevel = 1;
          updateTransform();
        }
        break;
      case '+':
        // Zoom in
        // const prevZoom = zoomLevel;
        zoomLevel = Math.min(3, zoomLevel * 1.1);
        panX *= zoomLevel / prevZoom;
        panY *= zoomLevel / prevZoom;
        updateTransform();
        break;
      case '-':
        // Zoom out
        // const prevZoom = zoomLevel;
        zoomLevel = Math.max(1, zoomLevel / 1.1);
        panX *= zoomLevel / prevZoom;
        panY *= zoomLevel / prevZoom;
        updateTransform();
        break;
      case 'Escape':
        closeZoomBox();
        break;
      case "r":
        rotateImage(img, angle);
        angle = (angle + 90) % 360;
        break;
    }
  };
  document.addEventListener('keydown', onKeyDown);

  // --- Multi-View Slider (Before/After) ---
  if (multiView && slider) {
    let isSliderDragging = false;
    const onSliderMouseDown = () => {
      isSliderDragging = true;
    };
    const onSliderMouseMove = (event) => {
      if (!isSliderDragging) return;
      const containerRect = slider.parentElement.getBoundingClientRect();
      let percentage =
        ((event.clientX - containerRect.left) / containerRect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));
      slider.style.left = `${percentage}%`;
      topImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    };
    const onSliderMouseUp = () => {
      isSliderDragging = false;
    };
    slider.addEventListener('mousedown', onSliderMouseDown);
    document.addEventListener('mousemove', onSliderMouseMove);
    document.addEventListener('mouseup', onSliderMouseUp);

    // Touch events for slider
    slider.addEventListener(
      'touchstart',
      (event) => {
        isSliderDragging = true;
        event.preventDefault();
      },
      { passive: false }
    );
    slider.addEventListener(
      'touchmove',
      (event) => {
        if (!isSliderDragging) return;
        const touch = event.touches[0];
        const containerRect = slider.parentElement.getBoundingClientRect();
        let percentage =
          ((touch.clientX - containerRect.left) / containerRect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        slider.style.left = `${percentage}%`;
        topImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        event.preventDefault();
      },
      { passive: false }
    );
    slider.addEventListener('touchend', () => {
      isSliderDragging = false;
    });
  }

  // --- Navigation Buttons (Single-View Only) ---
  if (!multiView && images.length > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'zoombox-prev-btn';
    prevButton.textContent = '⮘';
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      img.src = images[currentIndex];
      preloadImages(currentIndex);
      panX = 0;
      panY = 0;
      zoomLevel = 1;
      updateTransform();
    });
    const nextButton = document.createElement('button');
    nextButton.className = 'zoombox-next-btn';
    nextButton.textContent = '⮚';
    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      img.src = images[currentIndex];
      preloadImages(currentIndex);
      panX = 0;
      panY = 0;
      zoomLevel = 1;
      updateTransform();
    });
    content.appendChild(prevButton);
    content.appendChild(nextButton);

    const lazyLoadImage = (index) => {
      if (!images[index]) return;
      const img = new Image();
      img.src = images[index];
    };
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage(currentIndex);
      lazyLoadImage(currentIndex - 1); // Preload previous image
    });
    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage(currentIndex);
      lazyLoadImage(currentIndex + 1); // Preload next image
    });

  }

  // --- Close Button ---
  const closeButton = document.createElement('button');
  closeButton.className = 'zoombox-close-btn';
  closeButton.textContent = '✖';
  const closeZoomBox = () => {
    zoombox.style.opacity = '0';
    setTimeout(() => {
      zoombox.remove();
      // (Optional) Remove any global event listeners if needed
    }, 300);
  };
  closeButton.addEventListener('click', closeZoomBox);
  content.appendChild(closeButton);

  zoombox.appendChild(content);
  document.body.appendChild(zoombox);

  // Fade in overlay
  requestAnimationFrame(() => {
    zoombox.style.opacity = '1';
  });
};

export default ZoomBox;

// // // Single-View Mode:
// // Pass an array of image URLs
// // ZoomBox(['image1.jpg', 'image2.jpg', 'image3.jpg'], 0);

// // // Multi-View Mode (Before/After Comparison):
// //  Pass two images for comparison and enable multiView mode
// ZoomBox(['before.jpg', 'after.jpg'], 0, { multiView: true });
