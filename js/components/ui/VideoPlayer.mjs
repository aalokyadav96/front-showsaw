import Vidpop from "./Vidpop.mjs";
import { Button } from "../base/Button";

const VideoPlayer = ({ src, poster, controls = true, autoplay = false, muted = true, theme = "light" }) => {
  const videocon = document.createElement("div");
  videocon.className = `video-container theme-${theme}`;

  const video = document.createElement("video");
  video.src = src;
  video.poster = poster;
  video.controls = controls;
  video.autoplay = autoplay;
  video.className = "video-player";
  video.muted = muted;
  video.loop = true;
  video.preload = "metadata";

  // Utility function to replace the file extension for subtitle-specific URLs
  const replaceExtensionWithSubtitle = (url, subtitle) => {
    const dotIndex = url.lastIndexOf(".");
    if (dotIndex === -1) return url; // No extension found
    return `${url.substring(0, dotIndex)}-${subtitle}`;
  };

  // Add subtitles as track elements
  const subtitles = [
    { label: "English", srclang: "en", src: replaceExtensionWithSubtitle(src, "english.vtt"), default: true },
    { label: "French", srclang: "fr", src: replaceExtensionWithSubtitle(src, "french.vtt") },
  ];

  subtitles.forEach(({ label, srclang, src, default: isDefault }) => {
    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = label;
    track.srclang = srclang;
    track.src = src;
    if (isDefault) track.default = true;
    video.appendChild(track);

    // Add error listener to track element
    track.addEventListener("error", () => {
      console.error(`Error loading subtitle: ${label} (${src})`);
    });
  });

  // Add click event listener to play/pause video
  video.addEventListener("click", function () {
    this.paused ? this.play() : this.pause();
  });

  // Utility function to replace the file extension for quality-specific URLs
  const replaceExtensionWithQuality = (url, quality) => {
    const dotIndex = url.lastIndexOf(".");
    if (dotIndex === -1) return url; // No extension found
    return `${url.substring(0, dotIndex)}-${quality}${url.substring(dotIndex)}`;
  };

  // Add Theater Mode Button
  const theaterButton = Button("Theater Mode", "theater", {
    click: () =>
      Vidpop(src, "video", true, {
        poster,
        theme,
        qualities: [
          { label: "1080p", src: replaceExtensionWithQuality(src, "1080p") },
          { label: "720p", src: replaceExtensionWithQuality(src, "720p") },
          { label: "480p", src: replaceExtensionWithQuality(src, "480p") },
          { label: "144p", src: replaceExtensionWithQuality(src, "144p") },
        ],
        subtitles: subtitles.map(({ label, srclang, src }) => ({ label, srclang, src })),
      }),
  });

  videocon.appendChild(video);
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

//   // Add click event listener to play/pause video
//   video.addEventListener("click", function () {
//     this.paused ? this.play() : this.pause();
//   });

//   // Utility function to replace the file extension for quality-specific URLs
//   const replaceExtensionWithQuality = (url, quality) => {
//     const dotIndex = url.lastIndexOf(".");
//     if (dotIndex === -1) return url; // No extension found
//     return `${url.substring(0, dotIndex)}-${quality}${url.substring(dotIndex)}`;
//   };

//   // Utility function to replace the file extension for quality-specific URLs
//   const replaceExtensionWithSubtitle = (url, subtitle) => {
//     const dotIndex = url.lastIndexOf(".");
//     if (dotIndex === -1) return url; // No extension found
//     return `${url.substring(0, dotIndex)}-${subtitle}`;
//   };

//   // Add Theater Mode Button
//   const theaterButton = Button("Theater Mode", "theater", {
//     click: () =>
//       Vidpop(src, "video", true, {
//         poster,
//         theme,
//         qualities: [
//           { label: "720p", src: replaceExtensionWithQuality(src, "720p") },
//           { label: "480p", src: replaceExtensionWithQuality(src, "480p") },
//           { label: "144p", src: replaceExtensionWithQuality(src, "144p") },
//         ],
//         subtitles: [
//           { label: "English", srclang: "en", src: replaceExtensionWithSubtitle(src, "english.vtt") },
//           { label: "French", srclang: "fr", src: replaceExtensionWithSubtitle(src, "french.vtt") },
//         ],
//       }),
//   });

//   videocon.appendChild(video);
//   videocon.appendChild(theaterButton);
//   return videocon;
// };

// export default VideoPlayer;


// // import Vidpop from "./Vidpop.mjs";
// // import { Button } from "../base/Button";

// // const VideoPlayer = ({ src, poster, controls = true, autoplay = false, muted = true, theme = "light" }) => {
// //   const videocon = document.createElement("div");
// //   videocon.className = `video-container theme-${theme}`;

// //   const video = document.createElement("video");
// //   video.src = src;
// //   video.poster = poster;
// //   video.controls = controls;
// //   video.autoplay = autoplay;
// //   video.className = "video-player";
// //   video.muted = muted;
// //   video.loop = true;
// //   video.preload = "metadata";

// //   // Add click event listener to play/pause video
// //   video.addEventListener("click", function () {
// //     this.paused ? this.play() : this.pause();
// //   });

// //   // Add Theater Mode Button
// //   const theaterButton = Button("Theater Mode", "theater", {
// //     click: () =>
// //       Vidpop(src, "video", true, {
// //         poster,
// //         theme,
// //         qualities: [
//           // { label: "720p", src: src.replace(".mp4", "-720p.mp4") },
//           // { label: "480p", src: src.replace(".mp4", "-480p.mp4") },
//           // { label: "144p", src: src.replace(".mp4", "-144p.mp4") },
// //         ],
// //         subtitles: [
// //           { label: "English", srclang: "en", src: src.replace(".mp4", "-english.vtt") },
// //           { label: "French", srclang: "fr", src: src.replace(".mp4", "-french.vtt") },
// //         ],
// //       }),
// //   });

// //   videocon.appendChild(video);
// //   videocon.appendChild(theaterButton);
// //   return videocon;
// // };

// // export default VideoPlayer;



// // // import { Button } from "../base/Button";
// // // import Vidpop from "./Vidpop.mjs";

// // // const VideoPlayer = ({ src, poster, controls = true, autoplay = false, muted = true, theme = 'light' }) => {
// // //     const videocon = document.createElement('div');
// // //     videocon.className = `video-container theme-${theme}`;

// // //     const video = document.createElement('video');
// // //     video.src = src;
// // //     video.poster = poster;
// // //     video.controls = controls;
// // //     video.autoplay = autoplay;
// // //     video.className = 'video-player';
// // //     video.muted = muted;
// // //     video.loop = true;
// // //     video.preload = 'metadata';

// // //     // Add click event listener to play/pause video
// // //     video.addEventListener('click', function () {
// // //         this.paused ? this.play() : this.pause();
// // //     });

// // //     // Add Theater Mode Button
// // //     const theaterButton = Button('Theater Mode', 'theater', {
// // //         click: () => Vidpop(src, 'video', true, {
// // //             poster,
// // //             theme,
// // //             qualityLevels: [
// // //                 { label: "720p", url: src.replace(".mp4", "-720p.mp4") },
// // //                 { label: "480p", url: src.replace(".mp4", "-480p.mp4") },
// // //             ],
// // //             subtitles: [
// // //                 { label: "English", url: src.replace(".mp4", "-english.vtt"), lang: "en" },
// // //                 { label: "French", url: src.replace(".mp4", "-french.vtt"), lang: "fr" },
// // //             ],
// // //         }),
// // //     });

// // //     videocon.appendChild(video);
// // //     videocon.appendChild(theaterButton);
// // //     return videocon;
// // // };

// // // export default VideoPlayer;

// // // // import { Button } from "../base/Button";
// // // // import VidPop from "./Vidpop.mjs";

// // // // const VideoPlayer = ({ src, poster, controls = true, autoplay = false, muted = true, theme = 'light' }) => {
// // // //   const videocon = document.createElement('div');
// // // //   videocon.className = `video-container theme-${theme}`;

// // // //   const video = document.createElement('video');
// // // //   video.src = src;
// // // //   video.poster = poster;
// // // //   video.controls = controls;
// // // //   video.autoplay = autoplay;
// // // //   video.className = 'video-player';
// // // //   video.muted = muted;
// // // //   video.loop = true;
// // // //   video.preload = 'metadata';

// // // //   // Add click event listener to play/pause video
// // // //   video.addEventListener('click', function () {
// // // //     this.paused ? this.play() : this.pause();
// // // //   });

// // // //   const theaterButton = Button('Theater Mode', 'theater', {
// // // //     click: () => handleTheaterMode(src, video, poster, theme),
// // // //   });

// // // //   videocon.appendChild(video);
// // // //   videocon.appendChild(theaterButton);
// // // //   return videocon;
// // // // };

// // // // function handleTheaterMode(src, video, poster, theme) {
// // // //   if (!video.paused) {
// // // //     video.pause(); // Ensure the video pauses
// // // //   }
// // // //   VidPop(src, 'video', video, { poster, theme });
// // // // }

// // // // export default VideoPlayer;


// // // // // import { Button } from "../base/Button";
// // // // // import VidPop from "./Vidpop.mjs";

// // // // // const VideoPlayer = ({ src, poster, controls = true, autoplay = false, muted = true }) => {
// // // // //   const videocon = document.createElement('div');
// // // // //   videocon.className = 'video-container';

// // // // //   const video = document.createElement('video');
// // // // //   video.src = src;
// // // // //   video.poster = poster;
// // // // //   video.controls = controls;
// // // // //   video.autoplay = autoplay;
// // // // //   video.className = 'video-player';
// // // // //   video.muted = muted;
// // // // //   video.loop = true;
// // // // //   video.preload = 'metadata';

// // // // //   // Add click event listener to play/pause video
// // // // //   video.addEventListener('click', function () {
// // // // //     this.paused ? this.play() : this.pause();
// // // // //   });

// // // // //   const theaterButton = Button('Theater Mode', 'theater', {
// // // // //     click: () => handleTheaterMode(src, video),
// // // // //   });

// // // // //   videocon.appendChild(video);
// // // // //   videocon.appendChild(theaterButton);
// // // // //   return videocon;
// // // // // };

// // // // // function handleTheaterMode(src, video) {
// // // // //   if (!video.paused) {
// // // // //     video.pause(); // Ensure the video pauses
// // // // //   }
// // // // //   VidPop(src, 'video', video);
// // // // // }

// // // // // export default VideoPlayer;

// // // // // // import { Button } from "../base/Button";
// // // // // // import VidPop from "./Vidpop.mjs";

// // // // // // const VideoPlayer = ({ src, poster, controls = true, autoplay = false, muted = true }) => {
// // // // // //   const videocon = document.createElement('div');
// // // // // //   videocon.className = 'video-container';

// // // // // //   const video = document.createElement('video');
// // // // // //   video.src = src;
// // // // // //   video.poster = poster;
// // // // // //   video.controls = controls;
// // // // // //   video.autoplay = autoplay;
// // // // // //   video.className = 'video-player';
// // // // // //   video.muted = muted;
// // // // // //   video.loop = true;
// // // // // //   video.preload = 'metadata';

// // // // // //   // Add click event listener
// // // // // //   video.addEventListener('click', function () {
// // // // // //     this.paused ? this.play() : this.pause();
// // // // // //   });

// // // // // //   const buttn = Button('Theater Mode', 'theater', {
// // // // // //     click: () => gdryfjrn(src, 'video', video),
// // // // // //   });

// // // // // //   videocon.appendChild(video);
// // // // // //   videocon.appendChild(buttn);
// // // // // //   return videocon;
// // // // // // };

// // // // // // function gdryfjrn(src, v, video) {
// // // // // //   video.pause;
// // // // // //   VidPop(src, v);
// // // // // // }

// // // // // // export default VideoPlayer;
