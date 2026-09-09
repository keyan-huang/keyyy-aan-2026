import Image from 'next/image';

type ArtworkProps = {
  src: string;
  className?: string;
};

export function Artwork({ src, className = '' }: ArtworkProps) {
  return (
    <Image
      className={`art ${className}`}
      src={src}
      alt=""
      width={1000}
      height={1000}
      unoptimized
    />
  );
}
