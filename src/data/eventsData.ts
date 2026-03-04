export interface AttendanceBreakdown {
  department: string;
  count: number;
}

export interface Speaker {
  name: string;
  title: string;
  bio?: string;
}

export interface EventData {
  id: number;
  slug: string;
  title: string;
  date: string;
  displaydate: string;
  time: string;
  location: string;
  attendees: number;
  registrations: number;
  category: string;
  status: 'upcoming' | 'completed';
  description: string;
  detailedDescription?: string;
  image: string;
  gallery?: string[];
  featured?: boolean;
  highlights?: string[];
  speaker?: Speaker;
  speakers: string[];
  topics: string[];
  satisfaction?: number | null;
  form?: string;
  organizer?: string;
  attendance?: {
    total: number;
    breakdown: AttendanceBreakdown[];
  };
}

export const eventsData: EventData[] = [
  {
    id: 1,
    slug: 'ieeextreme-19',
    title: 'IEEEXtreme 19.0',
    date: '2025-10-25',
    displaydate: 'October 25, 2025',
    time: '24-Hour Global Event',
    location: 'Online (Global)',
    attendees: 10000,
    registrations: 2500,
    category: 'Global Coding Marathon',
    status: 'upcoming',
    description:
      "The most awaited 24-hour global coding marathon is BACK! Join thousands of brilliant programmers from around the world as IEEE Student Members compete in an electrifying 24-hour challenge — solving real-world problems, showcasing innovation, and pushing the limits of coding endurance. Guided by IEEE professionals and supported by Student Branches, this is where skill meets strategy and teamwork meets technology!",
    detailedDescription:
      "IEEEXtreme is a global challenge in which teams of IEEE Student members, supported by an IEEE Student Branch, guided by a Coach who is an IEEE member, and proctored by an IEEE member (Proctor), compete in a 24-hour time span against each other to solve a set of programming problems.\n\nThis annual event brings together the brightest minds in computing from across the globe. Participants are challenged to showcase their algorithmic thinking, coding efficiency, and creative problem-solving skills under real-time pressure.\n\nIEEEXtreme 19.0 continues the legacy of excellence, with participants from hundreds of countries competing for global recognition and exclusive prizes. Whether you're a seasoned competitive programmer or a passionate beginner, this event offers a unique opportunity to benchmark yourself against the best in the world.",
    image: 'https://ieeextreme.org/wp-content/uploads/2024/09/ieeextreme-logo.png',
    featured: true,
    highlights: [
      'Global 24-hour coding marathon',
      'Guidance from IEEE professionals',
      'Exclusive prizes and global recognition',
      'Opportunity to network with top developers worldwide',
      'Real-world problem-solving challenges',
      'Team collaboration across borders',
    ],
    speakers: ['IEEE Professionals', 'Student Branch Mentors'],
    topics: ['Competitive Programming', 'Innovation', 'Teamwork', 'Technology'],
    satisfaction: null,
    form: 'https://ieeextreme.org',
    organizer: 'IEEE',
  },
  {
    id: 2,
    slug: 'git-github-workshop',
    title: 'Git & Github Workshop',
    date: '2025-10-15',
    displaydate: 'October 2025',
    time: 'TBD',
    location: 'Lab 2, SFIT',
    attendees: 60,
    registrations: 50,
    category: 'Workshop',
    status: 'upcoming',
    description:
      'A beginner-friendly workshop on Git and Github covering version control, repositories, collaboration workflows, and open-source contributions.',
    detailedDescription:
      "This hands-on workshop is designed for students who want to master version control with Git and collaborative development with GitHub.\n\nParticipants will begin with the fundamentals — understanding what version control is and why it matters — before diving into practical exercises. Topics include initializing repositories, staging and committing changes, working with branches, resolving merge conflicts, and pushing code to GitHub.\n\nThe second half of the workshop focuses on collaborative workflows: pull requests, code reviews, forking repositories, and contributing to open-source projects. By the end of the session, participants will have hands-on experience and a GitHub profile ready to showcase their work.",
    image: 'https://i.postimg.cc/SRpf6kMD/download.jpg',
    featured: false,
    highlights: [
      'Understanding version control fundamentals',
      'Hands-on Git commands and workflows',
      'GitHub repositories and remote collaboration',
      'Branching, merging, and conflict resolution',
      'Pull requests and code review process',
      'Open-source contribution guidelines',
    ],
    speakers: ['Technical Trainer'],
    topics: ['Git Basics', 'GitHub Collaboration', 'Open Source'],
    satisfaction: 87,
    form: '',
    organizer: 'IEEE SFIT Student Branch',
  },
  {
    id: 4,
    slug: 'mosaic-tech-fest',
    title: 'Mosaic (Tech Fest)',
    date: '2025-09-19',
    displaydate: 'October 19–20, 2025',
    time: 'Full Day',
    location: 'College Campus, SFIT',
    attendees: 500,
    registrations: 400,
    category: 'Tech Fest',
    status: 'completed',
    description:
      'The annual college Tech Fest featuring workshops, competitions, exhibitions, and guest lectures. A hub of innovation and creativity.',
    detailedDescription:
      "Mosaic, the annual Tech Fest of SFIT, is a celebration of technology, innovation, and creativity. Spanning two exciting days, the event brings together students, faculty, industry experts, and alumni under one roof.\n\nThe fest features a diverse lineup of events including technical workshops on emerging technologies, coding competitions, project exhibitions, and inspiring talks from industry leaders. From robotics demonstrations to AI showcases, Mosaic covers the full spectrum of modern technology.\n\nThis year's edition saw participation from students across multiple departments, making it one of the most attended and celebrated editions in the fest's history.",
    image: 'https://i.postimg.cc/5yGw4Rgn/Whats-App-Image-2025-10-15-at-10-12-07-7e32472a.jpg',
    featured: false,
    highlights: [
      'Multi-day technology festival',
      'Workshops on emerging technologies',
      'Coding competitions and hackathons',
      'Project exhibitions and demos',
      'Guest lectures from industry experts',
      'Networking with alumni and professionals',
    ],
    speakers: ['Industry Experts', 'Alumni'],
    topics: ['Workshops', 'Tech Exhibitions', 'Competitions'],
    satisfaction: 93,
    form: '',
    organizer: 'SFIT',
  },
  {
    id: 5,
    slug: 'dsa-coding-challenge',
    title: 'DSA Coding Challenge',
    date: '2025-08-20',
    displaydate: 'October 20, 2025',
    time: 'TBD',
    location: 'TBD',
    attendees: 75,
    registrations: 65,
    category: 'Workshop / Competition',
    status: 'upcoming',
    description:
      'A competitive coding challenge focused on Data Structures and Algorithms, testing problem-solving skills and time management.',
    detailedDescription:
      "The DSA Coding Challenge is an intensive competition designed to test participants' knowledge and application of Data Structures and Algorithms under time-constrained conditions.\n\nParticipants will face progressively difficult problems spanning arrays, linked lists, trees, graphs, dynamic programming, and more. Each problem is carefully crafted to evaluate both correctness and efficiency of solutions.\n\nThis event is ideal for students preparing for technical interviews, competitive programming, and anyone who wants to sharpen their algorithmic thinking. The top performers will be recognized and awarded.",
    image:
      'https://i.postimg.cc/X7X20qYR/so-the-image-should-contain-the-words-dsa-challenge.jpg',
    featured: false,
    highlights: [
      'Problems across arrays, trees, graphs, and DP',
      'Timed competitive format',
      'Rankings and leaderboard',
      'Prizes for top performers',
      'Great preparation for technical interviews',
    ],
    speakers: ['Judges', 'Moderators'],
    topics: ['DSA Problems', 'Problem-Solving', 'Algorithms'],
    satisfaction: 88,
    form: '',
    organizer: 'IEEE SFIT Student Branch',
  },
  {
    id: 6,
    slug: 'agentic-ai-workshop',
    title: 'Agentic AI Workshop',
    date: '2025-08-13',
    displaydate: 'August 13, 2025',
    time: '3:00 PM – 5:00 PM',
    location: 'Room 614, SFIT',
    attendees: 68,
    registrations: 68,
    category: 'Workshop',
    status: 'completed',
    description:
      "A comprehensive workshop on Agentic Intelligence led by Mr. Craig D'souza, exploring AI agents and hands-on email automation.",
    detailedDescription:
      "The Agentic AI was organized by IEEE X WIE as an inspiring blend of technology and creativity, perfectly centered around a comprehensive Agentic Intelligence Manifested workshop. The session, led by Mr. Craig D'souza, a B.E. Computer Engineering student from St. Francis Institute of Technology and an enthusiastic AI researcher, brought participants real-world insights into Agentic AI systems while introducing them to this emerging field of AI agents.\n\nDuring this session, attendees explored the foundational understanding of AI agents, difference between traditional AI, generative AI and agentic AI and its core key characteristics. The core agent architecture, the cognitive module, and the model context protocol, the challenges and ethical considerations associated with AI agents, as well as their prospective advancements and future applications were also highlighted.\n\nIn addition, attendees had the opportunity to gain practical experience in building a simple email automation agent using tools such as Python, Gemini Pro API, and Simple Mail Transfer Protocol, making the event even more enriching.",
    image: '/events/agentic-ai-workshop/image1.jpg',
    gallery: [
      '/events/agentic-ai-workshop/image1.jpg',
      '/events/agentic-ai-workshop/image2.jpg',
      '/events/agentic-ai-workshop/image3.jpg',
    ],
    featured: false,
    highlights: [
      'Foundational understanding of AI agents and their key characteristics',
      'Differences between traditional AI, generative AI, and agentic AI',
      'Core agent architecture and cognitive modules',
      'Model Context Protocol (MCP) implementation',
      'Challenges and ethical considerations in AI agents',
      'Hands-on experience building an email automation agent',
      'Practical tools: Python, Gemini Pro API, and SMTP',
    ],
    speaker: {
      name: "Mr. Craig D'souza",
      title: 'B.E. Computer Engineering Student & AI Researcher',
      bio: "A B.E. Computer Engineering student from St. Francis Institute of Technology and an enthusiastic AI researcher with expertise in Agentic AI systems. Craig led participants through a hands-on exploration of AI agent architectures, bridging theory and real-world application.",
    },
    speakers: ["Mr. Craig D'Souza"],
    topics: ['Agentic AI', 'AI Agents', 'Python Automation', 'Gemini Pro API', 'MCP'],
    satisfaction: 85,
    form: '',
    organizer: 'IEEE X WIE SFIT',
    attendance: {
      total: 68,
      breakdown: [
        { department: 'CMPN', count: 25 },
        { department: 'INFT', count: 17 },
        { department: 'AIML', count: 11 },
        { department: 'EXTC', count: 8 },
        { department: 'ELEC', count: 4 },
        { department: 'ECS', count: 3 },
        { department: 'MECH', count: 0 },
      ],
    },
  },
  {
    id: 7,
    slug: 'committee-induction-meet',
    title: 'Committee Induction Meet',
    date: '2025-07-24',
    displaydate: 'July 24, 2025',
    time: 'TBD',
    location: 'SFIT Campus',
    attendees: 50,
    registrations: 45,
    category: 'Orientation',
    status: 'completed',
    description:
      'An induction meet to introduce committee members, deliver their roles, share the organizational vision, and foster collaboration.',
    detailedDescription:
      "The Committee Induction Meet marked the official onboarding of the new IEEE SFIT Student Branch committee for the academic year. New members were formally welcomed, introduced to the chapter's mission and vision, and briefed on their roles and responsibilities.\n\nThe session featured interactive activities designed to build team cohesion and a shared sense of purpose. Senior members shared insights about past events, ongoing initiatives, and the roadmap for the year ahead.",
    image: 'https://i.postimg.cc/Z5KFxJf5/download-1.jpg',
    featured: false,
    highlights: [
      'Formal induction of new committee members',
      'Role assignments and responsibilities briefing',
      'Vision and roadmap for the academic year',
      'Team-building activities',
      'Insights from senior members',
    ],
    speakers: ['Committee Heads'],
    topics: ['Team Roles', 'Vision Sharing', 'Collaboration'],
    satisfaction: 90,
    form: '',
    organizer: 'IEEE SFIT Student Branch',
  },
  {
    id: 8,
    slug: 'techno-art-showdown',
    title: 'Techno Art Showdown',
    date: '2024-08-23',
    displaydate: 'August 23, 2024',
    time: '1:00 PM – 5:00 PM',
    location: 'Room 602, SFIT',
    attendees: 100,
    registrations: 100,
    category: 'Competition / Workshop',
    status: 'completed',
    description:
      'A groundbreaking fusion of technology and creativity on National Space Day, featuring a digital art contest and virtual treasure hunt.',
    detailedDescription:
      "Celebrated on National Space Day, the Techno Art Showdown was a unique event that united technology with artistic expression. Organized by IEEE SFIT Student Branch and WIE, the event challenged participants to explore the intersection of code and creativity.\n\nPhase 1 featured a digital art contest where participants used technology tools to create space-themed artworks, blending their technical and creative skills. Phase 2 was an immersive virtual treasure hunt that tested participants' problem-solving and teamwork abilities in a digitally crafted environment.\n\nThe event celebrated innovation in a non-traditional format, proving that technology and art are powerful when combined.",
    image:
      'https://i.postimg.cc/QtHvHCdW/The-IEEE-Student-Branch-WIE-conducted-the-Techno-Art-Showdown-Phase-1-Techno-Art-Showdown-showca.jpg',
    featured: false,
    highlights: [
      'Digital art contest with space theme',
      'Virtual treasure hunt challenge',
      'Fusion of technology and creativity',
      'Celebrated on National Space Day',
      'Team and individual participation',
    ],
    speakers: ['IEEE SFIT Student Branch', 'WIE'],
    topics: ['Creativity', 'Technology', 'Digital Art', 'Innovation'],
    satisfaction: 88,
    form: '',
    organizer: 'IEEE SFIT Student Branch & WIE',
  },
  {
    id: 9,
    slug: 'radiant-rumble',
    title: 'Radiant Rumble',
    date: '2023-09-15',
    displaydate: 'September 15–16, 2023',
    time: 'TBD',
    location: 'Room 613–614, SFIT',
    attendees: 80,
    registrations: 80,
    category: 'Competition',
    status: 'completed',
    description:
      'A unique competition blending technology and athleticism, played under Radium lights to promote teamwork, innovation, and adaptability.',
    detailedDescription:
      "Radiant Rumble was a one-of-a-kind event that merged physical challenge with technological thinking, all set under the glow of radium lights for a truly immersive experience.\n\nTeams navigated through a series of challenges that required not just physical agility but also quick thinking, creative problem-solving, and effective communication. The neon-lit environment added an electrifying atmosphere that made every challenge more thrilling.\n\nThe event brought out the best in participants — pushing their limits, fostering teamwork, and celebrating the spirit of innovation in an unconventional setting.",
    image: 'https://i.postimg.cc/C1sSszVr/Radiant-Rumble.jpg',
    featured: false,
    highlights: [
      'Neon radium-light environment',
      'Physical and intellectual challenges',
      'Team-based format',
      'Creative problem-solving under pressure',
      'Innovation beyond the classroom',
    ],
    speakers: ['IEEE SFIT Student Branch Organizers'],
    topics: ['Teamwork', 'Innovation', 'Problem-Solving', 'Technology'],
    satisfaction: 90,
    form: '',
    organizer: 'IEEE SFIT Student Branch',
  },
  {
    id: 10,
    slug: 'inquizitive',
    title: 'InQUIZitive',
    date: '2022-04-09',
    displaydate: 'April 9, 2022',
    time: '11:00 AM – 5:00 PM',
    location: 'Google Meet (Online)',
    attendees: 45,
    registrations: 45,
    category: 'Quiz Competition',
    status: 'completed',
    description:
      'Online technical quiz competition by IEEE Techess, with 7 teams of 2, covering technology, GK, and current affairs.',
    detailedDescription:
      "InQUIZitive was an online technical quiz competition hosted by IEEE Techess, bringing together curious minds for a day of knowledge and friendly competition.\n\nThe competition featured 7 teams of 2 participants each, battling through multiple rounds of questions spanning technology, general knowledge, and current affairs. Each round was designed to challenge both domain-specific knowledge and broader awareness.\n\nThe event fostered healthy competition and intellectual growth, with participants discovering new areas of knowledge through each question. It was a celebration of curiosity and the IEEE spirit of lifelong learning.",
    image: 'https://i.postimg.cc/BnmFMnJ6/Inquizitive.jpg',
    featured: false,
    highlights: [
      '7 competing teams of 2 participants each',
      'Multiple rounds covering technology and GK',
      'Current affairs and technical knowledge tested',
      'Online format via Google Meet',
      'Friendly but competitive atmosphere',
    ],
    speakers: ['IEEE Techess', 'Guest Experts'],
    topics: ['Technology', 'GK', 'Current Affairs', 'Quiz'],
    satisfaction: 87,
    form: '',
    organizer: 'IEEE Techess, SFIT',
  },
];

export function getEventBySlug(slug: string): EventData | undefined {
  return eventsData.find((e) => e.slug === slug);
}
