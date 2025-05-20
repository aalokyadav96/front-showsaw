import "../../../css/ui/MiniAudio.css";
import { PauseSVG, playSVG } from "../svgs.js";
import { createElement } from "../createElement.js";

function MiniAudio({ poster, audioUrl, title = "" }) {
  const player = createElement("div", { class: "mini-audio horizontal" });

  const playBtn = createElement("button", { class: "play-btn" });
  playBtn.innerHTML = playSVG;

  const audio = new Audio(audioUrl);
  audio.preload = "metadata";

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = PauseSVG;
    } else {
      audio.pause();
      playBtn.innerHTML = playSVG;
    }
  });

  const seekBar = createElement("input", {
    type: "range",
    class: "seek-bar",
    min: 0,
    max: 100,
    value: 0,
  });

  const timeDisplay = createElement("span", { class: "time" }, ["00:00"]);

  audio.addEventListener("loadedmetadata", () => {
    timeDisplay.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100 || 0;
    seekBar.value = progress;
  });

  seekBar.addEventListener("input", () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  });

  const posterImg = createElement("img", {
    src: poster || "",
    alt: "Poster",
    class: "mini-poster",
  });

  const titleText = createElement("span", { class: "audio-title" }, [title]);

  const left = createElement("div", { class: "left" }, [playBtn, posterImg]);
  const center = createElement("div", { class: "center" }, [titleText, seekBar]);
  const right = createElement("div", { class: "right" }, [timeDisplay]);

  player.append(left, center, right);
  return player;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default MiniAudio;
