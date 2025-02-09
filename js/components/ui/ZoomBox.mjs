const ZoomBox = (images, initialIndex = 0) => {
  const zoombox = document.createElement('div');
  zoombox.className = 'zoombox-overlay';

  // Create the zoombox content
  const content = document.createElement('div');
  content.className = 'zoombox-content';

  // Create the image element
  const img = document.createElement('img');
  img.src = images[initialIndex];
  img.alt = 'ZoomBox Image';
  img.style.transition = 'transform 0.3s ease-in-out'; // Smooth zoom transitions
  content.appendChild(img);

  let zoomLevel = 1; // Initial zoom level
  let currentIndex = initialIndex;
  let panX = 0, panY = 0; // For panning

  // Preload images for smoother transitions
  const preloadImages = (imageArray) => {
    imageArray.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };
  preloadImages(images);

  // Update the image source
  const updateImage = (index) => {
    img.src = images[index];
    img.style.transform = 'scale(1)'; // Reset zoom on image change
    zoomLevel = 1;
    panX = 0;
    panY = 0;
  };

  // Mouse wheel zoom handler with throttling
  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  const onWheel = throttle((event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1; // Scroll down = zoom out, up = zoom in
    zoomLevel = Math.min(Math.max(zoomLevel + delta, 1), 3); // Limit zoom level (1x to 3x)

    const rect = img.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
    img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel})`;
  }, 50); // Throttle wheel events to run at most every 50ms

  // Drag to pan functionality
  let isDragging = false;
  let startX = 0, startY = 0;

  const onMouseDown = (event) => {
    if (zoomLevel > 1) {
      isDragging = true;
      startX = event.clientX - panX;
      startY = event.clientY - panY;
    }
  };

  const onMouseMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();

    panX = event.clientX - startX;
    panY = event.clientY - startY;

    img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel})`;
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  // Add event listeners for panning and zooming
  // img.addEventListener('wheel', onWheel);
  img.addEventListener('wheel', onWheel, { passive: false });
  img.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // Navigation buttons
  if (images.length > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'zoombox-prev-btn';
    prevButton.textContent = '⮘';
    const nextButton = document.createElement('button');
    nextButton.className = 'zoombox-next-btn';
    nextButton.textContent = '⮚';

    prevButton.addEventListener('click', () => {
      currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      updateImage(currentIndex);
    });

    nextButton.addEventListener('click', () => {
      currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      updateImage(currentIndex);
    });

    content.appendChild(prevButton);
    content.appendChild(nextButton);
  }

  // Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'zoombox-close-btn';
  closeButton.textContent = '✖';
  closeButton.addEventListener('click', () => {
    zoombox.remove();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  });

  content.appendChild(closeButton);

  zoombox.appendChild(content);
  // document.getElementById('app').appendChild(zoombox);
  document.body.appendChild(zoombox);
};

export default ZoomBox;
