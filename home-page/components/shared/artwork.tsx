import { ResponsiveImage } from './responsive-image';
import { imageSizes } from '@/public/scripts/responsive-images.js';

type ArtworkProps = {
  src: string;
  className?: string;
};

export function Artwork({ src, className = '' }: ArtworkProps) {
  return (
    <ResponsiveImage
      className={`art ${className}`}
      src={src}
      alt=""
      width={1000}
      height={1000}
      sizes={className === 'logo' ? imageSizes.logo : imageSizes.binoculars}
      loading="eager"
      fetchPriority={className === 'binoculars' ? 'high' : undefined}
    />
  );
}
