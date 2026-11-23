// Full public-profile detail for each entry in `publicDevelopers`, keyed by
// id. This is what /developers/:id reads once a specific developer is
// opened — each id below must line up with an id in publicDevelopers.
//
// This is still local mock data (see studentService.js / the "how do people
// get listed" note in Discover.jsx for how this should eventually be
// replaced by real verified student records from the backend).

export const studentProfiles = {
  'amaya-kapoor': {
    name: 'Amaya Kapoor',
    title: 'Full Stack Developer & UI/UX Designer',
    college: 'Indian Institute of Technology',
    branch: 'Computer Science',
    year: 'Final Year',
    location: 'Bengaluru, India',
    rating: 4.9,
    projectsCompleted: 38,
    hireRequests: 21,
    responseRate: '95%',
    about:
      "I'm a verified student developer focused on building scalable web applications and polished digital experiences. I blend frontend craftsmanship with backend engineering to create meaningful product solutions.",
    careerInterests: "I'm passionate about product-led growth, SaaS platforms, and creating intuitive user journeys for modern web applications.",
    goals: 'To deliver production-ready solutions, expand my portfolio with collaborative work, and transition smoothly into a full-time developer role.',
    specialization: 'Frontend-first full stack development, component-driven interfaces, responsive design, and secure data-driven applications.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'MongoDB', 'MySQL', 'Git', 'GitHub', 'REST API', 'Firebase', 'Tailwind', 'Bootstrap'],
    portfolio: [
      { title: 'CampusConnect', category: 'Web App', description: 'A collaboration hub for student teams with task tracking and progress dashboards.', stack: 'React \u00b7 Node.js \u00b7 MongoDB \u00b7 Firebase', completed: 'Apr 2026' },
      { title: 'StudioFlow', category: 'Design System', description: 'A UI toolkit for scalable product design with reusable components and polished interactions.', stack: 'Figma \u00b7 React \u00b7 Storybook \u00b7 CSS', completed: 'Feb 2026' },
      { title: 'MarketPulse', category: 'E-commerce', description: 'An e-commerce analytics dashboard with dynamic filters and customer insights.', stack: 'Vue \u00b7 Express \u00b7 MySQL \u00b7 Chart.js', completed: 'Jan 2026' },
    ],
    showcase: [
      { title: 'AI Mentor', description: 'An educational assistant that guides students through project planning and technical research.', stack: 'React \u00b7 Python \u00b7 NLP', rating: 4.9, views: '1.2k', likes: 312, comments: 28 },
      { title: 'SecurePay', description: 'A payment gateway prototype with authentication, transaction tracking, and user analytics.', stack: 'Node.js \u00b7 Express \u00b7 Stripe API', rating: 4.8, views: '980', likes: 284, comments: 19 },
    ],
    experience: [
      { title: 'Internships', description: 'Built internal dashboards and optimized data workflows during a summer internship at a fintech startup.' },
      { title: 'Freelance Projects', description: 'Delivered complete web solutions for startups and local businesses focusing on performance and UX.' },
      { title: 'Hackathons', description: 'Won top awards for rapid prototyping and scalable architecture in multiple national hackathons.' },
      { title: 'Open Source', description: 'Contributed code improvements and documentation to community libraries and developer tools.' },
      { title: 'Personal Projects', description: 'Created experimental apps focused on automation, productivity, and developer workflows.' },
    ],
    certifications: ['Google', 'Microsoft', 'AWS', 'Meta', 'Coursera', 'Udemy'],
    reviews: [
      { name: 'Akash R.', role: 'Product Manager', rating: 4.9, text: 'Amaya delivered a seamless dashboard and communicated consistently throughout the project.' },
      { name: 'Priya S.', role: 'Founder', rating: 5.0, text: "Her design system work improved our product's usability and helped speed up development." },
    ],
    analytics: { portfolioViews: '4.2k', projectViews: '1.8k', hireRequests: 21, projectsCompleted: 38, repeatClients: 12, responseTime: '1.2h' },
    badges: ['\ud83c\udfc6 Top Developer', '\u2b50 5 Star Performer', '\ud83d\ude80 Rising Star', '\ud83d\udca1 Innovation Award', '\ud83c\udf93 Verified Student', '\ud83d\udd25 Trending Creator', '\ud83d\udcbb Full Stack Expert'],
    contact: { email: 'amaya.kapoor@example.com' },
    related: [
      { name: 'Rohan Kumar', stack: 'React \u00b7 Node.js \u00b7 MongoDB', rating: 4.8, id: 'rohan-kumar' },
      { name: 'Aisha Rao', stack: 'UI/UX \u00b7 Figma \u00b7 CSS', rating: 4.7, id: 'aisha-rao' },
      { name: 'Nikhil Sharma', stack: 'Python \u00b7 Django \u00b7 ML', rating: 4.9, id: 'nikhil-sharma' },
    ],
  },

  'rohan-kumar': {
    name: 'Rohan Kumar',
    title: 'React & Node.js Developer',
    college: 'IIT Delhi',
    branch: 'Computer Science & Engineering',
    year: 'Third Year',
    location: 'New Delhi, India',
    rating: 4.8,
    projectsCompleted: 24,
    hireRequests: 14,
    responseRate: '92%',
    about:
      "I'm a product-minded frontend engineer who turns complex flows into friendly interfaces. I care about performance, accessibility, and shipping features clients actually understand and trust.",
    careerInterests: "I'm drawn to developer tooling, real-time apps, and teams that ship fast without cutting corners on code quality.",
    goals: 'To keep building production React/Node systems for real clients while sharpening my system-design skills ahead of full-time interviews.',
    specialization: 'React component architecture, Node.js/Express APIs, MongoDB data modelling, and turning rough Figma files into working products.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Redux', 'Tailwind', 'REST API', 'Git', 'Docker'],
    portfolio: [
      { title: 'TaskForge', category: 'Web App', description: 'A kanban-style project tracker with real-time updates for small dev teams.', stack: 'React \u00b7 Node.js \u00b7 Socket.io \u00b7 MongoDB', completed: 'Mar 2026' },
      { title: 'ShelfSmart', category: 'Inventory Tool', description: 'A lightweight inventory manager for small retailers with barcode lookup.', stack: 'React \u00b7 Express \u00b7 MongoDB', completed: 'Dec 2025' },
      { title: 'PulseCheck', category: 'Dashboard', description: 'A status-page style uptime dashboard with alerting.', stack: 'React \u00b7 Node.js \u00b7 Chart.js', completed: 'Oct 2025' },
    ],
    showcase: [
      { title: 'DevSync', description: 'A CLI + dashboard pairing tool that keeps a team\u2019s local envs in sync.', stack: 'Node.js \u00b7 React \u00b7 WebSockets', rating: 4.8, views: '640', likes: 151, comments: 12 },
    ],
    experience: [
      { title: 'Internships', description: 'Frontend intern at a logistics startup, rebuilt the dispatcher dashboard in React.' },
      { title: 'Freelance Projects', description: 'Delivered three client MVPs end-to-end, from wireframe to deployed API.' },
      { title: 'Hackathons', description: 'Runner-up at a 36-hour national hackathon for a real-time collaboration tool.' },
    ],
    certifications: ['Meta Frontend Developer', 'MongoDB Associate Developer'],
    reviews: [
      { name: 'Kabir M.', role: 'Startup Founder', rating: 4.9, text: 'Rohan shipped our MVP on time and flagged issues before they became problems.' },
      { name: 'Deepa N.', role: 'Product Lead', rating: 4.7, text: 'Clean code, clear communication, and genuinely cared about the end user.' },
    ],
    analytics: { portfolioViews: '2.1k', projectViews: '960', hireRequests: 14, projectsCompleted: 24, repeatClients: 6, responseTime: '2.4h' },
    badges: ['\u2b50 5 Star Performer', '\ud83c\udf93 Verified Student', '\ud83d\udcbb Full Stack Expert'],
    contact: { email: 'rohan.kumar@example.com' },
    related: [
      { name: 'Amaya Kapoor', stack: 'React \u00b7 Node.js \u00b7 Python', rating: 4.9, id: 'amaya-kapoor' },
      { name: 'Nikhil Sharma', stack: 'Python \u00b7 Django \u00b7 ML', rating: 4.9, id: 'nikhil-sharma' },
      { name: 'Aisha Rao', stack: 'UI/UX \u00b7 Figma \u00b7 CSS', rating: 4.7, id: 'aisha-rao' },
    ],
  },

  'aisha-rao': {
    name: 'Aisha Rao',
    title: 'Frontend Developer & Visual Designer',
    college: 'NIT Trichy',
    branch: 'Information Technology',
    year: 'Final Year',
    location: 'Chennai, India',
    rating: 4.7,
    projectsCompleted: 19,
    hireRequests: 9,
    responseRate: '89%',
    about:
      "I design and ship accessible web interfaces for early-stage teams. I move between Figma and code comfortably, so what gets designed is what actually ships.",
    careerInterests: "I'm interested in design systems, accessibility-first product work, and small teams where design and engineering sit close together.",
    goals: 'To keep growing as a hybrid designer-developer and eventually lead design systems work at a product company.',
    specialization: 'Design systems, Webflow/React handoff, responsive layout, and motion-driven interface polish.',
    skills: ['JavaScript', 'React', 'Figma', 'Webflow', 'CSS', 'Framer Motion', 'Accessibility (a11y)', 'Design Systems'],
    portfolio: [
      { title: 'Norra', category: 'UI/UX Design', description: 'A design system and component library for a fintech onboarding flow.', stack: 'Figma \u00b7 React \u00b7 Storybook', completed: 'Feb 2026' },
      { title: 'GreenCart', category: 'E-commerce', description: 'A sustainable-goods storefront with a custom Webflow CMS build.', stack: 'Webflow \u00b7 CSS \u00b7 JavaScript', completed: 'Nov 2025' },
    ],
    showcase: [
      { title: 'Motion Kit', description: 'An open component kit of accessible, animated UI patterns for React.', stack: 'React \u00b7 Framer Motion \u00b7 CSS', rating: 4.7, views: '510', likes: 133, comments: 9 },
    ],
    experience: [
      { title: 'Internships', description: 'Design intern at a Chennai-based design studio, worked across 4 client projects.' },
      { title: 'Freelance Projects', description: 'Built and designed landing pages and product sites for 6+ small businesses.' },
      { title: 'Open Source', description: 'Maintains a small library of accessible React UI components.' },
    ],
    certifications: ['Google UX Design', 'Webflow Certified Expert'],
    reviews: [
      { name: 'Rhea T.', role: 'Marketing Lead', rating: 4.8, text: 'Aisha turned a messy brief into a beautiful, on-brand site in under two weeks.' },
      { name: 'Vivek S.', role: 'Founder', rating: 4.6, text: 'Great eye for detail and easy to work with across time zones.' },
    ],
    analytics: { portfolioViews: '1.4k', projectViews: '610', hireRequests: 9, projectsCompleted: 19, repeatClients: 4, responseTime: '3.1h' },
    badges: ['\ud83c\udf93 Verified Student', '\ud83d\udca1 Innovation Award'],
    contact: { email: 'aisha.rao@example.com' },
    related: [
      { name: 'Amaya Kapoor', stack: 'React \u00b7 Node.js \u00b7 Python', rating: 4.9, id: 'amaya-kapoor' },
      { name: 'Rohan Kumar', stack: 'React \u00b7 Node.js \u00b7 MongoDB', rating: 4.8, id: 'rohan-kumar' },
      { name: 'Nikhil Sharma', stack: 'Python \u00b7 Django \u00b7 ML', rating: 4.9, id: 'nikhil-sharma' },
    ],
  },

  'nikhil-sharma': {
    name: 'Nikhil Sharma',
    title: 'Python, Django & ML Developer',
    college: 'IIT Bombay',
    branch: 'Computer Science & Engineering',
    year: 'Final Year',
    location: 'Mumbai, India',
    rating: 4.9,
    projectsCompleted: 31,
    hireRequests: 18,
    responseRate: '97%',
    about:
      "I build dependable data products, APIs, and intelligent workflow automation. I like problems where a bit of machine learning genuinely simplifies something people do by hand.",
    careerInterests: "I'm focused on applied ML, backend systems that scale, and internal tools that remove repetitive work for small teams.",
    goals: 'To keep shipping production ML features and eventually work on a data platform team full-time.',
    specialization: 'Django REST APIs, PostgreSQL schema design, classical ML pipelines, and workflow automation.',
    skills: ['Python', 'Django', 'Django REST Framework', 'Machine Learning', 'PostgreSQL', 'Pandas', 'Scikit-learn', 'Docker', 'Git'],
    portfolio: [
      { title: 'GradePredict', category: 'ML Tool', description: 'A model that flags at-risk students early using attendance and assignment data.', stack: 'Python \u00b7 Scikit-learn \u00b7 Django', completed: 'Jan 2026' },
      { title: 'InvoiceFlow', category: 'Automation', description: 'An invoice-parsing pipeline that auto-fills accounting spreadsheets.', stack: 'Python \u00b7 Django \u00b7 PostgreSQL', completed: 'Sep 2025' },
      { title: 'CampusAPI', category: 'Backend', description: 'A REST API powering a college club-management app used by 3 colleges.', stack: 'Django REST Framework \u00b7 PostgreSQL', completed: 'Jul 2025' },
    ],
    showcase: [
      { title: 'SmartSchedule', description: 'A timetable optimizer that resolves clashing sections automatically.', stack: 'Python \u00b7 OR-Tools \u00b7 Django', rating: 4.9, views: '890', likes: 240, comments: 22 },
    ],
    experience: [
      { title: 'Internships', description: 'ML intern at a healthtech startup, built a triage-priority model for support tickets.' },
      { title: 'Freelance Projects', description: 'Delivered backend systems and automation scripts for 5 small businesses.' },
      { title: 'Hackathons', description: 'Won first place at an inter-college hackathon for an ML-based attendance system.' },
      { title: 'Open Source', description: 'Contributes to a Django REST Framework companion library for background jobs.' },
    ],
    certifications: ['AWS Certified Developer', 'DeepLearning.AI ML Specialization', 'PostgreSQL Professional'],
    reviews: [
      { name: 'Meera K.', role: 'Operations Manager', rating: 5.0, text: 'Nikhil automated a process that used to take our team hours every week.' },
      { name: 'Arjun P.', role: 'CTO', rating: 4.8, text: 'Solid backend engineer, writes tests without being asked, communicates clearly.' },
    ],
    analytics: { portfolioViews: '3.1k', projectViews: '1.3k', hireRequests: 18, projectsCompleted: 31, repeatClients: 9, responseTime: '1.8h' },
    badges: ['\ud83c\udfc6 Top Developer', '\u2b50 5 Star Performer', '\ud83c\udf93 Verified Student', '\ud83d\udcbb Full Stack Expert'],
    contact: { email: 'nikhil.sharma@example.com' },
    related: [
      { name: 'Amaya Kapoor', stack: 'React \u00b7 Node.js \u00b7 Python', rating: 4.9, id: 'amaya-kapoor' },
      { name: 'Rohan Kumar', stack: 'React \u00b7 Node.js \u00b7 MongoDB', rating: 4.8, id: 'rohan-kumar' },
      { name: 'Aisha Rao', stack: 'UI/UX \u00b7 Figma \u00b7 CSS', rating: 4.7, id: 'aisha-rao' },
    ],
  },
};
