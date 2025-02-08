import { notify } from '../notifications';

export function setupControls(
    myVideoStream: MediaStream,
    setMuteButton: (isActive: boolean) => void,
    setVideoButton: (isActive: boolean) => void,
    toggleMute: () => void
): void {
    const muteButton = document.getElementById('muteButton') as HTMLElement;
    muteButton.addEventListener('click', () => {
        toggleMute();
    });

    const videoButton = document.getElementById('videoButton') as HTMLElement;
    videoButton.addEventListener('click', () => {
        if (!myVideoStream) return;
        const videoTrack = myVideoStream.getVideoTracks()[0];
        if (!videoTrack) return;

        videoTrack.enabled = !videoTrack.enabled;
        setVideoButtonUI(videoTrack.enabled);
        notify(videoTrack.enabled ? 'Видео включено' : 'Видео отключено', 'info');
    });
}

export function setMuteButtonUI(isActive: boolean): void {
    const muteButton = document.getElementById('muteButton') as HTMLElement;
    muteButton.innerHTML = `<i class="fas ${isActive ? 'fa-microphone' : 'fa-microphone-slash'}"></i>`;
}

export function setVideoButtonUI(isActive: boolean): void {
    const videoButton = document.getElementById('videoButton') as HTMLElement;
    videoButton.innerHTML = `<i class="fas ${isActive ? 'fa-video' : 'fa-video-slash'}"></i>`;
}