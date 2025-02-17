import "../../../css/ui/VideoPlayer.css";
import Vidpop from "./Vidpop.mjs";
import { Button } from "../base/Button";

const VideoPlayer = (
  { src, poster, controls = true, autoplay = false, muted = true, theme = "light" },
  videoId,
  availableResolutions
) => {
  const videocon = document.createElement("div");
  videocon.className = `video-container theme-${theme}`;

  const video = document.createElement("video");
  video.className = "video-player";
  video.controls = controls;
  video.autoplay = autoplay;
  video.muted = muted;
  video.loop = true;
  video.preload = "metadata";
  video.crossOrigin = "anonymous";

  console.log("Available resolutions:", availableResolutions);

  // Extract base URL without quality suffix
  const baseSrc = src.replace(/-\d{3,4}p.mp4/, "");

  // List of all possible resolutions (sorted from highest to lowest)
  const allQualities = ["original", 1440, 1080, 720, 480, 360, 240, 144];

  // Filter qualities based on available resolutions from backend
  const availableQualities = ["original", ...allQualities.filter((q) => availableResolutions.includes(q))];

  console.log("Filtered available qualities:", availableQualities);

  // Load stored quality preference or default to highest available
  let storedQuality = localStorage.getItem("videoQuality") || String(Math.min(...availableResolutions, 480)) + "p";
  if (!availableQualities.includes(parseInt(storedQuality))) {
    storedQuality = String(Math.max(...availableResolutions, 480)) + "p";
  }

  // Set initial video source based on stored preference
  video.src = storedQuality === "original" ? `${baseSrc}.mp4` : `${baseSrc}-${storedQuality}.mp4`;
  // video.poster = poster || src.replace(/-\d{3,4}p.mp4/, ".jpg");
  video.poster = src.replace(/-\d{3,4}p.mp4/, ".jpg");

  // Create the label element
  const qualityLabel = document.createElement("label");
  qualityLabel.htmlFor = "qualitySelector";
  qualityLabel.textContent = "Quality:";

  // Quality Selector Dropdown
  const qualitySelector = document.createElement("select");
  qualitySelector.id = "qualitySelector"; // Added ID to link with the label
  qualitySelector.className = "quality-selector";

  availableQualities.forEach((quality) => {
    const qualityLabel = quality === "original" ? "Original" : `${quality}p`;
    const qualityValue = quality === "original" ? `${baseSrc}.mp4` : `${baseSrc}-${quality}p.mp4`;

    const option = document.createElement("option");
    option.value = qualityValue;
    option.textContent = qualityLabel;
    option.selected = storedQuality === qualityLabel;
    qualitySelector.appendChild(option);
  });

  // // Append the label and select elements to the desired parent element
  // parentElement.appendChild(qualityLabel);
  // parentElement.appendChild(qualitySelector);

  // Change video quality dynamically and store preference
  qualitySelector.addEventListener("change", (event) => {
    const selectedSrc = event.target.value;
    const selectedQuality = selectedSrc.includes("-") ? selectedSrc.split("-").pop().replace(".mp4", "") : "original";

    if (selectedQuality !== storedQuality) {
      localStorage.setItem("videoQuality", selectedQuality);
      video.src = selectedSrc;
      video.play();
    }
  });

  // // Quality Selector Dropdown
  // const qualitySelector = document.createElement("select");
  // qualitySelector.className = "quality-selector";

  // availableQualities.forEach((quality) => {
  //   const qualityLabel = quality === "original" ? "Original" : `${quality}p`;
  //   const qualityValue = quality === "original" ? `${baseSrc}.mp4` : `${baseSrc}-${quality}p.mp4`;

  //   const option = document.createElement("option");
  //   option.value = qualityValue;
  //   option.textContent = qualityLabel;
  //   option.selected = storedQuality === qualityLabel;
  //   qualitySelector.appendChild(option);
  // });

  // // Change video quality dynamically and store preference
  // qualitySelector.addEventListener("change", (event) => {
  //   const selectedSrc = event.target.value;
  //   const selectedQuality = selectedSrc.includes("-") ? selectedSrc.split("-").pop().replace(".mp4", "") : "original";

  //   if (selectedQuality !== storedQuality) {
  //     localStorage.setItem("videoQuality", selectedQuality);
  //     video.src = selectedSrc;
  //     video.play();
  //   }
  // });

  // Toggle play/pause on click
  video.addEventListener("click", function () {
    this.paused ? this.play() : this.pause();
  });

  // **Theater Mode Button**
  const theaterButton = Button("Theater Mode", "theater", {
    click: () =>
      Vidpop(src, "video", videoId, {
        poster,
        theme,
        qualities: availableQualities.map((quality) => ({
          label: quality === "original" ? "Original" : `${quality}p`,
          src: quality === "original" ? `${baseSrc}.mp4` : `${baseSrc}-${quality}p.mp4`,
        })),
      }),
  });

  // Accessibility
  video.setAttribute("aria-label", "Video Player");
  theaterButton.setAttribute("title", "Activate Theater Mode");


  // Append elements
  videocon.appendChild(video);
  videocon.appendChild(qualitySelector);
  videocon.appendChild(theaterButton);

  return videocon;
};

export default VideoPlayer;
