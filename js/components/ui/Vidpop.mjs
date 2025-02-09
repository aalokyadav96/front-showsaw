import Button from "../base/Button.js";

const Vidpop = (mediaSrc, type, video, options = {}) => {

  const { poster = "#", theme = "light", qualities = [], subtitles = [] } = options;

  const sightbox = document.createElement("div");
  sightbox.className = `sightbox theme-${theme}`;

  const overlay = document.createElement("div");
  overlay.className = "sightbox-overlay";
  overlay.addEventListener("click", () => removePopup(sightbox));

  const content = document.createElement("div");
  content.className = "sightbox-content";

  const closeButton = document.createElement("button");
  closeButton.className = "sightbox-close";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "Close Theater Mode");
  closeButton.addEventListener("click", () => removePopup(sightbox));

  sightbox.appendChild(overlay);
  sightbox.appendChild(content);

  // Directly append the generated video player
  generateVideoPlayer(mediaSrc, poster, qualities, subtitles).then(videoPlayer => {
    content.appendChild(videoPlayer);
    content.appendChild(closeButton);
  });

  document.getElementById('app').appendChild(sightbox);
  return sightbox;
};


async function generateVideoPlayer(mediaSrc, poster, qualities, subtitles) {
  const videoPlayer = document.createElement("div");
  videoPlayer.id = "video-player";

  const video = document.createElement("video");
  video.id = "main-video";
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.poster = poster;
  video.preload = "metadata";
  video.crossOrigin = "anonymous";

  const mp4Source = document.createElement("source");
  mp4Source.src = mediaSrc;
  mp4Source.type = "video/mp4";
  video.appendChild(mp4Source);

  qualities.forEach((quality) => {
    const source = document.createElement("source");
    source.src = quality.src;
    source.type = "video/mp4";
    source.setAttribute("data-quality", quality.label);
    video.appendChild(source);
  });

  video.appendChild(
    document.createTextNode("Your browser does not support the video tag.")
  );


  function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener("mousedown", (event) => {
      isDragging = true;
      offsetX = event.clientX - element.getBoundingClientRect().left;
      offsetY = event.clientY - element.getBoundingClientRect().top;
      element.style.cursor = "grabbing"; // Change cursor while dragging
    });

    document.addEventListener("mousemove", (event) => {
      if (!isDragging) return;

      let x = event.clientX - offsetX;
      let y = event.clientY - offsetY;

      // Optional: Prevent dragging outside the viewport
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      element.style.cursor = "grab"; // Reset cursor after dragging
    });

    // Ensure the element is positioned absolutely for free movement
    element.style.position = "absolute";
    element.style.cursor = "grab";
  }

  // Create subtitle container and apply draggable functionality
  const subtitleContainer = document.createElement("div");
  subtitleContainer.className = "subtitle-container";
  videoPlayer.appendChild(subtitleContainer);

  makeDraggable(subtitleContainer);

  // const subtitleContainer = document.createElement("div");
  // subtitleContainer.className = "subtitle-container";
  // videoPlayer.appendChild(subtitleContainer);

  const subtitleTracks = subtitles.map((subtitle) => ({
    label: subtitle.label,
    srclang: subtitle.srclang,
    src: subtitle.src,
    data: null,
  }));

  const loadAllSubtitles = async (subtitleTracks) => {
    const promises = subtitleTracks.map(async (subtitle) => {
      const response = await fetch(subtitle.src);
      const text = await response.text();
      subtitle.data = parseVTT(text);
    });

    await Promise.all(promises);
  };

  await loadAllSubtitles(subtitleTracks);

  let currentSubtitleTrackIndex = -1;

  video.addEventListener("timeupdate", () => {
    if (currentSubtitleTrackIndex === -1) {
      subtitleContainer.textContent = "";
      subtitleContainer.style.display = "none";
      return;
    }

    const currentTime = video.currentTime;
    const track = subtitleTracks[currentSubtitleTrackIndex];
    const subtitles = track.data;
    subtitleContainer.style.display = "block";
    if (subtitles) {
      const activeSubtitle = subtitles.find(
        (s) => currentTime >= s.start && currentTime <= s.end
      );
      subtitleContainer.textContent = activeSubtitle ? activeSubtitle.text : "";
    }
  });

  const subtitleSelector = document.createElement("select");
  subtitleSelector.className = "subtitle-selector";

  const noSubtitleOption = document.createElement("option");
  noSubtitleOption.value = "-1";
  noSubtitleOption.textContent = "None";
  subtitleSelector.appendChild(noSubtitleOption);

  subtitleTracks.forEach((subtitle, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = subtitle.label;
    subtitleSelector.appendChild(option);
  });

  subtitleSelector.addEventListener("change", (e) => {
    currentSubtitleTrackIndex = parseInt(e.target.value, 10);
    subtitleContainer.textContent = ""; // Clear subtitles when changing tracks
  });

  subtitleSelector.value = "-1";

  // Video Quality Selector
  const qualitySelector = document.createElement("select");
  qualitySelector.className = "quality-selector";
  qualities.forEach((quality) => {
    const option = document.createElement("option");
    option.value = quality.src;
    option.textContent = quality.label;
    qualitySelector.appendChild(option);
  });
  qualitySelector.addEventListener("change", (e) => {
    const selectedQuality = e.target.value;
    video.src = selectedQuality;
    video.play();
  });

  const controls = document.createElement("div");
  controls.className = "controls";

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  const progress = document.createElement("div");
  progress.className = "progress";
  progressBar.appendChild(progress);

  const buttons = document.createElement("div");
  buttons.className = "buttons";

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

  const muteButton = Button("🔇", "mute", { click: () => toggleMute(video, muteButton) });
  const fullscreenButton = Button("⛶", "fullscreen", {
    click: () => toggleFullscreen(video),
  });
  const pipButton = Button("PiP", "pip", {
    click: () => togglePictureInPicture(video),
  });
  const downloadButton = Button("⬇️", "download", {
    click: () => downloadVideo(mediaSrc),
  });

  buttons.appendChild(speedDropdown);
  buttons.appendChild(qualitySelector);
  buttons.appendChild(subtitleSelector);
  buttons.appendChild(muteButton);
  buttons.appendChild(downloadButton);
  buttons.appendChild(pipButton);
  buttons.appendChild(fullscreenButton);

  controls.appendChild(progressBar);
  controls.appendChild(buttons);

  videoPlayer.appendChild(video);
  videoPlayer.appendChild(controls);

  setupVideoUtilityFunctions(video, progress, videoPlayer);


  videoPlayer.addEventListener("mouseenter", () => {
    controls.style.opacity = "1";
    controls.style.transform = "translateY(0)";
  });

  videoPlayer.addEventListener("mouseleave", () => {
    controls.style.opacity = "0";
    controls.style.transform = "translateY(100%)";
  });

  return videoPlayer;
}

