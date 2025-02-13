import { SRC_URL } from "../../state/state.js";
import VideoPlayer from '../../components/ui/VideoPlayer.mjs';

async function RenderVideoPost(mediaContainer,media) {
    media.forEach(videoSrc => {
        const videox = VideoPlayer({
            src: `${SRC_URL}${videoSrc}`,
            className: 'post-video',
            muted: true,
            poster: `${SRC_URL}${videoSrc.replaceAll("-720p.mp4", ".jpg")}`,
            controls: false,
        });
        mediaContainer.appendChild(videox);
    });
}

export {RenderVideoPost};