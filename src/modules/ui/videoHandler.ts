export function addVideoStream(
    videoGrid: HTMLElement,
    video: HTMLVideoElement,
    stream: MediaStream,
    label: string,
    id: string
): void {
    video.srcObject = stream;
    video.id = id;
    video.setAttribute('playsinline', '');
    if (id !== 'self') {
        video.muted = false;
    }

    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');
    videoContainer.id = `${id}-container`;

    const placeholder = document.createElement('div');
    placeholder.classList.add('video-placeholder');
    placeholder.innerText = label || 'Другой';
    videoContainer.appendChild(placeholder);

    const labelElement = document.createElement('div');
    labelElement.classList.add('video-label');
    labelElement.innerText = label || 'Другой';
    videoContainer.appendChild(labelElement);

    videoContainer.appendChild(video);

    if (!document.getElementById(videoContainer.id)) {
        videoGrid.append(videoContainer);

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(error => {
                            console.error(`Ошибка воспроизведения видео для ${id}:`, error);
                        });
                        placeholder.style.display = 'none';
                        obs.unobserve(entry.target);
                    } else {
                        video.pause();
                        placeholder.style.display = 'flex';
                    }
                });
            },
            {
                root: null,
                threshold: 0.25
            }
        );

        observer.observe(videoContainer);

        setTimeout(() => {
            videoContainer.classList.add('show');
        }, 100);
    }
}

export function removeVideo(videoGrid: HTMLElement, userId: string): void {
    const videoContainer = document.getElementById(`${userId}-container`);
    if (videoContainer) {
        const video = videoContainer.querySelector('video') as HTMLVideoElement;
        if (video) {
            video.pause();
            video.srcObject = null;
        }
        videoContainer.remove();
    }
}