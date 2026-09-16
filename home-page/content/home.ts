export const homeContent = {
  introduction: {
    heading: 'keyan turns\nbig questions into\nbright ideas',
    availability: 'Open to opportunity',
    illustration: '/images/imgBinoculars1.png',
    firstArtRow: [
      '/images/imgCursor1.png',
      '/images/imgBallon2.png',
      '/images/imgSunflower1.png',
      '/images/imgGeoshape2.png',
    ],
    secondArtRow: [
      '/images/imgApron1.png',
      '/images/imgBike1.png',
      '/images/imgWaterpot2.png',
      '/images/imgShovel1.png',
    ],
    summary:
      'I’m a curious product designer who loves untangling messy, ambiguous problems and uncovering what’s really happening beneath the surface. I pull things apart, connect the dots, and turn complexity into experiences that feel intuitive, fun, and deeply human.',
  },
  experiments: [
    {
      title: 'Prompt Garden',
    },
    {
      title: 'Moodboard Copilot',
    },
    {
      title: 'Research Agent',
    },
  ],
  about: {
    portrait: '/images/about-keyan-portrait.png',
    portraitAlt: 'Keyan standing on an autumn tree-lined street in a blue jacket',
    education: {
      image: '/images/ut-austin.png',
      school: 'The University of Texas at Austin',
      degree: 'BFA in Design',
      gpa: 'GPA: 4.0',
    },
    skills: [
      'User Interviews',
      'Competitive Research',
      'User Testing',
      'Problem Solving',
      'Vibe Coding',
    ],
    strengths: ['Deliberative', 'Restorative', 'Harmony', 'Achiever', 'Discipline'],
    strengthsUrl: 'https://www.gallup.com/cliftonstrengths/en/253715/34-cliftonstrengths-themes.aspx',
    tools: [
      { image: '/images/imgFigma1.png', label: 'Figma' },
      { image: '/images/imgAdobe1.png', label: 'Adobe' },
      { image: '/images/imgClaude1.png', label: 'Claude' },
      { image: '/images/imgCodex1.png', label: 'Codex' },
      { image: '/images/imgJira1.png', label: 'Jira' },
      { image: '/images/imgUsertesting1.png', label: 'UserTesting' },
    ],
    experience: [
      {
        image: '/images/imgPaycom1.png',
        company: 'Paycom',
        roles: [
          {
            title: 'Product Designer',
            date: '2024–2026',
            descriptions: [
              'Managed 3 concurrent projects across 5 PMs and 3 engineering teams as the sole designer on 20+ initiatives, and mentored 2 design interns through biweekly critique and project guidance.',
              'Owned the end-to-end redesign of the Personnel Action Form, a workflow used by 350K+ managers, cutting employee-transfer process time by 50% through a rearchitected approval flow.',
              'Reframed the Performance Discussion Form around real-time performance insights, driving a 25% increase in adoption and surfacing 60% more priority actions and data trends.',
            ],
          },
          {
            title: 'Product Intern',
            date: '2023 Summer',
            descriptions: [
              'Designed a CRM architecture and led 16 interviews to streamline sales workflows and inform data visualization recommendations.',
            ],
          },
        ],
      },
      {
        image: '/images/imgIbm1.png',
        company: 'IBM',
        roles: [
          {
            title: 'Student Designer',
            date: '2024 Spring',
            descriptions: [
              "Designed for urbanization issues and interviewed local business owners to preserve Austin's culture.",
            ],
          },
        ],
      },
      {
        image: '/images/imgDfa1.svg?v=no-black-border',
        company: 'Design for America UT',
        roles: [
          {
            title: 'Project Manager',
            date: '2022–2024',
            descriptions: [
              'Led monthly workshops on design research methods and delivered projects addressing issues across university services.',
            ],
          },
        ],
      },
      {
        image: '/images/imgImage165.png',
        company: 'AIGA Student Chapter',
        roles: [
          {
            title: 'Program Director',
            date: '2021–2022',
            descriptions: [
              'Organized design workshops and coordinated 5 professional development events with industry leaders.',
            ],
          },
        ],
      },
    ],
  },
  hobbies: [
    { src: '/images/life-gallery/creative-wall.jpg', label: "Keyan's colorful art and inspiration wall" },
    { src: '/images/life-gallery/homemade-sushi.jpg', label: 'Homemade sushi and sashimi' },
    { src: '/images/life-gallery/keyan-design-studio.jpg', label: 'Keyan at the Austin Design Studio' },
    { src: '/images/life-gallery/plastic-universe-team.jpg', label: 'Keyan and collaborators with the Plastic Universe installation' },
    { src: '/images/life-gallery/wildflower-garden.jpg', label: 'A garden filled with orange and purple wildflowers' },
    { src: '/images/life-gallery/paycom-team-event.png', label: 'Keyan and colleagues at a Paycom team event' },
    { src: '/images/life-gallery/keyan-yellowstone.jpg', label: 'Keyan visiting Yellowstone in a blue jacket' },
    { src: '/images/life-gallery/keyan-glacier.jpg', label: 'Keyan visiting a glacier in a yellow jacket' },
  ],
} as const;
