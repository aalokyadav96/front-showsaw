import "../../../css/ui/VideoPlayer.css";
import Vidpop from "./Vidpop.mjs";
import { Button } from "../base/Button";
import { createVideoElement, togglePlayOnClick, applyVideoAttributes } from "./videoHelpers.js";
import { createQualitySelector } from "./qualitySelector.js";

const VideoPlayer = (
  { src, poster, controls = true, autoplay = false, muted = true, theme = "light" },
  videoId,
  availableResolutions
) => {
  const container = document.createElement("div");
  container.className = `video-container theme-${theme}`;

  const controlsContainer = document.createElement("div");
  controlsContainer.className = "hflex buttcon";

  const video = createVideoElement(src, availableResolutions);
  applyVideoAttributes(video, { controls, autoplay, muted, loop: true });
  togglePlayOnClick(video);

  let availableQualities = [];

  if (availableResolutions) {
    const baseSrc = src.replace(/-\d{3,4}p.mp4/, "");
    const { selector, qualities } = createQualitySelector(video, baseSrc, availableResolutions);
    availableQualities = qualities;
    controlsContainer.appendChild(selector);
  }

  const theaterButton = Button("Theater Mode", "theater", {
    click: () =>
      Vidpop(src, "video", videoId, {
        poster,
        theme,
        qualities: availableQualities.map((q) => ({
          label: q === "original" ? "Original" : `${q}p`,
          // src: q === "original" ? `${src}.mp4` : `${src}-${q}p.mp4`,
          src: q === "original" ? `${src.replace(/-\d{3,4}p.mp4/, "")}.mp4` : `${src.replace(/-\d{3,4}p.mp4/, "")}-${q}p.mp4`,
        })),
      }),
  });

  video.setAttribute("aria-label", "Video Player");
  theaterButton.setAttribute("title", "Activate Theater Mode");

  container.appendChild(video);
  container.appendChild(controlsContainer);
  controlsContainer.appendChild(theaterButton);

  return container;
};

export default VideoPlayer;
