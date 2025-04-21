export function RenderWebtoonPost(container, mediaArray) {
    mediaArray.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "webtoon-img";
        container.appendChild(img);
    });
}

// .webtoon-img {
//     width: 100%;
//     margin-bottom: 12px;
//     border-radius: 6px;
// }
