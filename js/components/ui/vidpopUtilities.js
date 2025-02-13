function setupVideoUtilityFunctions(video, progress, playerElement) {
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
    addMouseKeyListeners(video);
}

function addMouseKeyListeners(video) {
    let angle = 0;
    let flip = false;
    const hotkeysEnabled = true;

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
    video.style.width = `100vh`;
    video.style.height = `100vw`;
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

function resetSpeed(video) {
    video.playbackRate = 1;
}

function slower(video) {
    video.playbackRate = Math.max(0.25, video.playbackRate - 0.15);
}

function faster(video) {
    video.playbackRate = Math.min(3.0, video.playbackRate + 0.15);
}

export { setupVideoUtilityFunctions };