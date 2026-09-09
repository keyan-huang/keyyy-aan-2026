export const homeContent = {
  introduction: {
    heading: 'Keyan is\na curious designer',
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
      'I’m a curious product designer who loves diving into messy, complicated problems and figuring out what’s really going on. I’m not afraid of complexity—I like pulling things apart, connecting the dots, and turning all that chaos into something that feels clear, and human.',
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
    portrait: '/images/about-keyan.png',
    portraitAlt: 'Keyan standing on a tree-lined street in a blue jacket',
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
            date: '2025–Present',
            description: 'Designed thoughtful workflows for complex HR products in partnership with research, product, and engineering.',
          },
          {
            title: 'Product Intern',
            date: '2024–2025',
            description: 'Explored early concepts and translated employee needs into clear, testable product improvements.',
          },
        ],
      },
      {
        image: '/images/imgIbm1.png',
        company: 'IBM',
        roles: [
          {
            title: 'Student Designer',
            date: '2023–2024',
            description: 'Shaped research findings and emerging technology concepts into an approachable experience.',
          },
        ],
      },
      {
        image: '/images/imgImage165.png',
        company: 'AIGA UTD Student Chapter',
        roles: [
          {
            title: 'Project Coordinator',
            date: '2022–2023',
            description: 'Organized creative programs and helped student designers turn shared ideas into welcoming events.',
          },
        ],
      },
      {
        image: '/images/imgEco1.png',
        company: 'Environmental Conservation Organization',
        roles: [
          {
            title: 'Marketing VP',
            date: '2021–2022',
            description: 'Led campaign design and storytelling that made local conservation efforts easier to discover and support.',
          },
        ],
      },
    ],
  },
  hobbies: [
    { src: '/images/imgPot2.png', label: 'Cooking' },
    { src: '/images/imgBrushes2.png', label: 'Painting' },
    { src: '/images/imgSpoon1.png', label: 'Trying new recipes' },
    { src: '/images/imgSewingmachine1.png', label: 'Sewing' },
    { src: '/images/imgWaterpot2.png', label: 'Gardening' },
    { src: '/images/imgBike1.png', label: 'Cycling' },
    { src: '/images/imgSunflower1.png', label: 'Growing flowers' },
    { src: '/images/imgApron1.png', label: 'Making things by hand' },
  ],
} as const;
