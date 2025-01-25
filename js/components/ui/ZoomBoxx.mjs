const ZoomBox = (images, initialIndex = 0) => {
    if (!Array.isArray(images) || images.length === 0) {
      console.error('Invalid or empty images array passed to ZoomBox.');
      return;
    }
  
    // Validate and ensure images have proper structure
    const validateImages = (imageArray) =>
      imageArray.every((img) => img && typeof img.src === 'string');
  
    if (!validateImages(images)) {
      console.error('Images array contains invalid elements. Each image must have a "src" property.');
      return;
    }
  
    const zoombox = document.createElement('div');
    zoombox.className = 'zoombox-overlay';
  
    const content = document.createElement('div');
    content.className = 'zoombox-content';
  
    const img = document.createElement('img');
    img.src = images[initialIndex].src;
    img.alt = images[initialIndex].alt || 'ZoomBox Image';
    img.style.objectFit = 'contain';
    img.style.transition = 'transform 0.3s ease-in-out';
    content.appendChild(img);
  
    let zoomLevel = 1;
    let rotationDegree = 0;
    let currentIndex = initialIndex;
    let panX = 0,
      panY = 0;
  
    // Preload all images
    const preloadImages = (imageArray) => {
      imageArray.forEach(({ src }) => {
        const preloadedImg = new Image();
        preloadedImg.src = src;
      });
    };
    preloadImages(images);
  
    const updateImage = (index) => {
      if (index >= 0 && index < images.length) {
        img.src = images[index].src;
        img.alt = images[index].alt || 'ZoomBox Image';
        zoomLevel = 1;
        rotationDegree = 0;
        panX = 0;
        panY = 0;
        img.style.transform = 'scale(1) rotate(0deg)';
      }
    };
  
    const onWheel = (event) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      zoomLevel = Math.min(Math.max(zoomLevel + delta, 1), 3);
  
      const rect = img.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
  
      img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
      img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
    };
  
    let isDragging = false;
    let startX = 0,
      startY = 0;
  
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
      img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
    };
  
    const onMouseUp = () => {
      isDragging = false;
    };
  
    img.addEventListener('wheel', onWheel, { passive: false });
    img.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  
    const rotateLeftButton = document.createElement('button');
    rotateLeftButton.className = 'zoombox-rotate-left-btn';
    rotateLeftButton.textContent = 'Rotate Left';
    rotateLeftButton.addEventListener('click', () => {
      rotationDegree -= 90;
      img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
    });
  
    const rotateRightButton = document.createElement('button');
    rotateRightButton.className = 'zoombox-rotate-right-btn';
    rotateRightButton.textContent = 'Rotate Right';
    rotateRightButton.addEventListener('click', () => {
      rotationDegree += 90;
      img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
    });
  
    const zoomResetButton = document.createElement('button');
    zoomResetButton.className = 'zoombox-zoom-reset-btn';
    zoomResetButton.textContent = 'Reset Zoom';
    zoomResetButton.addEventListener('click', () => {
      zoomLevel = 1;
      rotationDegree = 0;
      panX = 0;
      panY = 0;
      img.style.transform = 'scale(1) rotate(0deg)';
    });
  
    const progressBar = document.createElement('div');
    progressBar.className = 'zoombox-progress-bar';
    const progress = document.createElement('div');
    progress.className = 'zoombox-progress';
    progress.style.width = `${((currentIndex + 1) / images.length) * 100}%`;
    progressBar.appendChild(progress);
  
    const updateProgress = () => {
      progress.style.width = `${((currentIndex + 1) / images.length) * 100}%`;
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    };
  
    const counter = document.createElement('div');
    counter.className = 'zoombox-counter';
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  
    if (images.length > 1) {
      const prevButton = document.createElement('button');
      prevButton.className = 'zoombox-prev-btn';
      prevButton.textContent = 'Prev';
      prevButton.addEventListener('click', () => {
        currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateImage(currentIndex);
        updateProgress();
      });
  
      const nextButton = document.createElement('button');
      nextButton.className = 'zoombox-next-btn';
      nextButton.textContent = 'Next';
      nextButton.addEventListener('click', () => {
        currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        updateImage(currentIndex);
        updateProgress();
      });
  
      content.appendChild(prevButton);
      content.appendChild(nextButton);
    }
  
    const closeButton = document.createElement('button');
    closeButton.className = 'zoombox-close-btn';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
      zoombox.remove();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    });
  
    content.appendChild(rotateLeftButton);
    content.appendChild(rotateRightButton);
    content.appendChild(zoomResetButton);
    content.appendChild(progressBar);
    content.appendChild(counter);
    content.appendChild(closeButton);
  
    zoombox.appendChild(content);
    document.body.appendChild(zoombox);
  };
  
  export default ZoomBox;
  

