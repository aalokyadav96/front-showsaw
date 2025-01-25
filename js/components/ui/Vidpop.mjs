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
  content.appendChild(generateVideoPlayer(mediaSrc, poster, qualities, subtitles));
  content.appendChild(closeButton);

  document.body.appendChild(sightbox);
  return sightbox;
};

function generateVideoPlayer(mediaSrc, poster, qualities, subtitles) {
  const videoPlayer = document.createElement("div");
  videoPlayer.id = "video-player";

  const video = document.createElement("video");
  video.id = "main-video";
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.poster = poster;
  video.preload = "metadata";

  // Add default video source
  const mp4Source = document.createElement("source");
  mp4Source.src = mediaSrc;
  mp4Source.type = "video/mp4";
  video.appendChild(mp4Source);

  // Add video qualities
  qualities.forEach((quality) => {
    const source = document.createElement("source");
    source.src = quality.src;
    source.type = "video/mp4";
    source.setAttribute("data-quality", quality.label);
    video.appendChild(source);
  });

  video.appendChild(document.createTextNode("Your browser does not support the video tag."));

  // Add subtitles
  subtitles.forEach((subtitle, index) => {
    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = subtitle.label;
    track.srclang = subtitle.srclang;
    track.src = subtitle.src;
    if (index === 0) track.default = true; // Make the first subtitle track default
    video.appendChild(track);
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

  // Playback Speed Dropdown
  const speedDropdown = document.createElement("select");
  speedDropdown.className = "playback-speed";
  [0.5, 1, 1.5, 2].forEach((speed) => {
    const option = document.createElement("option");
    option.value = speed;
    option.textContent = `${speed}x`;
    if (speed === 1) option.selected = true;
    speedDropdown.appendChild(option);
  });
  speedDropdown.addEventListener("change", (e) => {
    video.playbackRate = parseFloat(e.target.value);
  });

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

  // Subtitles Selector
  const subtitleSelector = document.createElement("select");
  subtitleSelector.className = "subtitle-selector";
  const noSubtitleOption = document.createElement("option");
  noSubtitleOption.value = "none";
  noSubtitleOption.textContent = "None";
  subtitleSelector.appendChild(noSubtitleOption);

  subtitles.forEach((subtitle, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = subtitle.label;
    subtitleSelector.appendChild(option);
  });

  subtitleSelector.addEventListener("change", (e) => {
    const selectedTrackIndex = e.target.value;
    Array.from(video.textTracks).forEach((track, index) => {
      track.mode = index === parseInt(selectedTrackIndex) ? "showing" : "disabled";
    });
  });

  // Enable the default subtitle track
  video.addEventListener("loadedmetadata", () => {
    const tracks = video.textTracks;
    if (tracks.length > 0) tracks[0].mode = "showing"; // Show the default track
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

  // Append buttons
  buttons.appendChild(speedDropdown);
  buttons.appendChild(qualitySelector);
  buttons.appendChild(subtitleSelector); // Add the subtitle selector
  buttons.appendChild(muteButton);
  buttons.appendChild(downloadButton);
  buttons.appendChild(pipButton);
  buttons.appendChild(fullscreenButton);

  controls.appendChild(progressBar);
  controls.appendChild(buttons);

  videoPlayer.appendChild(video);
  videoPlayer.appendChild(controls);

  setupVideoUtilityFunctions(video, progress, videoPlayer);

  return videoPlayer;
}


// function generateVideoPlayer(mediaSrc, poster, qualities, subtitles) {
//   const videoPlayer = document.createElement("div");
//   videoPlayer.id = "video-player";

//   const video = document.createElement("video");
//   video.id = "main-video";
//   video.autoplay = true;
//   video.loop = true;
//   video.muted = true;
//   video.poster = poster;
//   video.preload = "metadata";

//   // Add default video source
//   const mp4Source = document.createElement("source");
//   mp4Source.src = mediaSrc;
//   mp4Source.type = "video/mp4";
//   video.appendChild(mp4Source);

//   // Add video qualities
//   qualities.forEach((quality) => {
//     const source = document.createElement("source");
//     source.src = quality.src;
//     source.type = "video/mp4";
//     source.setAttribute("data-quality", quality.label);
//     video.appendChild(source);
//   });

//   video.appendChild(document.createTextNode("Your browser does not support the video tag."));

//   // Add subtitles
//   subtitles.forEach((subtitle) => {
//     const track = document.createElement("track");
//     track.kind = "subtitles";
//     track.label = subtitle.label;
//     track.srclang = subtitle.srclang;
//     track.src = subtitle.src;
//     video.appendChild(track);
//   });

//   const controls = document.createElement("div");
//   controls.className = "controls";

//   const progressBar = document.createElement("div");
//   progressBar.className = "progress-bar";

//   const progress = document.createElement("div");
//   progress.className = "progress";

//   progressBar.appendChild(progress);

//   const buttons = document.createElement("div");
//   buttons.className = "buttons";

//   // Playback Speed Dropdown
//   const speedDropdown = document.createElement("select");
//   speedDropdown.className = "playback-speed";
//   [0.5, 1, 1.5, 2].forEach((speed) => {
//     const option = document.createElement("option");
//     option.value = speed;
//     option.textContent = `${speed}x`;
//     if (speed === 1) option.selected = true;
//     speedDropdown.appendChild(option);
//   });
//   speedDropdown.addEventListener("change", (e) => {
//     video.playbackRate = parseFloat(e.target.value);
//   });

//   // Video Quality Selector
//   const qualitySelector = document.createElement("select");
//   qualitySelector.className = "quality-selector";
//   qualities.forEach((quality) => {
//     const option = document.createElement("option");
//     option.value = quality.src;
//     option.textContent = quality.label;
//     qualitySelector.appendChild(option);
//   });
//   qualitySelector.addEventListener("change", (e) => {
//     const selectedQuality = e.target.value;
//     video.src = selectedQuality;
//     video.play();
//   });

//   const muteButton = Button("🔇", "mute", { click: () => toggleMute(video, muteButton) });
//   // const shareButton = Button("Share", "share", {
//   //   click: () => navigator.clipboard.writeText(window.location.href),
//   // });
//   const fullscreenButton = Button("⛶", "fullscreen", {
//     click: () => toggleFullscreen(video),
//   });
//   const pipButton = Button("PiP", "pip", {
//     click: () => togglePictureInPicture(video),
//   });
//   const downloadButton = Button("⬇️", "download", {
//     click: () => downloadVideo(mediaSrc),
//   });

//   // Append buttons
//   buttons.appendChild(speedDropdown);
//   buttons.appendChild(qualitySelector);
//   buttons.appendChild(muteButton);
//   buttons.appendChild(downloadButton);
//   buttons.appendChild(pipButton);
//   buttons.appendChild(fullscreenButton);
//   // buttons.appendChild(shareButton);

//   controls.appendChild(progressBar);
//   controls.appendChild(buttons);


//   videoPlayer.appendChild(video);
//   videoPlayer.appendChild(controls);

//   setupVideoUtilityFunctions(video, progress, videoPlayer);

//   return videoPlayer;
// }

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
  video.style.height = `100vh`;
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


// // // import Button from "../base/Button.js";

// // // const Vidpop = (mediaSrc, type, video, options = {}) => {
// // //   const { poster = "#", theme = "light" } = options;

// // //   const sightbox = document.createElement("div");
// // //   sightbox.className = `sightbox theme-${theme}`;

// // //   const overlay = document.createElement("div");
// // //   overlay.className = "sightbox-overlay";
// // //   overlay.addEventListener("click", () => removePopup(sightbox));

// // //   const content = document.createElement("div");
// // //   content.className = "sightbox-content";

// // //   const closeButton = document.createElement("button");
// // //   closeButton.className = "sightbox-close";
// // //   closeButton.textContent = "×";
// // //   closeButton.setAttribute("aria-label", "Close Theater Mode");
// // //   closeButton.addEventListener("click", () => removePopup(sightbox));

// // //   sightbox.appendChild(overlay);
// // //   sightbox.appendChild(content);
// // //   content.appendChild(generateVideoPlayer(mediaSrc, poster));
// // //   content.appendChild(closeButton);

// // //   document.body.appendChild(sightbox);
// // //   return sightbox;
// // // };

// // // function generateVideoPlayer(mediaSrc, poster) {
// // //   const videoPlayer = document.createElement("div");
// // //   videoPlayer.id = "video-player";

// // //   const video = document.createElement("video");
// // //   video.id = "main-video";
// // //   video.autoplay = true;
// // //   video.loop = true;
// // //   video.muted = true;
// // //   video.poster = poster;
// // //   video.preload = "metadata";

// // //   const mp4Source = document.createElement("source");
// // //   mp4Source.src = mediaSrc + "#t=0.01";
// // //   mp4Source.type = "video/mp4";

// // //   video.appendChild(mp4Source);
// // //   video.appendChild(document.createTextNode("Your browser does not support the video tag."));

// // //   const controls = document.createElement("div");
// // //   controls.className = "controls";

// // //   const progressBar = document.createElement("div");
// // //   progressBar.className = "progress-bar";

// // //   const progress = document.createElement("div");
// // //   progress.className = "progress";

// // //   progressBar.appendChild(progress);

// // //   const buttons = document.createElement("div");
// // //   buttons.className = "buttons";

// // //   const slowerButton = Button("➖", "slower", { click: () => slower(video) });
// // //   const resetSpeedButton = Button("⚌", "reset-speed", { click: () => resetSpeed(video) });
// // //   const fasterButton = Button("➕", "faster", { click: () => faster(video) });
// // //   const muteButton = Button("🔇", "mute", { click: () => toggleMute(video, muteButton) });
// // //   const shareButton = Button("Share", "share", {
// // //     click: () => navigator.clipboard.writeText(window.location.href),
// // //   });
// // //   const fullscreenButton = Button("⛶", "fullscreen", {
// // //     click: () => toggleFullscreen(video),
// // //   });
// // //   const pipButton = Button("PiP", "pip", {
// // //     click: () => togglePictureInPicture(video),
// // //   });
// // //   const downloadButton = Button("⬇️", "download", {
// // //     click: () => downloadVideo(mediaSrc),
// // //   });

// // //   buttons.appendChild(slowerButton);
// // //   buttons.appendChild(resetSpeedButton);
// // //   buttons.appendChild(fasterButton);
// // //   buttons.appendChild(muteButton);
// // //   buttons.appendChild(shareButton);
// // //   buttons.appendChild(fullscreenButton);
// // //   buttons.appendChild(pipButton);
// // //   buttons.appendChild(downloadButton);

// // //   controls.appendChild(progressBar);
// // //   controls.appendChild(buttons);

// // //   videoPlayer.appendChild(video);
// // //   videoPlayer.appendChild(controls);

// // //   setupVideoUtilityFunctions(video, progress, videoPlayer);

// // //   return videoPlayer;
// // // }

// // // function setupVideoUtilityFunctions(video, progress, playerElement) {
// // //   let angle = 0;
// // //   let flip = false;
// // //   const hotkeysEnabled = true;

// // //   video.addEventListener("click", function () {
// // //     this.paused ? this.play() : this.pause();
// // //   });

// // //   video.addEventListener("timeupdate", () => {
// // //     const total = (video.currentTime / video.duration) * 100;
// // //     progress.style.width = `${total}%`;
// // //   });

// // //   playerElement.querySelector(".progress-bar").addEventListener("mousedown", (e) => {
// // //     const rect = e.currentTarget.getBoundingClientRect();
// // //     const fraction = (e.clientX - rect.left) / e.currentTarget.clientWidth;
// // //     video.currentTime = video.duration * fraction;
// // //   });

// // //   window.addEventListener(
// // //     "keydown",
// // //     debounce((e) => {
// // //       if (!hotkeysEnabled) return;

// // //       switch (e.key) {
// // //         case ",":
// // //           video.currentTime -= 1 / 12;
// // //           break;
// // //         case ".":
// // //           video.currentTime += 1 / 12;
// // //           break;
// // //         case "c":
// // //           faster(video);
// // //           break;
// // //         case "x":
// // //           resetSpeed(video);
// // //           break;
// // //         case "z":
// // //           slower(video);
// // //           break;
// // //         case "b":
// // //           setVolume(video, -0.1);
// // //           break;
// // //         case "n":
// // //           setVolume(video, 0.1);
// // //           break;
// // //         case "m":
// // //           toggleMute(video);
// // //           break;
// // //         case "r":
// // //           rotateVideo(video, angle);
// // //           angle = (angle + 90) % 360;
// // //           break;
// // //         case "h":
// // //           flipVideo(video, flip);
// // //           flip = !flip;
// // //           break;
// // //         case "v":
// // //           video.paused ? video.play() : video.pause();
// // //           break;
// // //       }
// // //     }, 100)
// // //   );
// // // }

// // // function debounce(func, wait) {
// // //   let timeout;
// // //   return function (...args) {
// // //     clearTimeout(timeout);
// // //     timeout = setTimeout(() => func.apply(this, args), wait);
// // //   };
// // // }

// // // function setVolume(video, value) {
// // //   video.volume = Math.min(1, Math.max(0, video.volume + value));
// // // }

// // // function rotateVideo(video, angle) {
// // //   video.style.transform = `rotate(${angle}deg)`;
// // // }

// // // function flipVideo(video, flip) {
// // //   video.style.transform = flip ? "scaleX(-1)" : "scaleX(1)";
// // // }

// // // function toggleMute(video, button = null) {
// // //   video.muted = !video.muted;
// // //   if (button) {
// // //     button.textContent = video.muted ? "🔇" : "🔊";
// // //   }
// // // }

// // // function toggleFullscreen(video) {
// // //   if (!document.fullscreenElement) {
// // //     video.requestFullscreen().catch((err) => {
// // //       console.error("Error attempting to enable fullscreen mode:", err);
// // //     });
// // //   } else {
// // //     document.exitFullscreen();
// // //   }
// // // }

// // // function togglePictureInPicture(video) {
// // //   if (document.pictureInPictureElement) {
// // //     document.exitPictureInPicture().catch((err) => {
// // //       console.error("Error exiting Picture-in-Picture mode:", err);
// // //     });
// // //   } else {
// // //     video.requestPictureInPicture().catch((err) => {
// // //       console.error("Error entering Picture-in-Picture mode:", err);
// // //     });
// // //   }
// // // }

// // // function resetSpeed(video) {
// // //   video.playbackRate = 1;
// // // }

// // // function slower(video) {
// // //   video.playbackRate = Math.max(0.25, video.playbackRate - 0.15);
// // // }

// // // function faster(video) {
// // //   video.playbackRate = Math.min(3.0, video.playbackRate + 0.15);
// // // }

// // // function downloadVideo(mediaSrc) {
// // //   const anchor = document.createElement("a");
// // //   anchor.href = mediaSrc;
// // //   anchor.download = "video.mp4";
// // //   anchor.click();
// // // }

// // // function removePopup(popupElement) {
// // //   if (popupElement && popupElement.parentNode) {
// // //     popupElement.parentNode.removeChild(popupElement);
// // //   }
// // // }

// // // export default Vidpop;

