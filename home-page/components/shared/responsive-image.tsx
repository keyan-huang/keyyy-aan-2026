import type { ImgHTMLAttributes } from 'react';
import { getImageAttributes } from '@/public/scripts/responsive-images.js';

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  alt: string;
  sizes: string;
};

export function ResponsiveImage({
  src,
  alt,
  sizes,
  loading = 'lazy',
  decoding = 'async',
  ...props
}: ResponsiveImageProps) {
  return (
    // oxlint-disable-next-line next/no-img-element -- Static Pages uses our build-time responsive variants, not a Next image server.
    <img
      {...getImageAttributes(src, sizes)}
      {...props}
      alt={alt}
      loading={loading}
      decoding={decoding}
    />
  );
}
