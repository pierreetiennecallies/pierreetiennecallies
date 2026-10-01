"use client";

import { useState, type CSSProperties, type MouseEvent, type SyntheticEvent } from "react";

const SOUND_VIDEO_SELECTOR = "video[data-sound-toggle]";

function muteOtherVideos(current: HTMLVideoElement) {
  document.querySelectorAll<HTMLVideoElement>(SOUND_VIDEO_SELECTOR).forEach((video) => {
    if (video !== current) video.muted = true;
  });
}

export function VideoLoop({
  src,
  poster,
  width,
  height,
  label,
  fitVideoShape,
  soundToggle,
  objectPosition,
  coverStyle,
  coverName,
  className,
}: {
  src: string;
  poster?: string;
  width: number;
  height: number;
  label: string;
  fitVideoShape: boolean;
  soundToggle: boolean;
  objectPosition?: string;
  coverStyle?: CSSProperties;
  coverName?: string;
  className?: string;
}) {
  const [aspectRatio, setAspectRatio] = useState(width / height);
  const [soundOn, setSoundOn] = useState(false);

  const attachVideo = (element: HTMLVideoElement | null) => {
    if (!fitVideoShape || !element?.videoWidth || !element.videoHeight) return;
    setAspectRatio(element.videoWidth / element.videoHeight);
  };

  const matchVideoShape = (event: SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = event.currentTarget;
    if (fitVideoShape && videoWidth && videoHeight) setAspectRatio(videoWidth / videoHeight);
  };

  const toggleSound = (event: MouseEvent<HTMLButtonElement>) => {
    const video = event.currentTarget.querySelector("video");
    if (!video) return;
    const turnOn = video.muted;
    if (turnOn) muteOtherVideos(video);
    video.muted = !turnOn;
    if (turnOn) video.play();
  };

  const player = (
    <video
      ref={attachVideo}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      aria-label={label}
      data-sound-toggle={soundToggle ? "" : undefined}
      onLoadedMetadata={matchVideoShape}
      onVolumeChange={(event) => setSoundOn(!event.currentTarget.muted)}
      className={`object-cover ${className ?? ""}`}
      data-cover={coverName ? "" : undefined}
      style={{ ...coverStyle, aspectRatio, objectPosition }}
    />
  );

  if (!soundToggle) return player;

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? `Turn sound off: ${label}` : `Turn sound on: ${label}`}
      className="relative block cursor-pointer outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      {player}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[clamp(8px,0.8vw,16px)] left-[clamp(8px,0.8vw,16px)] text-label leading-none tracking-[0.02em] text-white mix-blend-difference"
      >
        {soundOn ? "Sound on" : "Sound off"}
      </span>
    </button>
  );
}