// const ZoomBox = (images, initialIndex = 0) => {
//     const zoombox = document.createElement('div');
//     zoombox.className = 'zoombox-overlay';
  
//     const content = document.createElement('div');
//     content.className = 'zoombox-content';
//   console.log(images);
//     const img = document.createElement('img');
//     img.src = images[initialIndex].src;
//     img.alt = images[initialIndex].alt || 'ZoomBox Image';
//     img.style.objectFit = 'contain';
//     img.style.transition = 'transform 0.3s ease-in-out';
//     content.appendChild(img);
  
//     let zoomLevel = 1;
//     let rotationDegree = 0;
//     let currentIndex = initialIndex;
//     let panX = 0, panY = 0;
  
//     const preloadImages = (imageArray) => {
//       imageArray.forEach((src) => {
//         const img = new Image();
//         img.src = src.src;
//       });
//     };
//     preloadImages(images);
  
//     const updateImage = (index) => {
//       img.src = images[index].src;
//       img.alt = images[index].alt || 'ZoomBox Image';
//       zoomLevel = 1;
//       rotationDegree = 0;
//       panX = 0;
//       panY = 0;
//       img.style.transform = 'scale(1) rotate(0deg)';
//     };
  
//     const onWheel = (event) => {
//       event.preventDefault();
//       const delta = event.deltaY > 0 ? -0.1 : 0.1;
//       zoomLevel = Math.min(Math.max(zoomLevel + delta, 1), 3);
  
//       const rect = img.getBoundingClientRect();
//       const cursorX = event.clientX - rect.left;
//       const cursorY = event.clientY - rect.top;
  
//       img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
//       img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
//     };
  
//     let isDragging = false;
//     let startX = 0, startY = 0;
  
//     const onMouseDown = (event) => {
//       if (zoomLevel > 1) {
//         isDragging = true;
//         startX = event.clientX - panX;
//         startY = event.clientY - panY;
//       }
//     };
  
//     const onMouseMove = (event) => {
//       if (!isDragging) return;
//       event.preventDefault();
//       panX = event.clientX - startX;
//       panY = event.clientY - startY;
//       img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
//     };
  
//     const onMouseUp = () => {
//       isDragging = false;
//     };

//     img.addEventListener('wheel', onWheel, { passive: false });
//     // img.addEventListener('wheel', onWheel);
//     img.addEventListener('mousedown', onMouseDown);
//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
  
//     const rotateLeftButton = document.createElement('button');
//     rotateLeftButton.className = 'zoombox-rotate-left-btn';
//     rotateLeftButton.textContent = 'Rotate Left';
//     rotateLeftButton.addEventListener('click', () => {
//       rotationDegree -= 90;
//       img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
//     });
  
//     const rotateRightButton = document.createElement('button');
//     rotateRightButton.className = 'zoombox-rotate-right-btn';
//     rotateRightButton.textContent = 'Rotate Right';
//     rotateRightButton.addEventListener('click', () => {
//       rotationDegree += 90;
//       img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
//     });
  
//     const zoomResetButton = document.createElement('button');
//     zoomResetButton.className = 'zoombox-zoom-reset-btn';
//     zoomResetButton.textContent = 'Reset Zoom';
//     zoomResetButton.addEventListener('click', () => {
//       zoomLevel = 1;
//       rotationDegree = 0;
//       panX = 0;
//       panY = 0;
//       img.style.transform = 'scale(1) rotate(0deg)';
//     });
  
//     const fitOptions = document.createElement('div');
//     fitOptions.className = 'zoombox-fit-options';
//     ['contain', 'cover', 'scale-down', 'none'].forEach((fit) => {
//       const button = document.createElement('button');
//       button.textContent = fit;
//       button.addEventListener('click', () => {
//         img.style.objectFit = fit;
//       });
//       fitOptions.appendChild(button);
//     });
  
