import Image from "next/image";
import { stillImage, type Media } from "@/lib/content";
import { VideoLoop } from "./VideoLoop";

export function MediaView({
  media,
  sizes,
  preload = false,
  fitVideoShape = true,
  allowSound = false,
  fillFrame = false,
  className,
}: {
  media: Media;
  sizes: string;
  preload?: boolean;
  fitVideoShape?: boolean;
  allowSound?: boolean;
  fillFrame?: boolean;
  className?: string;
}) {
  const objectPosition = fillFrame ? stillImage(media)?.focus : undefined;

  if (media.kind === "video") {
    return (
      <VideoLoop
        src={media.url}
        poster={media.poster ? `${media.poster.url}?w=1200&auto=format` : undefined}
        width={media.width}
        height={media.height}
        label={media.alt}
        fitVideoShape={fitVideoShape}
        soundToggle={allowSound && media.hasSound}
        objectPosition={objectPosition}
        className={className}
      />
    );
  }

  return (
    <Image
      src={media.url}
      width={media.width}
      height={media.height}
      alt={media.alt}
      sizes={sizes}
      preload={preload}
      draggable={false}
      className={className}
      style={objectPosition ? { objectPosition } : undefined}
    />
  );
}
