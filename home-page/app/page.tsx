import './home.css';

import Image from 'next/image';
import { ProjectCard } from '@/components/home/project-card';
import { Artwork } from '@/components/shared/artwork';
import { SiteFooter } from '@/components/shared/site-footer';
import { SiteHeader } from '@/components/shared/site-header';
import { homeContent } from '@/content/home';
import { projects } from '@/content/projects';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="intro" aria-label="Introduction">
          <div className="hero">
            <div>
              <h1>
                {homeContent.introduction.heading.split('\n').map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </h1>
              <p className="availability">
                {homeContent.introduction.availability}
              </p>
            </div>
            <Artwork
              src={homeContent.introduction.illustration}
              className="binoculars"
            />
          </div>
          <div className="art-row first-row">
            {homeContent.introduction.firstArtRow.map((src) => (
              <Artwork key={src} src={src} />
            ))}
          </div>
          <div className="art-row second-row">
            {homeContent.introduction.secondArtRow.map((src) => (
              <Artwork key={src} src={src} />
            ))}
          </div>
          <p className="intro-copy">{homeContent.introduction.summary}</p>
        </section>
        <section id="work" className="projects section-wide">
          <h2>Selected Projects</h2>
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard project={project} key={project.slug} />
            ))}
          </div>
        </section>
        <section id="fun" className="experiments section-narrow">
          <h2>Design Experiments</h2>
          <div
            className="experiment-grid"
            aria-label="Six design experiment placeholders"
          >
            {homeContent.experiments.map((experiment) => (
              <div
                key={experiment.label}
                className="experiment-tile"
                aria-hidden="true"
              />
            ))}
          </div>
        </section>
        <section id="me" className="about section-wide">
          <h2>About Keyan</h2>
          <div className="about-grid">
            <div className="portrait-frame">
              <Image
                src={homeContent.about.portrait}
                alt={homeContent.about.portraitAlt}
                width={1000}
                height={1000}
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="about-details">
              <div className="panel skills">
                <h3>Skills</h3>
                <ul className="skill-tags">
                  {homeContent.about.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="panel tools">
                <h3>Tools</h3>
                <div className="tool-icons">
                  {homeContent.about.tools.map((tool) => (
                    <Image
                      key={tool.image}
                      src={tool.image}
                      alt={tool.label}
                      title={tool.label}
                      width={76}
                      height={76}
                      loading="lazy"
                      unoptimized
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="panel experience">
              <h3>Experiences</h3>
              <div className="experience-list">
                {[...homeContent.about.experience].map((experience) => (
                  <div className="experience-item" key={experience.company}>
                    <Image
                      src={experience.image}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      unoptimized
                    />
                    <div>
                      <h4>{experience.company}</h4>
                      {experience.roles.map((role) => (
                        <p key={role}>{role}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <div
          className="hobbies"
          aria-label="Cooking, painting, crafting, and sewing"
        >
          {homeContent.hobbies.map((src) => (
            <div className="hobby-card" key={src}>
              <Artwork src={src} />
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
