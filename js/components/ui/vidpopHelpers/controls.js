import Button from "../../base/Button.js";
import { setupVideoUtilityFunctions } from "../vidpopUtilities.js";
import { createFilterSelector } from "./filters.js";
import { togglePictureInPicture } from "./vutils.js";
import "../../../../css/vidControls.css";

function createControls(video, mediaSrc, qualities, videoid, videoPlayer) {
  const controls = createElement("div", "controls");
  const progressBar = createProgressBar();
  const buttons = createElement("div", "buttons");

  // Add quality selector if multiple qualities exist
  const qualitySelector = qualities.length ? createQualitySelector(video, qualities) : null;
  const speedDropdown = createSpeedDropdown(video);
  const filterSelector = createFilterSelector(video);

 
  const muteButton = Button("🔇", "mute", { click: () => video.muted = !video.muted });
  const fullscreenButton = Button("⛶", "fullscreen", { click: () => toggleFullScreen(videoPlayer) });
  const pipButton = Button("PiP", "pip", { click: () => togglePictureInPicture(video) });
  const dragBox = Button("P", "drag", { click: () => setupVideoUtilityFunctions(video, videoid) });

  appendElements(buttons, [filterSelector, speedDropdown, dragBox, muteButton, pipButton, fullscreenButton]);
  if (qualitySelector) buttons.prepend(qualitySelector); // Ensure quality selector appears first

  appendElements(controls, [progressBar, buttons]);
  setupFullscreenControls(videoPlayer, controls);

  return controls;
}

/** =================== ELEMENT CREATION HELPERS =================== **/
function createElement(tag, className, attributes = {}, events = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  Object.entries(events).forEach(([event, handler]) => element.addEventListener(event, handler));
  return element;
}


function appendElements(parent, children) {
  children.forEach(child => child && parent.appendChild(child));
}

/** =================== PROGRESS BAR =================== **/
function createProgressBar() {
  const progressBar = createElement("div", "progress-bar");
  const progress = createElement("div", "progress");
  progressBar.appendChild(progress);
  return progressBar;
}

/** =================== QUALITY SELECTOR =================== **/
function createQualitySelector(video, qualities) {
  const qualitySelector = createElement("select", "quality-selector");

  qualities.forEach(({ src, label }) => {
    const option = createElement("option", null, { value: label }); // Use label instead of src
    option.textContent = label;
    option.selected = label === (localStorage.getItem("videoQuality") || "480p");
    qualitySelector.appendChild(option);
  });

  qualitySelector.addEventListener("change", (e) => handleQualityChange(e, video, qualities));
  return qualitySelector;
}

function handleQualityChange(event, video, qualities) {
  // const selectedQuality = qualities.find(q => q.src === event.target.value);
  const selectedQuality = qualities.find(q => q.label === event.target.value);

  if (!selectedQuality) return;

  localStorage.setItem("videoQuality", selectedQuality.label);
  const { currentTime, paused } = video;

  video.src = selectedQuality.src;
  video.setAttribute("data-quality", selectedQuality.label);

  video.addEventListener("loadedmetadata", () => {
    video.currentTime = currentTime;
    if (!paused) video.play();
  }, { once: true });
}

/** =================== PLAYBACK SPEED DROPDOWN =================== **/
function createSpeedDropdown(video) {
  const speedDropdown = createElement("select", "playback-speed");
  [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].forEach(speed => {
    const option = createElement("option", null, { value: speed });
    option.textContent = `${speed}x`;
    if (speed === 1) option.selected = true;
    speedDropdown.appendChild(option);
  });

  speedDropdown.addEventListener("change", (e) => handleSpeedChange(e, video));
  return speedDropdown;
}

function handleSpeedChange(event, video) {
  video.playbackRate = parseFloat(event.target.value);
}
/** =================== FULLSCREEN & CONTROLS LOGIC =================== **/
function toggleFullScreen(videoPlayer) {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    (videoPlayer.requestFullscreen || videoPlayer.webkitRequestFullscreen)?.call(videoPlayer);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
  }
}

// function toggleFullScreen(videoPlayer) {
//   if (!document.fullscreenElement) {
//     videoPlayer.requestFullscreen().then(() => {
//       if (isMobile() && videoPlayer.videoWidth > videoPlayer.videoHeight) {
//         lockOrientation("landscape");
//       }
//     }).catch(err => console.error("Fullscreen failed:", err));
//   } else {
//     document.exitFullscreen().then(() => {
//       if (isMobile()) unlockOrientation();
//     });
//   }
// }

function setupFullscreenControls(videoPlayer, controls) {
  let controlsTimeout;

  function showControls() {
    controls.style.opacity = "1";
    controls.style.pointerEvents = "auto";
  }

  function hideControls() {
    controls.style.opacity = "0";
    controls.style.pointerEvents = "none";
  }

  videoPlayer.addEventListener("mousemove", () => {
    showControls();
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(hideControls, 3000);
  });

  controls.addEventListener("mouseenter", () => clearTimeout(controlsTimeout));
  controls.addEventListener("mouseleave", () => {
    controlsTimeout = setTimeout(hideControls, 3000);
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === videoPlayer) {
      videoPlayer.classList.add("fullscreen");
      showControls();

      // Auto-rotate to landscape if on mobile
      if (isMobile() && videoPlayer.videoWidth > videoPlayer.videoHeight) {
        lockOrientation("landscape");
      }
    } else {
      videoPlayer.classList.remove("fullscreen");

      // Unlock orientation when exiting fullscreen
      if (isMobile()) unlockOrientation();
    }
  });

  setTimeout(hideControls, 3000);
}

/** =================== ORIENTATION LOGIC =================== **/

/**
 * Detects if the user is on a mobile device.
 * @returns {boolean}
 */
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Locks the screen orientation (only works inside fullscreen).
 * @param {string} orientation - "landscape" or "portrait"
 */
function lockOrientation(orientation) {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock(orientation).catch(err => console.warn("Orientation lock failed:", err));
  }
}

/**
 * Unlocks screen orientation.
 */
function unlockOrientation() {
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
}


export { createControls };
