import Vidpop from "./Vidpop.mjs";
import { Button } from "../base/Button";

const VideoPlayer = ({
  src,
  poster,
  controls = true,
  autoplay = false,
  muted = true,
  theme = "light",
}) => {
  const videocon = document.createElement("div");
  videocon.className = `video-container theme-${theme}`;

  const video = document.createElement("video");
  video.src = src;
  video.poster = src.replace(/-\d{3,4}p.mp4/, ".jpg");
  video.controls = controls;
  video.autoplay = autoplay;
  video.className = "video-player";
  video.muted = muted;
  video.loop = true;
  video.preload = "metadata";
  video.crossOrigin = "anonymous";

  // Extract base URL without quality suffix
  const baseSrc = src.replace(/-\d{3,4}p.mp4/, "");
  const qualities = ["720p", "480p", "144p"];

  // Quality Selector Dropdown
  const qualitySelector = document.createElement("select");
  qualitySelector.className = "quality-selector";

  qualities.forEach((quality) => {
    const option = document.createElement("option");
    option.value = `${baseSrc}-${quality}.mp4`;
    option.textContent = quality;
    if (src.includes(quality)) option.selected = true;
    qualitySelector.appendChild(option);
  });

  // Change video quality dynamically
  qualitySelector.addEventListener("change", (event) => {
    video.src = event.target.value;
    video.play();
  });

  // Subtitles
  const subtitles = [
    { label: "English", srclang: "en", src: `${baseSrc}-english.vtt`, default: true },
  ];

  subtitles.forEach(({ label, srclang, src, default: isDefault }) => {
    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = label;
    track.srclang = srclang;
    track.src = src;
    if (isDefault) track.default = true;
    video.appendChild(track);
  });

  // Toggle play/pause on click
  video.addEventListener("click", function () {
    this.paused ? this.play() : this.pause();
  });

  // Theater Mode Button
  const theaterButton = Button("Theater Mode", "theater", {
    click: () =>
      Vidpop(src, "video", true, {
        poster,
        theme,
        qualities: qualities.map((quality) => ({
          label: quality,
          src: `${baseSrc}-${quality}.mp4`,
        })),
        subtitles: subtitles.map(({ label, srclang, src }) => ({ label, srclang, src })),
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

// import Vidpop from "./Vidpop.mjs";
// import { Button } from "../base/Button";

// const VideoPlayer = ({ src, poster, controls = true, autoplay = false, muted = true, theme = "light" }) => {
//   const videocon = document.createElement("div");
//   videocon.className = `video-container theme-${theme}`;

//   const video = document.createElement("video");
//   video.src = src;
//   video.poster = poster;
//   video.controls = controls;
//   video.autoplay = autoplay;
//   video.className = "video-player";
//   video.muted = muted;
//   video.loop = true;
//   video.preload = "metadata";
//   video.crossOrigin = "anonymous";

//   // Utility function to replace the file extension with a suffix
//   const replaceExtension = (url, suffix) => {
//     const dotIndex = url.lastIndexOf("-");
//     return dotIndex === -1 ? url : `${url.substring(0, dotIndex)}-${suffix}${url.substring(dotIndex)}`;
//   };

//   // Utility function to replace the file extension for subtitle-specific URLs
//   const replaceExtensionWithSubtitle = (url, subtitle) => {
//     const dotIndex = url.lastIndexOf("-");
//     if (dotIndex === -1) return url; // No extension found
//     return `${url.substring(0, dotIndex)}-${subtitle}`;
//   };

//   // Add subtitles as track elements
//   const subtitles = [
//     { label: "English", srclang: "en", src: replaceExtensionWithSubtitle(src, "english.vtt"), default: true },
//     // { label: "French", srclang: "fr", src: replaceExtensionWithSubtitle(src, "french.vtt") },
//   ];

//   subtitles.forEach(({ label, srclang, src, default: isDefault }) => {
//     const track = document.createElement("track");
//     track.kind = "subtitles";
//     track.label = label;
//     track.srclang = srclang;
//     track.src = src;
//     if (isDefault) track.default = true;
//     video.appendChild(track);

//     // Add error listener to track element
//     track.addEventListener("error", () => {
//       console.error(`Error loading subtitle: ${label} (${src})`);
//     });
//   });

//   // Add error handling for the video element
//   video.addEventListener("error", () => {
//     console.error(`Error loading video: ${src}`);
//   });

//   // Add click event listener to toggle play/pause
//   video.addEventListener("click", function () {
//     this.paused ? this.play() : this.pause();
//   });

//   // Add Theater Mode Button
//   const theaterButton = Button("Theater Mode", "theater", {
//     click: () =>
//       Vidpop(src, "video", true, {
//         poster,
//         theme,
//         qualities: [
//           // { label: "1080p", src: replaceExtension(src, "1080p") },
//           { label: "720p", src: replaceExtension(src, "720p") },
//           { label: "480p", src: replaceExtension(src, "480p") },
//           { label: "144p", src: replaceExtension(src, "144p") },
//         ],
//         subtitles: subtitles.map(({ label, srclang, src }) => ({ label, srclang, src })),
//       }),
//   });

//   // Accessibility: Add labels
//   video.setAttribute("aria-label", "Video Player");
//   theaterButton.setAttribute("title", "Activate Theater Mode");

//   // Append elements to container
//   videocon.appendChild(video);
//   videocon.appendChild(theaterButton);

//   return videocon;
// };

// export default VideoPlayer;

