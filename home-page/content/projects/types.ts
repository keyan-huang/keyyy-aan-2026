export type ProjectSummary = {
  slug: string;
  title: string;
  titleLines?: readonly [string, string];
  description: string;
  thumbnail: string;
  status: 'draft' | 'published';
  href?: string;
};
