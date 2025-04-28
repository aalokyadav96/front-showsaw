import "../../../css/ui/AudioPlayer.css";
import { SRC_URL } from "../../api/api.js";

function MinAudio(audioSrc) {
  const player = document.createElement("div");
  player.id = "audio-player-container";

  // **MAKE MINI-MODE THE DEFAULT**
  player.classList.add("mini-mode");

  // Poster image
  const img = document.createElement("img");
  img.src = audioSrc.poster;
  img.alt = "Audio Thumbnail";
  img.className = "audio-poster";

  // Audio element
  const audio = document.createElement("audio");
  audio.src = `${SRC_URL}/artistpic/${audioSrc.audioUrl}`;
  audio.controls = false;

  // === CONTROLS CONTAINER ===
  const controlsContainer = document.createElement("div");
  controlsContainer.className = "controls-container";

  const playButton = document.createElement("button");
  playButton.textContent = "Play";
  playButton.onclick = function () {
    if (audio.paused) {
      audio.play();
      playButton.textContent = "Pause";
    } else {
      audio.pause();
      playButton.textContent = "Play";
    }
  };

  const seekBar = document.createElement("input");
  seekBar.type = "range";
  seekBar.min = 0;
  seekBar.max = 100;
  seekBar.value = 0;
  seekBar.className = "seek-bar";

  audio.addEventListener("timeupdate", () => {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
  });
  seekBar.addEventListener("input", () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  });

  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.1;
  volumeSlider.value = audio.volume;
  volumeSlider.className = "volume-slider";
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
  });

  const speedSelect = document.createElement("select");
  [0.5, 1, 1.5, 2].forEach((speed) => {
    const option = document.createElement("option");
    option.value = speed;
    option.textContent = `${speed}x`;
    speedSelect.appendChild(option);
  });
  speedSelect.className = "speed-select";
  speedSelect.addEventListener("change", () => {
    audio.playbackRate = speedSelect.value;
  });

  controlsContainer.appendChild(playButton);
  controlsContainer.appendChild(seekBar);
  controlsContainer.appendChild(volumeSlider);
  controlsContainer.appendChild(speedSelect);

  // === APPEND ALL ===
  player.appendChild(img);
  player.appendChild(audio);
  player.appendChild(controlsContainer);

  return player;
}


// function MinAudio(audioSrc) {
//     const player = document.createElement("div");
//     player.id = "audio-player-container";

//     const audio = document.createElement("audio");
//     audio.src = audioSrc.audioUrl;
//     audio.controls = false; 
//     player.appendChild(audio);

//     const playButton = document.createElement("button");
//     playButton.textContent = "Play";
//     playButton.onclick = function () {
//       if (audio.paused) {
//         audio.play();
//         playButton.textContent = "Pause";
//       } else {
//         audio.pause();
//         playButton.textContent = "Play";
//       }
//     };
//     player.appendChild(playButton);

//     // **Lyrics Container**
//     const lyricsContainer = document.createElement("div");
//     lyricsContainer.id = "lyrics-container";
//     player.appendChild(lyricsContainer);

//     audioSrc.lyricsData.forEach(lyric => {
//       const lyricElement = document.createElement("p");
//       lyricElement.textContent = lyric.text;
//       lyricElement.dataset.time = lyric.time;
//       lyricsContainer.appendChild(lyricElement);
//     });

//     // **Lyrics Syncing Logic**
//     function updateLyrics() {
//       const currentTime = audio.currentTime;
//       const lyricsElements = lyricsContainer.querySelectorAll("p");

//       lyricsElements.forEach((lyricElement) => {
//         const time = parseFloat(lyricElement.dataset.time);
//         if (currentTime >= time) {
//           lyricsElements.forEach(el => el.classList.remove("active"));
//           lyricElement.classList.add("active");
//         }
//       });

//       // Scroll to the active lyric
//       const activeLyric = lyricsContainer.querySelector(".active");
//       if (activeLyric) {
//         activeLyric.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//     }

//     audio.addEventListener("timeupdate", updateLyrics);

//     return player;
//   }

export default MinAudio;
