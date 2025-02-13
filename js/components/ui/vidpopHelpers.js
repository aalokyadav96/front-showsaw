import Button from "../base/Button.js";
import {setupVideoUtilityFunctions} from "./vidpopUtilities.js";

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
  
    // Create subtitle container and apply draggable functionality
    const subtitleContainer = document.createElement("div");
    subtitleContainer.className = "subtitle-container";
    videoPlayer.appendChild(subtitleContainer);
  
    // makeDraggable(subtitleContainer);
  
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
  

  function downloadVideo(mediaSrc) {
    const anchor = document.createElement("a");
    anchor.href = mediaSrc;
    anchor.download = "video.mp4";
    anchor.click();
  }

  export {generateVideoPlayer};