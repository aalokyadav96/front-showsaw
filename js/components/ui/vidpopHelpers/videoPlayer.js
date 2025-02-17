import { createControls } from "./controls.js";
import { setupSubtitles } from "./subtitles.js";
import { parseVTT, parseTime } from "./utils.js";

async function generateVideoPlayer(mediaSrc, poster, qualities, subtitles, videoid) {
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

  // Load stored quality preference or default to the best available
  let storedQuality = localStorage.getItem("videoQuality") || "144p";
  const defaultQuality = qualities.find(q => q.label === storedQuality) || qualities[0];

  console.log("Available Qualities:", qualities);
  console.log("Selected Quality:", storedQuality);

  // Set initial video source
  video.src = defaultQuality.src;
  video.setAttribute("data-quality", defaultQuality.label);

  // Append alternative quality sources
  qualities.forEach(quality => {
    const source = document.createElement("source");
    source.src = quality.src;
    source.type = "video/mp4";
    source.setAttribute("data-quality", quality.label);
    video.appendChild(source);
  });

  video.appendChild(document.createTextNode("Your browser does not support the video tag."));

  // Subtitle Container & Subtitle Handling
  const subtitleContainer = document.createElement("div");
  subtitleContainer.className = "subtitle-container";
  videoPlayer.appendChild(subtitleContainer);

  await setupSubtitles(video, subtitles, subtitleContainer);

  // Video Controls
  const controls = createControls(video, mediaSrc, qualities, videoid, videoPlayer);
  videoPlayer.appendChild(video);
  videoPlayer.appendChild(controls);

  // Video Progress Bar Handling
  const progressBar = controls.querySelector(".progress-bar");
  const progress = controls.querySelector(".progress");

  video.addEventListener("timeupdate", () => {
    if (!isNaN(video.duration)) {
      progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
    }
  });

  // Handle progress bar seeking
  progressBar.addEventListener("mousedown", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    video.currentTime = video.duration * fraction;
  });

  // Toggle Play/Pause on Click
  video.addEventListener("click", () => (video.paused ? video.play() : video.pause()));

  // Handle Quality Change without reloading
  controls.querySelector(".quality-selector").addEventListener("change", (event) => {
    const selectedQualityLabel = event.target.value;
    const selectedQuality = qualities.find(q => q.label === selectedQualityLabel);

    if (!selectedQuality || selectedQuality.src === video.src) return;

    console.log("Switching to quality:", selectedQuality.label);

    // Save preference
    localStorage.setItem("videoQuality", selectedQuality.label);

    // Preserve current time
    const currentTime = video.currentTime;
    const isPaused = video.paused;

    // Switch source dynamically
    video.src = selectedQuality.src;
    video.setAttribute("data-quality", selectedQuality.label);

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = currentTime;
      if (!isPaused) video.play();
    }, { once: true });
  });

  // ==================== FULLSCREEN CONTROLS LOGIC ====================
  // handleFullscr(videoPlayer, controls);

  return videoPlayer;
}


export { generateVideoPlayer };
