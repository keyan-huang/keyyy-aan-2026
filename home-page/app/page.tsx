import './home.css';

import Image from 'next/image';
import { ProjectCard } from '@/components/home/project-card';
import { InteractiveArtRow } from '@/components/home/interactive-art-row';
import { HobbyGallery } from '@/components/home/hobby-gallery';
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
                <span className="availability-dot" aria-hidden="true" />
                {homeContent.introduction.availability}
              </p>
            </div>
            <Artwork
              src={homeContent.introduction.illustration}
              className="binoculars"
            />
          </div>
          <InteractiveArtRow kind="navigation" />
          <InteractiveArtRow kind="quotes" />
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
            aria-label="Three design experiment concepts"
          >
            {homeContent.experiments.map((experiment) => (
              <article key={experiment.title} className="experiment-card">
                <div className="experiment-thumbnail">
                  <Image
                    src={experiment.image}
                    alt={experiment.imageAlt}
                    width={800}
                    height={600}
                    loading="lazy"
                    unoptimized
                  />
                </div>
                <div className="experiment-copy">
                  <h3>{experiment.title}</h3>
                  <p>{experiment.description}</p>
                </div>
              </article>
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
                width={756}
                height={1124}
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="about-details">
              <div className="panel education">
                <h3>Education</h3>
                <div className="education-item">
                  <Image
                    src={homeContent.about.education.image}
                    alt=""
                    width={52}
                    height={52}
                    loading="lazy"
                    unoptimized
                  />
                  <div>
                    <h4>{homeContent.about.education.school}</h4>
                    <p>{homeContent.about.education.degree}</p>
                      <p>{homeContent.about.education.gpa}</p>
                  </div>
                </div>
              </div>
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
              <div className="panel strengths">
                <h3>Strengths</h3>
                <ul className="skill-tags strength-tags">
                  {homeContent.about.strengths.map((strength) => (
                    <li className={strength === 'Harmony' ? 'strength-tag--harmony' : undefined} key={strength}>
                      {strength}
                    </li>
                  ))}
                </ul>
                <a className="strengths-link" href={homeContent.about.strengthsUrl} target="_blank" rel="noreferrer">
                  Explore CliftonStrengths
                </a>
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
                        <div className="experience-role" key={role.title}>
                          <h5>{role.title}</h5>
                          <div className="experience-date">{role.date}</div>
                          <p>{role.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <HobbyGallery images={homeContent.hobbies} />
      </main>
      <SiteFooter />
    </>
  );
}