// Parse VTT
function parseVTT(vttText) {
  const lines = vttText.split("\n").map((line) => line.trim());
  const subtitles = [];
  let currentSubtitle = null;

  lines.forEach((line) => {
    if (line.includes("-->")) {
      const [start, end] = line.split(" --> ").map(parseTime);
      currentSubtitle = { start, end, text: "" };
    } else if (currentSubtitle && line) {
      currentSubtitle.text += line + " ";
    }

    if (currentSubtitle && !line) {
      subtitles.push({ ...currentSubtitle, text: currentSubtitle.text.trim() });
      currentSubtitle = null;
    }
  });

  if (currentSubtitle) {
    subtitles.push({ ...currentSubtitle, text: currentSubtitle.text.trim() });
  }

  return subtitles;
}

function parseTime(timestamp) {
  const [hours, minutes, seconds] = timestamp.split(":");
  return parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds);
}


function setupVideoUtilityFunctions(video, progress, playerElement) {
  let angle = 0;
  let flip = false;
  const hotkeysEnabled = true;

  video.addEventListener("click", function () {
    this.paused ? this.play() : this.pause();
  });

  video.addEventListener("timeupdate", () => {
    const total = (video.currentTime / video.duration) * 100;
    progress.style.width = `${total}%`;
  });

  playerElement.querySelector(".progress-bar").addEventListener("mousedown", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / e.currentTarget.clientWidth;
    video.currentTime = video.duration * fraction;
  });

  window.addEventListener(
    "keydown",
    debounce((e) => {
      if (!hotkeysEnabled) return;

      switch (e.key) {
        case ",":
          video.currentTime -= 1 / 12;
          break;
        case ".":
          video.currentTime += 1 / 12;
          break;
        case "c":
          faster(video);
          break;
        case "x":
          resetSpeed(video);
          break;
        case "z":
          slower(video);
          break;
        case "b":
          setVolume(video, -0.1);
          break;
        case "n":
          setVolume(video, 0.1);
          break;
        case "m":
          toggleMute(video);
          break;
        case "r":
          rotateVideo(video, angle);
          angle = (angle + 90) % 360;
          break;
        case "h":
          flipVideo(video, flip);
          flip = !flip;
          break;
        case "v":
          video.paused ? video.play() : video.pause();
          break;
      }
    }, 100)
  );
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function setVolume(video, value) {
  video.volume = Math.min(1, Math.max(0, video.volume + value));
}

function rotateVideo(video, angle) {
  video.style.transform = `rotate(${angle}deg)`;
  video.style.width = `100vh`;
  video.style.height = `100vw`;
}

function flipVideo(video, flip) {
  video.style.transform = flip ? "scaleX(-1)" : "scaleX(1)";
}

function toggleMute(video, button = null) {
  video.muted = !video.muted;
  if (button) {
    button.textContent = video.muted ? "🔇" : "🔊";
  }
}

function toggleFullscreen(video) {
  if (!document.fullscreenElement) {
    video.requestFullscreen().catch((err) => {
      console.error("Error attempting to enable fullscreen mode:", err);
    });
  } else {
    document.exitFullscreen();
  }
}

function togglePictureInPicture(video) {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture().catch((err) => {
      console.error("Error exiting Picture-in-Picture mode:", err);
    });
  } else {
    video.requestPictureInPicture().catch((err) => {
      console.error("Error entering Picture-in-Picture mode:", err);
    });
  }
}

function resetSpeed(video) {
  video.playbackRate = 1;
}

function slower(video) {
  video.playbackRate = Math.max(0.25, video.playbackRate - 0.15);
}

function faster(video) {
  video.playbackRate = Math.min(3.0, video.playbackRate + 0.15);
}

function downloadVideo(mediaSrc) {
  const anchor = document.createElement("a");
  anchor.href = mediaSrc;
  anchor.download = "video.mp4";
  anchor.click();
}

function removePopup(popupElement) {
  if (popupElement && popupElement.parentNode) {
    popupElement.parentNode.removeChild(popupElement);
  }
}

export default Vidpop;