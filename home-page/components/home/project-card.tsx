import './project-card.css';

import { ArrowRight } from 'lucide-react';
import { ResponsiveImage } from '@/components/shared/responsive-image';
import { imageSizes } from '@/public/scripts/responsive-images.js';
import type { ProjectSummary } from '@/content/projects/types';

function ProjectAction({
  href,
  status,
}: Pick<ProjectSummary, 'href' | 'status'>) {
  const content = (
    <>
      <span>View details</span>
      <ArrowRight aria-hidden="true" size={22} strokeWidth={2} />
    </>
  );

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

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <article className="project">
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
      </div>
      <div className={`project-thumbnail project-thumbnail-${project.slug}`}>
        <ResponsiveImage
          className="project-image"
          src={project.thumbnail}
          alt={`${project.title} interface preview`}
          width={1000}
          height={750}
          loading="lazy"
          sizes={imageSizes.project}
        />
      </div>
      <ProjectAction href={project.href} status={project.status} />
    </article>
  );
}