//     const progressBar = document.createElement('div');
//     progressBar.className = 'zoombox-progress-bar';
//     const progress = document.createElement('div');
//     progress.className = 'zoombox-progress';
//     progress.style.width = `${((currentIndex + 1) / images.length) * 100}%`;
//     progressBar.appendChild(progress);
  
//     const updateProgress = () => {
//       progress.style.width = `${((currentIndex + 1) / images.length) * 100}%`;
//       counter.textContent = `${currentIndex + 1} / ${images.length}`;
//     };
  
//     const counter = document.createElement('div');
//     counter.className = 'zoombox-counter';
//     counter.textContent = `${currentIndex + 1} / ${images.length}`;
  
//     if (images.length > 1) {
//       const prevButton = document.createElement('button');
//       prevButton.className = 'zoombox-prev-btn';
//       prevButton.textContent = 'Prev';
//       prevButton.addEventListener('click', () => {
//         currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
//         updateImage(currentIndex);
//         updateProgress();
//       });
  
//       const nextButton = document.createElement('button');
//       nextButton.className = 'zoombox-next-btn';
//       nextButton.textContent = 'Next';
//       nextButton.addEventListener('click', () => {
//         currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
//         updateImage(currentIndex);
//         updateProgress();
//       });
  
//       content.appendChild(prevButton);
//       content.appendChild(nextButton);
//     }
  
//     const closeButton = document.createElement('button');
//     closeButton.className = 'zoombox-close-btn';
//     closeButton.textContent = 'Close';
//     closeButton.addEventListener('click', () => {
//       zoombox.remove();
//       document.removeEventListener('mousemove', onMouseMove);
//       document.removeEventListener('mouseup', onMouseUp);
//     });
  
//     content.appendChild(rotateLeftButton);
//     content.appendChild(rotateRightButton);
//     content.appendChild(zoomResetButton);
//     content.appendChild(fitOptions);
//     content.appendChild(progressBar);
//     content.appendChild(counter);
//     content.appendChild(closeButton);
  
//     zoombox.appendChild(content);
//     document.body.appendChild(zoombox);
//   };
  
//   export default ZoomBox;
  

// // const ZoomBox = (images, initialIndex = 0) => {
// //     const zoombox = document.createElement('div');
// //     zoombox.className = 'zoombox-overlay';
  
// //     // Create the zoombox content
// //     const content = document.createElement('div');
// //     content.className = 'zoombox-content';
  
// //     // Create the image element
// //     const img = document.createElement('img');
// //     img.src = images[initialIndex].src;
// //     img.alt = images[initialIndex].alt || 'ZoomBox Image';
// //     img.style.objectFit = 'contain';
// //     content.appendChild(img);
  
// //     let zoomLevel = 1; // Initial zoom level
// //     let rotationDegree = 0; // Initial rotation
// //     let currentIndex = initialIndex;
  
// //     // Function to update the image source
// //     const updateImage = (index) => {
// //       img.src = images[index].src;
// //       img.alt = images[index].alt || 'ZoomBox Image';
// //       zoomLevel = 1; // Reset zoom on image change
// //       rotationDegree = 0; // Reset rotation on image change
// //       img.style.transform = 'scale(1) rotate(0deg)';
// //     };
  
// //     // Mouse wheel zoom handler
// //     const onWheel = (event) => {
// //       event.preventDefault();
// //       const delta = event.deltaY > 0 ? -0.1 : 0.1; // Scroll down = zoom out, scroll up = zoom in
  
// //       zoomLevel += delta;
  
// //       if (zoomLevel < 1) zoomLevel = 1; // Prevent zooming out too much
// //       if (zoomLevel > 3) zoomLevel = 3; // Limit zooming in
  
// //       const rect = img.getBoundingClientRect();
// //       const cursorX = event.clientX - rect.left;
// //       const cursorY = event.clientY - rect.top;
  
// //       // Update the image scale based on the cursor position
// //       img.style.transform = `scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
// //       img.style.transformOrigin = `${(cursorX / rect.width) * 100}% ${(cursorY / rect.height) * 100}%`;
// //     };
  
