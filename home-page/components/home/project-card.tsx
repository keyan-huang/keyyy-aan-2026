import './project-card.css';

import { ResponsiveImage } from '@/components/shared/responsive-image';
import { imageSizes } from '@/public/scripts/responsive-images.js';
import type { ProjectSummary } from '@/content/projects/types';

function ProjectAction({
  href,
  status,
}: Pick<ProjectSummary, 'href' | 'status'>) {
  const content = <span>Explore</span>;

  return href ? (
    <a className="project-action" href={href}>
      {content}
    </a>
  ) : (
    <button
      className="project-action"
      type="button"
      disabled={status === 'draft'}
    >
      {content}
    </button>
  );
}

export function ProjectCard({
  project,
  compact = false,
}: {
  project: ProjectSummary;
  compact?: boolean;
}) {
  return (
    <article className={`project${compact ? ' project--compact' : ''}`}>
      <div className="project-description">
        <h3>
          {project.titleLines ? (
            <>
              {project.titleLines[0]}
              <br />
              {project.titleLines[1]}
            </>
          ) : (
            project.title
          )}
        </h3>
        <p>{project.description}</p>
        <ProjectAction href={project.href} status={project.status} />
      </div>
      <div className={`project-thumbnail project-thumbnail-${project.slug}`}>
        <ResponsiveImage
          className="project-image"
          src={project.thumbnail}
          alt={project.thumbnailAlt ?? `${project.title} interface preview`}
          loading="lazy"
          sizes={compact ? imageSizes.additionalProject : imageSizes.project}
        />
      </div>
    </article>
  );
}
