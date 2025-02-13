import {generateVideoPlayer} from "./vidpopHelpers";

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


function removePopup(popupElement) {
  if (popupElement && popupElement.parentNode) {
    popupElement.parentNode.removeChild(popupElement);
  }
}

export default Vidpop;