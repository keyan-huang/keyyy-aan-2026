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
  experiments: Array.from({ length: 6 }, (_, index) => ({
    label: `Design experiment ${index + 1}: coming soon`,
  })),
  about: {
    portrait: '/images/imgImg28071.png',
    portraitAlt: 'Keyan outdoors by a pond',
    skills: [
      'User Interviews',
      'Competitive Research',
      'User Testing',
      'Problem Solving',
      'Vibe Coding',
    ],
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
        roles: ['Product Designer', 'Product Intern'],
      },
      {
        image: '/images/imgIbm1.png',
        company: 'IBM',
        roles: ['Student Designer'],
      },
      {
        image: '/images/imgImage165.png',
        company: 'AIGA UTD Student Chapter',
        roles: ['Project Coordinator'],
      },
      {
        image: '/images/imgEco1.png',
        company: 'Environmental Conservation Organization',
        roles: ['Marketing VP'],
      },
    ],
  },
  hobbies: [
    '/images/imgPot2.png',
    '/images/imgBrushes2.png',
    '/images/imgSpoon1.png',
    '/images/imgSewingmachine1.png',
  ],
} as const;
