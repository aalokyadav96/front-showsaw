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
  img.setAttribute('class','zoombox-image');
  content.appendChild(img);

  let zoomLevel = 1; // Initial zoom level
  let currentIndex = initialIndex;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let imgOffsetX = 0;
  let imgOffsetY = 0;

  // Function to update the image source
  const updateImage = (index) => {
    img.src = images[index];
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center';
    zoomLevel = 1; // Reset zoom on image change
    imgOffsetX = 0;
    imgOffsetY = 0;
    img.style.transition = 'transform 0.3s';
    setTimeout(() => (img.style.transition = ''), 300); // Remove transition after reset
  };

  // Mouse wheel zoom handler
  const onWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1; // Scroll down = zoom out, scroll up = zoom in
    zoomLevel = Math.min(Math.max(zoomLevel + delta, 1), 3); // Clamp zoom level between 1 and 3

    const rect = img.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    // Update the image scale based on the cursor position
    img.style.transform = `scale(${zoomLevel}) translate(${imgOffsetX}px, ${imgOffsetY}px)`;
    img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
  };

  // Dragging behavior for panning
  const onDragStart = (event) => {
    if (zoomLevel > 1) {
      isDragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
    }
  };

  const onDragMove = (event) => {
    if (isDragging) {
      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;

      imgOffsetX += deltaX / zoomLevel;
      imgOffsetY += deltaY / zoomLevel;

      img.style.transform = `scale(${zoomLevel}) translate(${imgOffsetX}px, ${imgOffsetY}px)`;

      dragStartX = event.clientX;
      dragStartY = event.clientY;
    }
  };

  const onDragEnd = () => {
    isDragging = false;
  };

  // Keyboard navigation
  const onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        updateImage(currentIndex);
        break;
      case 'ArrowRight':
        currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        updateImage(currentIndex);
        break;
      case 'Escape':
        zoombox.remove();
        break;
      default:
        break;
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      zoombox.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Create navigation buttons (optional)
  if (images.length > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'zoombox-prev-btn';
    prevButton.textContent = '⮘';
    const nextButton = document.createElement('button');
    nextButton.className = 'zoombox-next-btn';
    nextButton.textContent = '⮚';

    // Navigation functionality
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
      updateImage(currentIndex);
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
      updateImage(currentIndex);
    });

    content.appendChild(prevButton);
    content.appendChild(nextButton);
  }

  // Add fullscreen button
  const fullscreenButton = document.createElement('button');
  fullscreenButton.className = 'zoombox-fullscreen-btn';
  fullscreenButton.textContent = '⛶';
  fullscreenButton.addEventListener('click', toggleFullscreen);

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'zoombox-close-btn';
  closeButton.textContent = '✖';
  closeButton.addEventListener('click', () => {
    zoombox.remove();
  });

  // Attach event listeners for dragging
  img.addEventListener('mousedown', onDragStart);
  img.addEventListener('mousemove', onDragMove);
  img.addEventListener('mouseup', onDragEnd);
  img.addEventListener('mouseleave', onDragEnd);

  // Attach mouse wheel event listener to zoom
  content.addEventListener('wheel', onWheel);

  // Attach keyboard event listener
  document.addEventListener('keydown', onKeyDown);

  // Append elements to the content
  content.appendChild(fullscreenButton);
  content.appendChild(closeButton);

  // Append the content to the zoombox
  zoombox.appendChild(content);

  // Append the zoombox to the body
  document.body.appendChild(zoombox);
};

export default ZoomBox;


// const ZoomBox = (images, initialIndex = 0) => {
//   const zoombox = document.createElement('div');
//   zoombox.className = 'zoombox-overlay';

//   // Create the zoombox content
//   const content = document.createElement('div');
//   content.className = 'zoombox-content';

//   // Create the image element
//   const img = document.createElement('img');
//   img.src = images[initialIndex];
//   img.alt = 'ZoomBox Image';
//   content.appendChild(img);

//   let zoomLevel = 1; // Initial zoom level
//   let currentIndex = initialIndex;

//   // Function to update the image source
//   const updateImage = (index) => {
//     img.src = images[index];
//   };

//   // Mouse wheel zoom handler
//   const onWheel = (event) => {
//     event.preventDefault();
//     const delta = event.deltaY > 0 ? -0.1 : 0.1; // Scroll down = zoom out, scroll up = zoom in

//     zoomLevel += delta;

//     if (zoomLevel < 1) zoomLevel = 1; // Prevent zooming out too much
//     if (zoomLevel > 3) zoomLevel = 3; // Limit zooming in

//     const rect = img.getBoundingClientRect();
//     const cursorX = event.clientX - rect.left;
//     const cursorY = event.clientY - rect.top;

//     // Update the image scale based on the cursor position
//     img.style.transform = `scale(${zoomLevel})`;
//     img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;

//     // Optionally, update the position of the image to keep it centered under the cursor
//   };

//   // Attach mouse wheel event listener to zoom
//   content.addEventListener('wheel', onWheel);

//   // Create navigation buttons (optional)
//   if (images.length > 1) {
//     const prevButton = document.createElement('button');
//     prevButton.className = 'zoombox-prev-btn';
//     prevButton.textContent = 'Prev';
//     const nextButton = document.createElement('button');
//     nextButton.className = 'zoombox-next-btn';
//     nextButton.textContent = 'Next';

//     // Navigation functionality
//     prevButton.addEventListener('click', () => {
//       currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
//       updateImage(currentIndex);
//       zoomLevel = 1; // Reset zoom on image change
//     });

//     nextButton.addEventListener('click', () => {
//       currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
//       updateImage(currentIndex);
//       zoomLevel = 1; // Reset zoom on image change
//     });

//     content.appendChild(prevButton);
//     content.appendChild(nextButton);
//   }

//   // Add close button
//   const closeButton = document.createElement('button');
//   closeButton.className = 'zoombox-close-btn';
//   closeButton.textContent = 'Close';
//   closeButton.addEventListener('click', () => {
//     zoombox.remove();
//   });

//   // Append elements to the content
//   content.appendChild(closeButton);

//   // Append the content to the zoombox
//   zoombox.appendChild(content);

//   // Append the zoombox to the body
//   document.body.appendChild(zoombox);
// };

// export default ZoomBox;

