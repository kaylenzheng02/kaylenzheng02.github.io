export const profile = {
  name: 'Kaylen Zheng',
  title: 'Frontend Developer & Web Designer',
  intro:
    'I design and build websites that are clear, intuitive, and easy to use. Based in New York City.',
  now: [
    'Web Developer & Designer at The Locale Creator',
    'BFA Design & Technology at Parsons',
  ],
  email: 'kaylenzheng22@gmail.com',
  resume: '/Kaylen-Zheng-Resume.pdf',
  links: {
    github: 'https://github.com/kaylenzheng02',
    linkedin: 'https://www.linkedin.com/in/kaylenzheng2/',
  },
}

export const projects = [
  {
    title: 'Pidge',
    category: 'Web App · Hackathon',
    year: '2026',
    summary:
      'A climate-health dashboard that helps care teams find and follow up with high-risk patients. It uses real-time environmental and community data, and an interactive map that locates nearby resources like cooling centers, pharmacies, and food pantries. Built at the Health in Climate AI Hackathon at Cornell Tech.',
    contribution:
      'I designed the entire front end in Figma, then built it in code: the resource map, ZIP code risk views, patient-status charts, and workflows for check-ins, resource matching, and care-team escalation.',
    role: 'Front-End Designer & Developer',
    tech: ['Figma', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Leaflet', 'Machine Learning'],
    images: [
      { src: '/projects/pidge/cover.webp', alt: 'Pidge community needs page with unresolved needs charted by ZIP code' },
      { src: '/projects/pidge/resources-cover.webp', alt: 'Pidge community resources page with a map and resource directory' },
    ],
    devpost: 'https://devpost.com/software/pidge',
    code: 'https://github.com/kaylenzheng02/Health-in-AI-Hackathon-2026',
  },
  {
    title: 'The Locale Creator',
    category: 'Website · Student Organization',
    year: '2026',
    summary:
      'The website for The Locale Creator, a student-run arts magazine at Parsons, taken from Figma designs to a responsive site that works across desktop and mobile.',
    contribution:
      'I designed every page in Figma and built the front end in code, working with the team to finalize each page. I also managed the backend, written in Python and Node.js, for user data and traffic analytics.',
    role: 'Web Developer & Designer',
    tech: ['HTML', 'CSS', 'JavaScript', 'Figma', 'Node.js', 'Python'],
    images: [
      { src: '/projects/locale-creator/home.webp', alt: 'The Locale Creator home page with the magazine logo and issue covers' },
      { src: '/projects/locale-creator/issue-light.webp', alt: 'The Locale Creator issue page in light mode with the cover and spreads' },
    ],
    live: 'https://bankerton-banks.github.io/ThelocalecreatorNEW/Homepage/Homepage.html',
    code: 'https://github.com/bankerton-banks/ThelocalecreatorNEW',
  },
  {
    title: 'What a Day',
    category: 'Browser Game',
    year: '2026',
    summary:
      'An interactive story game about a businessman pulled out of his office routine and dropped into a surreal, fog-filled forest, where the player’s choices decide how he adapts.',
    contribution:
      'I wrote the storyline, hand-drew all of the illustrations, and developed the entire game, from the branching scenes and transitions to the interactive sticky-note start screen and sound.',
    role: 'Designer, Illustrator & Developer',
    tech: ['JavaScript', 'HTML', 'CSS', 'Adobe Creative Suite'],
    images: [
      { src: '/projects/studio-environment/sticky-notes.webp', alt: 'What a Day start screen covered in sticky notes with office to-dos' },
      { src: '/projects/studio-environment/illustration.webp', alt: 'Illustration of two figures in a teal forest above a field of red grass' },
    ],
    live: 'https://kaylenzheng02.github.io/Studio-Environment-Final/',
    code: 'https://github.com/kaylenzheng02/Studio-Environment-Final',
  },
  {
    title: 'Packaging & Brand Design',
    category: 'Print & Digital Design',
    year: '2024 – 2026',
    summary:
      'Brand design for Allstar Wine & Liquor, a neighborhood wine shop in Little Neck, New York: business cards, product labels, packaging, and promotional graphics built on one consistent visual identity.',
    contribution:
      'I designed the business cards and a promotional series for wine, spirits, and sparkling wine, keeping every piece in the same maroon-and-cream palette and serif type. I also updated website content to support digital marketing, contributing to a 35% increase in website visits.',
    role: 'Product Designer',
    tech: ['Photoshop', 'Illustrator', 'InDesign'],
    images: [
      {
        src: '/projects/allstar/promo-sparkling.webp',
        alt: 'Allstar sparkling wine promo: "Make it a moment." with two champagne flutes',
      },
      {
        src: '/projects/allstar/business-cards.webp',
        alt: 'Front and back of the Allstar Wine & Liquor business cards',
      },
    ],
    compact: true,
  },
]

export const about = [
  "I'm a Design and Technology student at Parsons School of Design, minoring in Data Visualization. What I enjoy most is developing web interfaces, especially tools that make data easier to understand and explore. I want everything I build to feel intuitive and work well.",
  "Beyond the web, I have a particular interest in robotics and program for my school's team. Away from the screen, I'm usually rock climbing, hiking, drawing, or reading science fiction.",
]

export const sketches = [
  { src: '/about/sketch-osaka-castle.webp', alt: 'Pen sketch of Osaka Castle' },
  { src: '/about/sketch-pat-garrett.webp', alt: 'Red ink drawing of a racer with a revolver, matches, and a Pat Garrett sign' },
  { src: '/about/sketch-sardine.webp', alt: 'Pink halftone sardines behind the words "want a sardine?"' },
]

export const capabilities = [
  {
    title: 'Languages',
    items: ['JavaScript', 'TypeScript', 'HTML & CSS', 'Python', 'C/C++'],
  },
  {
    title: 'Frameworks & Libraries',
    items: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Recharts', 'Leaflet'],
  },
  {
    title: 'Design',
    items: ['Figma', 'Adobe Creative Cloud', 'Responsive layouts'],
  },
  {
    title: 'Tools',
    items: ['Git', 'Visual Studio'],
  },
  {
    title: 'Hardware & ML',
    items: ['Arduino', 'ESP32', 'Raspberry Pi', 'Machine learning'],
  },
]

export const experience = [
  { role: 'Web Developer & Designer', company: 'The Locale Creator', date: '2026 – Now' },
  { role: 'Student Assistant', company: 'Parsons Design & Technology', date: '2026' },
  { role: 'Robotics Programmer', company: 'Parsons Robotics Team', date: '2025 – 2026' },
  { role: 'Product Designer', company: 'Allstar Wine & Liquor', date: '2024 – 2026' },
  { role: 'Finance & Accounting Intern', company: 'Amerasia Bank', date: '2025' },
]
