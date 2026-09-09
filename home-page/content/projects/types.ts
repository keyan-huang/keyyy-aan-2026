export type ProjectSummary = {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  status: 'draft' | 'published';
  href?: string;
};
