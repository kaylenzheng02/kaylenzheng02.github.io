export const profile = {
  name: 'Kaylen Zheng',
  title: 'Frontend Developer & Web Designer',
  intro:
    'I design interfaces in Figma and build them in React. Based in New York City.',
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
    live: '',
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
    live: 'https://thelocalecreator.com',
    code: 'https://github.com/bankerton-banks/ThelocalecreatorNEW',
  },
  {
    title: 'Studio Environment',
    category: 'Browser Game',
    year: '',
    summary: 'A web-based game built with JavaScript that runs in the browser.',
    contribution: '',
    role: '',
    tech: ['JavaScript'],
    image: '',
    live: '',
    code: 'https://github.com/kaylenzheng02/Studio-Environment-Final',
  },
  {
    title: 'Packaging & Brand Design',
    category: 'Print & Digital Design',
    year: '2024 – 2026',
    summary:
      'Product labels, packaging, and promotional graphics for Allstar Wine & Liquor, keeping the brand consistent across product lines.',
    contribution:
      'I also updated website content to support digital marketing, contributing to a 35% increase in website visits.',
    role: 'Product Designer',
    tech: ['Photoshop', 'Illustrator', 'InDesign'],
    image: '',
    live: '',
    code: '',
  },
]

export const about = [
  "I'm a Design and Technology student at Parsons School of Design, minoring in Data Visualization. I like working where design meets code: I care about typography and layout as much as clean, maintainable components.",
  "Before moving into web development, I spent over two years as a product designer creating packaging and marketing work. Outside of the web, I write embedded C++ and Python for my school's robotics team, including machine learning that guides robot movement.",
]

export const capabilities = [
  {
    title: 'Design',
    items: ['Figma', 'Photoshop', 'Illustrator', 'InDesign', 'Responsive layouts'],
  },
  {
    title: 'Develop',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Tailwind CSS', 'Node.js'],
  },
  {
    title: 'Data & Hardware',
    items: ['Recharts', 'Leaflet', 'Python', 'Machine learning', 'C++', 'Arduino', 'ESP32', 'Raspberry Pi'],
  },
]

export const experience = [
  { role: 'Web Developer & Designer', company: 'The Locale Creator', date: '2026 – Now' },
  { role: 'Student Assistant', company: 'Parsons Design & Technology', date: '2026' },
  { role: 'Robotics Team Member', company: 'The New School', date: '2025 – 2026' },
  { role: 'Product Designer', company: 'Allstar Wine & Liquor', date: '2024 – 2026' },
  { role: 'Finance & Accounting Intern', company: 'Amerasia Bank', date: '2025' },
]
