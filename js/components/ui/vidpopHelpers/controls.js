import Button from "../../base/Button.js";
import { setupVideoUtilityFunctions } from "../vidpopUtilities.js";
import { createFilterSelector } from "./filters.js";
import { togglePictureInPicture, downloadVideo} from "./utils.js";
import "../../../../css/vidControls.css";

function createControls(video, mediaSrc, qualities, videoid, videoPlayer) {
  const controls = document.createElement("div");
  controls.className = "controls"; // No 'visible' class needed

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  const progress = document.createElement("div");
  progress.className = "progress";
  progressBar.appendChild(progress);

  const buttons = document.createElement("div");
  buttons.className = "buttons";

  // Quality Selector
  const qualitySelector = document.createElement("select");
  qualitySelector.className = "quality-selector";

  qualities.forEach((quality) => {
    const option = document.createElement("option");
    option.value = quality.src;
    option.textContent = quality.label;
    option.selected = quality.label === (localStorage.getItem("videoQuality") || "480p");
    qualitySelector.appendChild(option);
  });

  qualitySelector.addEventListener("change", (e) => {
    const selectedQuality = qualities.find(q => q.src === e.target.value);
    if (!selectedQuality) return;

    localStorage.setItem("videoQuality", selectedQuality.label);

    // Preserve time and state
    const currentTime = video.currentTime;
    const wasPaused = video.paused;

    video.src = selectedQuality.src;
    video.setAttribute("data-quality", selectedQuality.label);

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = currentTime;
      if (!wasPaused) video.play();
    }, { once: true });
  });

  // Playback Speed Control
  const speedDropdown = document.createElement("select");
  speedDropdown.className = "playback-speed";
  [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].forEach((speed) => {
    const option = document.createElement("option");
    option.value = speed;
    option.textContent = `${speed}x`;
    if (speed === 1) option.selected = true;
    speedDropdown.appendChild(option);
  });

  speedDropdown.addEventListener("change", (e) => {
    video.playbackRate = parseFloat(e.target.value);
  });

  // Import Filter Selector
  const filterSelector = createFilterSelector(video);

  // Buttons
  const muteButton = Button("🔇", "mute", { click: () => video.muted = !video.muted });
  const fullscreenButton = Button("⛶", "fullscreen", { click: () => toggleFullScreen(videoPlayer) });
  const pipButton = Button("PiP", "pip", { click: () => togglePictureInPicture(video) });
  const downloadButton = Button("⬇️", "download", { click: () => downloadVideo(mediaSrc) });
  const dragBox = Button("P", "drag", { click: () => setupVideoUtilityFunctions(video, videoid) });

  buttons.append(filterSelector, speedDropdown, qualitySelector, muteButton, dragBox, downloadButton, pipButton, fullscreenButton);
  controls.append(progressBar, buttons);

  // Enable fullscreen control handling
  setupFullscreenControls(videoPlayer, controls);

  return controls;
}

/** =================== FULLSCREEN & CONTROLS LOGIC =================== **/
function toggleFullScreen(videoPlayer) {
  if (!document.fullscreenElement) {
    videoPlayer.requestFullscreen().catch(err => console.error("Fullscreen failed:", err));
  } else {
    document.exitFullscreen();
  }
}

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

  // Show controls on mouse move, hide after delay
  videoPlayer.addEventListener("mousemove", () => {
    showControls();
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(hideControls, 3000);
  });

  // Prevent hiding if the user is interacting with controls
  controls.addEventListener("mouseenter", () => clearTimeout(controlsTimeout));
  controls.addEventListener("mouseleave", () => {
    controlsTimeout = setTimeout(hideControls, 3000);
  });

  // Detect fullscreen changes
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === videoPlayer) {
      videoPlayer.classList.add("fullscreen");
      showControls(); // Keep controls visible when entering fullscreen
    } else {
      videoPlayer.classList.remove("fullscreen");
    }
  });

  // Initially hide controls after 3s
  setTimeout(hideControls, 3000);
}

export { createControls };

