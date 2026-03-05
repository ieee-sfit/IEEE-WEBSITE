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
    id: 2,
    slug: 'git-github-workshop',
    title: 'Git & Github Workshop',
    date: '2025-10-08',
    displaydate: 'October 8, 2025',
    time: 'TBD',
    location: 'Lab 2, SFIT',
    attendees: 60,
    registrations: 50,
    category: 'Workshop',
    status: 'completed',
    description:
      'A beginner-friendly workshop on Git and Github covering version control, repositories, collaboration workflows, and open-source contributions.',
    detailedDescription:
      "This hands-on workshop is designed for students who want to master version control with Git and collaborative development with GitHub.\n\nParticipants will begin with the fundamentals — understanding what version control is and why it matters — before diving into practical exercises. Topics include initializing repositories, staging and committing changes, working with branches, resolving merge conflicts, and pushing code to GitHub.\n\nThe second half of the workshop focuses on collaborative workflows: pull requests, code reviews, forking repositories, and contributing to open-source projects. By the end of the session, participants will have hands-on experience and a GitHub profile ready to showcase their work.",
    image: 'https://i.postimg.cc/7hg0dnBH/create-an-image-for-git-github-workshop.jpg',
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
    attendees: 136,
    registrations: 136,
    category: 'Competition / Workshop',
    status: 'completed',
    description:
      'A groundbreaking fusion of technology and creativity on National Space Day — featuring a Creativity with Pixels Digital Art Contest and a Virtual Treasure Hunt, celebrating the cosmos through code and art.',
    detailedDescription:
      "Techno Art Showdown — National Space Day Special\n\nOn National Space Day, IEEE SFIT conducted the Techno Art Showdown, a groundbreaking fusion of technology and creativity that captivated participants and spectators alike. Held in honor of the day dedicated to exploring the cosmos, this event showcased a unique blend of technical prowess and artistic expression.\n\nThe event took place offline in Room 602 in a dynamic two-phase format.\n\nPhase 1 — Creativity with Pixels (Digital Art Contest)\n\nParticipants channelled their imagination through digital tools to create space-themed artworks, blending technical skills with artistic creativity. The contest celebrated individual expression and design thinking.\n\nDigital Art Winners:\n• Shriya Saxena (TE, CMPN-B)\n• Scania Dsilva (TE, CMPN-A)\n• Roshit Jain (TE, ELEC-A)\n• Annie Dande (SE, INFT-A)\n\nPhase 2 — Virtual Treasure Hunt\n\nTeams raced through a digitally crafted treasure hunt that tested problem-solving, teamwork, and quick thinking in a fun competitive format.\n\nTreasure Hunt Winners:\n🥇 1st Place — Aditya Shinde, Swapnil Singh, Rahul & Ansley Rebello (TE, CMPN-B)\n🥈 2nd Place — Steve, Noel & Siddhant Rangole (SE, CMPN-B)\n\nThe event concluded with prize distribution for exceptional performances. The success of the Techno Art Showdown underscored the growing interest in blending technology with creative pursuits and highlighted IEEE SFIT's commitment to fostering innovation and exploration in both fields.",
    image:
      'https://i.postimg.cc/QtHvHCdW/The-IEEE-Student-Branch-WIE-conducted-the-Techno-Art-Showdown-Phase-1-Techno-Art-Showdown-showca.jpg',
    gallery: [
      '/events/techno-art-showdown/image1.jpg',
      '/events/techno-art-showdown/image2.jpg',
      '/events/techno-art-showdown/image3.jpg',
      '/events/techno-art-showdown/image4.jpg',
      '/events/techno-art-showdown/image5.jpg',
    ],
    featured: false,
    highlights: [
      '136 participants across CMPN, INFT, EXTC, ELEC & MECH',
      'Celebrated on National Space Day (August 23, 2024)',
      'Phase 1: Creativity with Pixels — space-themed Digital Art Contest',
      'Phase 2: Virtual Treasure Hunt with team-based challenges',
      'Individual and team prizes for top performers',
      'Fusion of technical skill with artistic expression',
      'Organized by IEEE SFIT Student Branch',
    ],
    speakers: ['IEEE SFIT Student Branch Organizers'],
    topics: ['Digital Art', 'Virtual Treasure Hunt', 'Creativity', 'Technology', 'National Space Day'],
    satisfaction: 88,
    form: '',
    organizer: 'IEEE SFIT Student Branch',
    attendance: {
      total: 136,
      breakdown: [
        { department: 'CMPN', count: 31 },
        { department: 'INFT', count: 37 },
        { department: 'EXTC', count: 31 },
        { department: 'ELEC', count: 31 },
        { department: 'MECH', count: 6 },
      ],
    },
  },
  {
    id: 9,
    slug: 'radiant-rumble',
    title: 'Radiant Rumble',
    date: '2023-09-15',
    displaydate: 'September 15–16, 2023',
    time: '9:00 AM – 5:00 PM',
    location: 'Rooms 613, 614 & 615, SFIT',
    attendees: 306,
    registrations: 306,
    category: 'Competition',
    status: 'completed',
    description:
      'A Glow-Ring Football Tournament organized by IEEE SFIT Student Branch for Mosaic 2023 — played under UV black lights with glowing vests, reflective footballs, and a technical buzzer toss across two electrifying days.',
    detailedDescription:
      "RADIANT RUMBLE: A Glow-Ring Football Tournament\n\nRadiant Rumble was organized by the IEEE SFIT Student Branch (ISSB) for Mosaic 2023. In contrast to traditional ring football, Glow Ring-Football is played in a unique setting where the playing field is illuminated by UV black light and marked with reflective tape. This distinct version involved two teams of three players each, competing in a dimly lit room.\n\nEach player was given a glow-stick band in their team colour and a UV-reflective vest. The football itself was also UV-reflective. As part of the Mosaic technical spirit, teams completed a technical buzzer challenge instead of a traditional coin toss — the team that buzzed first and answered correctly chose their side and kicked off the game. Matches were conducted simultaneously on two grounds in Rooms 614 and 615, while participants waited and assembled in Room 613.\n\nDay 1 — September 15, 2023\n\nFollowing the Mosaic inauguration, the first round of the tournament commenced. Each match was played for 5 minutes, and the winning team qualified for the next round. Faculty members also joined in friendly matches between rounds to show their support and add to the energy. The day concluded with the completion of the first round and the start of several second-round matches.\n\nDay 2 — September 16, 2023\n\nQualified teams returned for the knockout rounds. Second and third knockout rounds were played simultaneously on both grounds. After navigating through those, winners advanced to the fourth knockout round. The triumphant teams from the fourth round competed in the semifinals to secure a finals spot. The two teams knocked out in the semifinals played a third-place match.\n\nThe event concluded with great success as ISSB Core members awarded the winners with cash prizes, footballs, and football jerseys.",
    image: 'https://i.postimg.cc/C1sSszVr/Radiant-Rumble.jpg',
    gallery: [
      '/events/radiant-rumble/image1.jpg',
      '/events/radiant-rumble/image2.jpg',
      '/events/radiant-rumble/image3.jpg',
      '/events/radiant-rumble/image4.jpg',
      '/events/radiant-rumble/image5.jpg',
    ],
    featured: false,
    highlights: [
      '306 students registered across SFIT and other colleges',
      'UV black light arena with glowing vests, bands & reflective football',
      'Technical buzzer toss instead of a coin flip',
      'Matches played simultaneously on two grounds (Rooms 614 & 615)',
      'Multi-day knockout tournament — Round 1 through Finals',
      'Faculty friendly matches between rounds',
      'Winners awarded cash prizes, footballs & football jerseys',
    ],
    speakers: ['IEEE SFIT Student Branch Core Members'],
    topics: ['Glow Ring Football', 'Knockout Tournament', 'Technology + Sport', 'Teamwork', 'Mosaic 2023'],
    satisfaction: 90,
    form: '',
    organizer: 'IEEE SFIT Student Branch (ISSB)',
    attendance: {
      total: 306,
      breakdown: [
        { department: 'CMPN', count: 79 },
        { department: 'INFT', count: 77 },
        { department: 'EXTC', count: 68 },
        { department: 'ELEC', count: 9 },
        { department: 'MECH', count: 6 },
        { department: 'Other College', count: 67 },
      ],
    },
  },
  {
    id: 10,
    slug: 'inquizitive',
    title: 'InQUIZitive',
    date: '2022-04-09',
    displaydate: 'April 9, 2022',
    time: '11:00 AM – 5:00 PM',
    location: 'Google Meet (Online)',
    attendees: 54,
    registrations: 14,
    category: 'Quiz Competition',
    status: 'completed',
    description:
      "IEEE Techess & SFIT Student Branch's first flagship online quiz — 7 teams competed across two rounds of technology, GK, and current affairs questions, with a special guest lecture and prize distribution.",
    detailedDescription:
      "InQUIZITIVE: Discover the Prodigy Among Us\n\nSt. Francis Institute of Technology (SFIT) launched its first-ever female-centric technical community 'Techess', aimed at giving opportunities to female engineers and inspiring them to achieve their goals. The Techess Community, along with the IEEE SFIT Student Branch, organized InQUIZitive as their first flagship event for the academic year on Saturday, 9th April 2022, conducted over Google Meet with 14 participants and an audience of 40.\n\nThe session began at 11:00 AM, with Techess member Ms. Balin Menezes welcoming all the audience and introducing the event. This was followed by a short welcoming speech by Ms. Preksha Prakash, Chairperson of Techess. Before starting the competition, Ms. Simran Dubey explained the rules and regulations to all participants.\n\nRound 1 — General Quiz\n\nThere were 7 teams of two members each. Every team was asked 10 questions based on technology, general knowledge, and current affairs. Each correct answer was worth 10 points, and each team had 2 lifelines. The time limit per question was 45 seconds. If a team exceeded the time limit, they received zero points for that question.\n\nLifeline 1 — Swap the Question: The current question was swapped with a new one.\nLifeline 2 — Expert Advice: Experts Ms. Anushka Somvanshi and Mr. Sahil Sawant (ex-members of IEEE SFIT Student Branch) assisted teams.\n\nRound 1 Results:\n• Semil Shah & Vishakha Mistry — 90/100\n• Jash Tailor & Abraham Thothiyil — 80/100\n• Gaurav Yadav & Rahul Biya — 70/100\n• Tripti Nayak & Lian Sequeira — 65/100\n• Arsalan Haidery & Amogh Vartak — 55/100\n\nThe top three teams advanced to the Final Round.\n\nRound 2 — Fastest Buzzer Final Showdown\n\nThe second part of the session started at 3:00 PM, preceded by an amazing musical performance of 'Saath Surr'. The Final Showdown was a Fastest Buzzer Round conducted using 'justbuzz.in'. Three teams competed across 15 questions of increasing difficulty, each worth 10 points.\n\nBuzzer Rules: First buzz and correct answer = 10 points. First buzz but no answer within 5 seconds = −5 points. Second buzz and correct answer = 5 points.\n\nFinal Round Results:\n• Gaurav Yadav & Rahul Biya — 45 points 🏆 1st Place\n• Semil Shah & Vishakha Mistry — 30 points 🥈 2nd Place\n• Jash Tailor & Abraham Thothiyil — −5 points\n\nGuest Lecture & Prize Distribution\n\nIEEE Techess in collaboration with the SFIT Alumni Association invited guest speaker Ms. Joann Martins, Technical Lead CMATS Design R1 at Airservices Australia. She shared her professional journey, motivated the audience, and announced the winners. Gaurav Yadav & Rahul Biya won the first prize of ₹1,250 cash and certificates. Semil Shah & Vishakha Mistry won the second prize of ₹750 cash and certificates. The event concluded at 5:00 PM with a vote of thanks by Ms. Vaishnavi Puthran and a quick photo session.",
    image: 'https://i.postimg.cc/BnmFMnJ6/Inquizitive.jpg',
    gallery: [
      '/events/inquizitive/image1.jpg',
      '/events/inquizitive/image2.jpg',
      '/events/inquizitive/image3.jpg',
      '/events/inquizitive/image4.jpg',
      '/events/inquizitive/image5.jpg',
    ],
    featured: false,
    highlights: [
      '7 teams of 2 participants competed across two rounds',
      'Round 1: 10 questions on technology, GK & current affairs (45-sec limit)',
      '2 lifelines per team — Swap Question & Expert Advice',
      'Round 2: Fastest Buzzer Showdown on justbuzz.in with 15 questions',
      'Guest lecture by Ms. Joann Martins, Technical Lead at Airservices Australia',
      'Winners: Gaurav Yadav & Rahul Biya (₹1,250), Semil & Vishakha (₹750)',
      'Musical performance of "Saath Surr" between rounds',
    ],
    speaker: {
      name: 'Ms. Joann Martins',
      title: 'Technical Lead CMATS Design R1, Airservices Australia',
      bio: 'Ms. Joann Martins is an SFIT alumna and Technical Lead at Airservices Australia. She shared her professional journey and motivated participants with insights on building a career in technology, and announced the winners of InQUIZitive.',
    },
    speakers: ['Ms. Joann Martins', 'Ms. Anushka Somvanshi', 'Mr. Sahil Sawant'],
    topics: ['Technology', 'General Knowledge', 'Current Affairs', 'Quiz Competition', 'Buzzer Round'],
    satisfaction: 87,
    form: '',
    organizer: 'IEEE Techess & IEEE SFIT Student Branch',
    attendance: {
      total: 14,
      breakdown: [
        { department: 'CMPN', count: 6 },
        { department: 'INFT', count: 6 },
        { department: 'EXTC', count: 2 },
      ],
    },
  },
  {
    id: 12,
    slug: 'debugging-communication-skills',
    title: 'Debugging Your Communication Skills',
    date: '2026-03-10',
    displaydate: 'March 10, 2026',
    time: '3:00 PM – 5:00 PM',
    location: 'Room 618, SFIT',
    attendees: 30,
    registrations: 0,
    category: 'Workshop',
    status: 'upcoming',
    description:
      'An interactive session by IEEE × WIE SFIT designed to help students understand the importance of effective communication in technical careers — covering verbal, non-verbal, and practical techniques through hands-on activities.',
    detailedDescription:
      "Debugging Your Communication Skills\nConducted by IEEE × WIE Student Branch, SFIT\n\nIn today's professional world, technical expertise alone is not enough. The ability to clearly articulate ideas, present concepts, and communicate confidently plays a crucial role in interviews, internships, and leadership roles. This interactive session, conducted by Ishita Dcosta, combines conceptual understanding with practical activities to ensure active participation and real-time learning.\n\nSession Flow\n\nThe session begins with an engaging ice breaker to warm up the room and set an open, interactive tone.\n\nPart I — Verbal Communication\n\nFocuses on clarity, structured responses, and confident speaking. Participants work through a practical activity designed to practise concise, organised expression under real-time conditions.\n\nPart II — Non-Verbal Communication\n\nCovers body language, eye contact, posture, and voice modulation — the silent signals that shape how you are perceived. A hands-on activity helps participants recognise and refine their non-verbal cues.\n\nPart III — Practical Techniques\n\nIntroduces actionable strategies to improve fluency, reduce nervousness, and build daily communication habits that compound over time. The part concludes with a reinforcement activity to consolidate all three skill areas.\n\nThe session wraps up with a brief feedback and reflection segment, giving participants a moment to internalise what they have learned and identify one habit to carry forward.",
    image: 'https://placehold.co/800x500/7c3aed/ffffff?text=Coming+Soon',
    gallery: [],
    featured: true,
    highlights: [
      'Interactive ice breaker to kick off the session',
      'Part I: Verbal Communication — clarity & structured responses',
      'Part II: Non-Verbal Communication — body language & voice modulation',
      'Part III: Practical techniques to reduce nervousness & build habits',
      'Hands-on activity for each part',
      'Feedback & reflection segment at the close',
      'Conducted by Ishita Dcosta, IEEE × WIE SFIT',
    ],
    speakers: ['Ishita Dcosta'],
    topics: ['Verbal Communication', 'Non-Verbal Communication', 'Interview Skills', 'Confidence Building', 'Professional Communication'],
    satisfaction: null,
    form: '',
    organizer: 'IEEE × WIE SFIT Student Branch',
  },
  {
    id: 13,
    slug: 'inquisite-women-in-history',
    title: 'Inquisite – Women in History',
    date: '2026-03-13',
    displaydate: 'March 13, 2026',
    time: '1:00 PM – 5:00 PM',
    location: 'Room 618, SFIT',
    attendees: 40,
    registrations: 0,
    category: 'Quiz Competition',
    status: 'upcoming',
    description:
      'A WIE flagship quiz competition celebrating the contributions of women in technology — from computing pioneers to modern innovators — across multiple engaging rounds including rapid fire, visual identification, and audience participation.',
    detailedDescription:
      "Inquisite – Women in History\nWIE Quiz Competition\n\nThis flagship event under the WIE banner is designed to recognise and celebrate the invaluable contributions of women in technology throughout history and in contemporary times. The quiz shines a spotlight on women pioneers across computing, artificial intelligence, electronics, space research, innovation, and entrepreneurship — figures whose breakthroughs shaped the modern world but often remain underrepresented in mainstream narratives.\n\nEvent Format\n\nThe competition features multiple engaging rounds carefully designed to test depth of knowledge while keeping the atmosphere energetic and inclusive:\n\n• Technical Knowledge Round — in-depth questions on the scientific and engineering achievements of women in technology\n• Rapid Fire Round — fast-paced questions to test recall and quick thinking\n• Visual Identification Round — identify pioneering women from images, equations, and inventions\n• Audience Participation Round — ensures attendees are as engaged as competitors, making the event a shared celebration rather than just a contest\n\nMission Alignment\n\nThe event directly reflects WIE's four-pillar mission — to Inspire, Engage, Encourage, and Empower women in engineering and technology. By bringing these stories into a competitive, celebratory format, Inquisite aims to spark curiosity, foster pride, and motivate students to see themselves in the legacy of the women they are studying.",
    image: 'https://placehold.co/800x500/9333ea/ffffff?text=Coming+Soon',
    gallery: [],
    featured: false,
    highlights: [
      'Celebrates women pioneers in computing, AI, space & entrepreneurship',
      'Technical Knowledge, Rapid Fire & Visual Identification rounds',
      'Audience Participation round for full-room engagement',
      'Aligns with WIE\'s mission to Inspire, Engage, Encourage & Empower',
      'Flagship WIE event for 2026',
    ],
    speakers: ['WIE SFIT Organizers'],
    topics: ['Women in Technology', 'History of Computing', 'AI Pioneers', 'Space Research', 'Entrepreneurship', 'Quiz Competition'],
    satisfaction: null,
    form: '',
    organizer: 'WIE SFIT Student Branch',
  },
  {
    id: 11,
    slug: 'neon-kickoff',
    title: 'Neon Kickoff',
    date: '2025-10-17',
    displaydate: 'October 17–18, 2025',
    time: 'During Mosaic 2025',
    location: 'SFIT Campus',
    attendees: 83,
    registrations: 83,
    category: 'Competition',
    status: 'completed',
    description:
      'A 3-vs-3 mini football tournament under UV/LED arena lights — Neon Kickoff blended sport, technology, and a glow-fest vibe with technical QR riddle-based tosses, Golden Minutes, Mystery Ball rounds, and live digital scoring.',
    detailedDescription:
      "NEON KICKOFF: 3v3 UV Football under the Glow\n\nNeon Kickoff was organised by the IEEE SFIT Student Branch as part of Mosaic 2025 — a high-energy 3-vs-3 mini football tournament played in a glowing arena under UV floodlights and LED strips. The field, goalposts, ball, and player jerseys all illuminated under black light, creating a visually electrifying atmosphere that fused competitive sport with a tech-fest vibe.\n\nField & Setup\n\nThe arena was approximately 20 m × 12 m (mini futsal size), with boundaries marked using UV glow tape and LED ropes. Goalposts stood 4 ft (H) × 6 ft (W) as glowing mini-goals. Each team wore distinct neon jerseys and glow bands (neon green vs neon pink), and the ball was a fluorescent glow-in-the-dark football. Laser-tag foul markers lined the sides of the field.\n\nGame Format & Rules\n\nEach match lasted 13 minutes — a 3-minute technical challenge followed by a 10-minute football match. Before kick-off, one player from each team scanned QR codes to unlock a riddle; the first team to solve it won toss advantage and a free kick at the start. Each team fielded 3 players: attacker, midfielder, and defender.\n\nScoring System:\n• Normal Goal = 1 point\n• Golden Minute Goal = 2 points (with special sound & light effects)\n• Mystery Ball Goal = 3 points (different colour ball, extra fanfare)\n• Long-range shot from midline circle = +2 bonus points\n\nFouls & Penalties:\n• Push, handball, or slide tackle = Free kick\n• Crossing the laser-tag foul section = Foul\n• Draws → Penalty shootout (3 kicks per team) with obstacles in front of goalpost\n\nMatches concluded at 10 minutes or when a team first reached 10 goals. An on-field referee and a scorer/announcer tracked the live score.\n\nTechnical & Creative Add-ons\n\nA projector/LED screen displayed live scores and team names. A leaderboard tracked teams with the most goals and fastest times. Background music played throughout, with louder beats for goals. Volunteers roamed the arena with scorecards showing each team's tally for crowd engagement.\n\nSummary — Rocket League Side Game\n\nA side e-sports station was set up in the waiting room for teams not currently playing. Participants could challenge each other on Rocket League — a football video game where cars play soccer in a glowing arena — keeping the football & glow theme alive even off the main field. Managed by a dedicated volunteer, the mini e-sports corner offered 1v1 or 2v2 matches (5–10 minutes each), with a leaderboard for the highest scorer of the day.",
    image: 'https://i.postimg.cc/5yGw4Rgn/Whats-App-Image-2025-10-15-at-10-12-07-7e32472a.jpg',
    gallery: [
      '/events/neon-kickoff/image1.jpg',
      '/events/neon-kickoff/image2.jpg',
      '/events/neon-kickoff/image3.jpg',
      '/events/neon-kickoff/image4.jpg',
      '/events/neon-kickoff/image5.jpg',
    ],
    featured: false,
    highlights: [
      '83 participants from CMPN, INFT, EXTC, MECH, AIML, ECS & ELEC',
      'UV/LED glowing arena — field, ball, jerseys & goalposts all illuminated',
      'Technical QR riddle-based toss challenge before each match',
      '3-vs-3 format with attacker, midfielder & defender roles',
      'Golden Minutes (2× goals) and Mystery Ball (3× goals) power-up rounds',
      'Laser-tag foul sensors along the field boundary',
      'Live projector scoreboard + volunteer scorecards for crowd engagement',
      'Rocket League e-sports side station in the waiting room',
      'Prizes for Winners and Runner-Up teams',
    ],
    speakers: ['IEEE SFIT Student Branch Organizers'],
    topics: ['3v3 Football', 'UV Arena', 'Technical Toss', 'Golden Minutes', 'Mystery Ball', 'Rocket League', 'Mosaic 2025'],
    satisfaction: 91,
    form: '',
    organizer: 'IEEE SFIT Student Branch',
    attendance: {
      total: 83,
      breakdown: [
        { department: 'CMPN', count: 32 },
        { department: 'EXTC', count: 16 },
        { department: 'INFT', count: 16 },
        { department: 'MECH', count: 8 },
        { department: 'AIML', count: 8 },
        { department: 'ECS', count: 2 },
        { department: 'ELEC', count: 1 },
      ],
    },
  },
];

export function getEventBySlug(slug: string): EventData | undefined {
  return eventsData.find((e) => e.slug === slug);
}
