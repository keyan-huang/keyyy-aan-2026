"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const asset = (name: string) => `/images/${name}.png`;
const Art = ({name, className = ''}: {name: string; className?: string}) => <img className={`art ${className}`} src={asset(name)} alt="" />;

function ContactMenu() {
  return <DropdownMenu>
    <DropdownMenuTrigger className="nav-contact">Connect</DropdownMenuTrigger>
    <DropdownMenuContent align="end" sideOffset={14} className="contact-menu">
      <DropdownMenuItem className="contact-menu-item" render={<a href="mailto:keyanhuang3@gmail.com" />}>
        <span className="contact-color contact-color-email" aria-hidden="true">E</span>
        <span><strong>Email me</strong><small>keyanhuang3@gmail.com</small></span>
      </DropdownMenuItem>
      <DropdownMenuItem className="contact-menu-item" render={<a href="https://www.linkedin.com/in/keyan-huang-4895971b4/" target="_blank" rel="noopener noreferrer" />}>
        <span className="contact-color contact-color-linkedin" aria-hidden="true">in</span>
        <span><strong>LinkedIn</strong><small>Connect professionally</small></span>
      </DropdownMenuItem>
      <DropdownMenuItem className="contact-menu-item contact-menu-item-disabled" disabled>
        <span className="contact-color contact-color-resume" aria-hidden="true">R</span>
        <span><strong>Résumé</strong><small>Coming soon</small></span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}

export default function Home() {
  return <>
    <a className="skip-link" href="#work">Skip to selected projects</a>
    <header className="navigation"><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#fun">Fun</a><a href="#me">Me</a><ContactMenu /></nav><a href="#top" aria-label="Back to top"><Art name="imgImage81" className="logo" /></a></header>
    <main id="top">
      <section className="intro" aria-label="Introduction">
        <div className="hero"><div><h1>Keyan is<br/>a curious designer</h1><p className="availability">Open to opportunity</p></div><Art name="imgBinoculars1" className="binoculars" /></div>
        <div className="art-row first-row">{['imgCursor1','imgBallon2','imgSunflower1','imgGeoshape2'].map(name=><Art key={name} name={name}/>)}</div>
        <div className="art-row second-row">{['imgApron1','imgBike1','imgWaterpot2','imgShovel1'].map(name=><Art key={name} name={name}/>)}</div>
        <p className="intro-copy">I’m a curious product designer who loves diving into messy, complicated problems and figuring out what’s really going on. I’m not afraid of complexity—I like pulling things apart, connecting the dots, and turning all that chaos into something that feels clear, and human.</p>
      </section>
      <section id="work" className="projects section-wide">
        <h2>Selected Projects</h2>
        <div className="project-list">{['imgImage164','imgImage168','imgImage167'].map((name,i)=><article className="project" key={name}>
          <div className="project-description"><h3>Performance Discussion Form</h3><p>{Array(14).fill('I am cool').join(', ')},</p></div>
          <img className="project-image" src={asset(name)} alt={['Performance discussion interface on a purple background','Mobile design screens on a pink background','Colorful character design explorations on a blue background'][i]} loading="lazy" />
          <div className="project-notes">{[0,1,2,3].map(n=><p key={n}>Performance Discussion Form</p>)}</div>
        </article>)}</div>
      </section>
      <section id="fun" className="experiments section-narrow"><h2>Design Experiments</h2><div className="experiment-grid" aria-label="Six design experiment placeholders">{[0,1,2,3,4,5].map(n=><div key={n} className="experiment-tile" role="img" aria-label={`Design experiment ${n+1}: coming soon`}/>)}</div></section>
      <section id="me" className="about section-wide"><h2>About Keyan</h2><div className="about-grid">
        <div className="portrait-frame"><img src={asset('imgImg28071')} alt="Keyan outdoors by a pond" loading="lazy" /></div>
        <div className="about-details"><div className="panel skills"><h3>Skills</h3><ul className="skill-tags">{['User Interviews','Competitive Research','User Testing','Problem Solving','Vibe Coding'].map(skill=><li key={skill}>{skill}</li>)}</ul></div>
        <div className="panel tools"><h3>Tools</h3><div className="tool-icons">{[['imgFigma1','Figma'],['imgAdobe1','Adobe'],['imgClaude1','Claude'],['imgCodex1','Codex'],['imgJira1','Jira'],['imgUsertesting1','UserTesting']].map(([name,label])=><img key={name} src={asset(name)} alt={label} title={label} loading="lazy"/>)}</div></div></div>
        <div className="panel experience"><h3>Experiences</h3><div className="experience-list">{[
          ['imgPaycom1','Paycom','Product Designer','Product Intern'],['imgIbm1','IBM','Student Designer'],['imgImage165','AIGA UTD Student Chapter','Project Coordinator'],['imgEco1','Environmental Conservation Organization','Marketing VP']
        ].map(([name,company,...roles])=><div className="experience-item" key={name}><img src={asset(name)} alt="" loading="lazy"/><div><h4>{company}</h4>{roles.map(role=><p key={role}>{role}</p>)}</div></div>)}</div></div>
      </div></section>
      <div className="hobbies" aria-label="Cooking, painting, crafting, and sewing">{['imgPot2','imgBrushes2','imgSpoon1','imgSewingmachine1'].map(name=><div className="hobby-card" key={name}><Art name={name}/></div>)}</div>
    </main>
    <footer id="connect"><div className="footer-inner"><Art name="imgBallon2" className="footer-balloon"/><div className="contact-content"><h2>This curious designer wants to connect with you!</h2><div className="contact-links"><a className="contact email" href="mailto:keyanhuang3@gmail.com">Email</a><a className="contact linkedin" href="https://www.linkedin.com/in/keyan-huang-4895971b4/" target="_blank" rel="noopener noreferrer">LinkedIn</a><span className="contact resume" aria-label="Résumé coming soon">Résumé</span></div></div></div></footer>
  </>;
}