// //     // Attach mouse wheel event listener to zoom
// //     content.addEventListener('wheel', onWheel);
  
// //     // Add rotation buttons
// //     const rotateLeftButton = document.createElement('button');
// //     rotateLeftButton.className = 'zoombox-rotate-left-btn';
// //     rotateLeftButton.textContent = 'Rotate Left';
// //     rotateLeftButton.addEventListener('click', () => {
// //       rotationDegree -= 90;
// //       img.style.transform = `scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
// //     });
  
// //     const rotateRightButton = document.createElement('button');
// //     rotateRightButton.className = 'zoombox-rotate-right-btn';
// //     rotateRightButton.textContent = 'Rotate Right';
// //     rotateRightButton.addEventListener('click', () => {
// //       rotationDegree += 90;
// //       img.style.transform = `scale(${zoomLevel}) rotate(${rotationDegree}deg)`;
// //     });
  
// //     // Add zoom reset button
// //     const zoomResetButton = document.createElement('button');
// //     zoomResetButton.className = 'zoombox-zoom-reset-btn';
// //     zoomResetButton.textContent = 'Reset Zoom';
// //     zoomResetButton.addEventListener('click', () => {
// //       zoomLevel = 1;
// //       rotationDegree = 0;
// //       img.style.transform = 'scale(1) rotate(0deg)';
// //     });
  
// //     // Add image fit options
// //     const fitOptions = document.createElement('div');
// //     fitOptions.className = 'zoombox-fit-options';
  
// //     ['contain', 'cover', 'scale-down', 'none'].forEach((fit) => {
// //       const button = document.createElement('button');
// //       button.textContent = fit;
// //       button.addEventListener('click', () => {
// //         img.style.objectFit = fit;
// //       });
// //       fitOptions.appendChild(button);
// //     });
  
// //     // Create progress bar
// //     const progressBar = document.createElement('div');
// //     progressBar.className = 'zoombox-progress-bar';
// //     const progress = document.createElement('div');
// //     progress.className = 'zoombox-progress';
// //     progress.style.width = `${((currentIndex + 1) / images.length) * 100}%`;
// //     progressBar.appendChild(progress);
  
// //     // Update progress bar and counter
// //     const updateProgress = () => {
// //       progress.style.width = `${((currentIndex + 1) / images.length) * 100}%`;
// //       counter.textContent = `${currentIndex + 1} / ${images.length}`;
// //     };
  
// //     // Add image counter
// //     const counter = document.createElement('div');
// //     counter.className = 'zoombox-counter';
// //     counter.textContent = `${currentIndex + 1} / ${images.length}`;
  
// //     // Create navigation buttons
// //     if (images.length > 1) {
// //       const prevButton = document.createElement('button');
// //       prevButton.className = 'zoombox-prev-btn';
// //       prevButton.textContent = 'Prev';
  
// //       prevButton.addEventListener('click', () => {
// //         currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
// //         updateImage(currentIndex);
// //         updateProgress();
// //       });
  
// //       const nextButton = document.createElement('button');
// //       nextButton.className = 'zoombox-next-btn';
// //       nextButton.textContent = 'Next';
  
// //       nextButton.addEventListener('click', () => {
// //         currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
// //         updateImage(currentIndex);
// //         updateProgress();
// //       });
  
// //       content.appendChild(prevButton);
// //       content.appendChild(nextButton);
// //     }
  
// //     // Add close button
// //     const closeButton = document.createElement('button');
// //     closeButton.className = 'zoombox-close-btn';
// //     closeButton.textContent = 'Close';
// //     closeButton.addEventListener('click', () => {
// //       zoombox.remove();
// //     });
  
// //     // Append elements to the content
// //     content.appendChild(rotateLeftButton);
// //     content.appendChild(rotateRightButton);
// //     content.appendChild(zoomResetButton);
// //     content.appendChild(fitOptions);
// //     content.appendChild(progressBar);
// //     content.appendChild(counter);
// //     content.appendChild(closeButton);
  
// //     // Append the content to the zoombox
// //     zoombox.appendChild(content);
  
// //     // Append the zoombox to the body
// //     document.body.appendChild(zoombox);
// //   };
  
// //   export default ZoomBox;
  