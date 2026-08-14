import React, { useState, useEffect, useRef } from 'react';
import { Linkedin, Mail, Github, Award, Users, Star, ChevronDown, Instagram, Frown, X, BookOpen, GraduationCap } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';


// --- TYPE DEFINITIONS ---
interface SocialLinks {
    linkedin: string;
    email: string;
    github: string;
    instagram: string;
    googleScholar?: string;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    category: string;
    year: string;
    branch: string;
    image: string;
    bio: string;
    achievements: string[];
    skills: string[];
    social: SocialLinks;
    featured: boolean;
    committee: string;
    resume?: string;
    responsibilities?: string[];
}

function TeamLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center ">
            <p className="text-xl text-black-700 flex items-center">
                Loading Team Members
                <span className="flex space-x-2 ml-4">
                    <span className="animate-bounce text-4xl md:text-5xl">.</span>
                    <span className="animate-bounce [animation-delay:200ms] text-4xl md:text-5xl">.</span>
                    <span className="animate-bounce [animation-delay:400ms] text-4xl md:text-5xl">.</span>
                </span>
            </p>
        </div>
    );
}

// --- MODAL COMPONENT ---
function MemberModal({ member, isOpen, onClose }: { member: TeamMember | null; isOpen: boolean; onClose: () => void }) {
    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto overflow-x-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors shadow-lg">
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex flex-col lg:flex-row">
                    {/* Left — Image */}
                    <div className="lg:w-2/5 relative">
                        {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-80 lg:h-full object-cover object-center rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none" />
                        ) : (
                            <div className="w-full h-80 lg:h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-indigo-200 flex items-center justify-center">
                                    <Users className="w-16 h-16 text-indigo-500" />
                                </div>
                            </div>
                        )}
                        {member.featured && (
                            <div className="absolute top-6 left-6">
                                <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-full shadow-lg">
                                    <Star className="w-4 h-4 mr-2" />
                                    {member.category === 'convenor' ? member.role : 'Core'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — Info */}
                    <div className="lg:w-3/5 p-6 sm:p-8 lg:p-10">
                        <div className="mb-6">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">{member.name}</h2>
                            <p className="text-blue-600 font-semibold text-base sm:text-lg mb-2">
                                {member.category === 'faculty'
                                    ? member.role
                                    : `${member.committee.toLowerCase() === 'ieeexwie' ? 'IEEE x WIE' : member.committee} — ${member.category === 'convenor' ? member.role
                                        : member.category === 'core' ? member.role
                                            : member.category === 'pr' ? `PR ${member.role}`
                                                : `${member.category.charAt(0).toUpperCase() + member.category.slice(1)} ${member.role}`
                                    }`}
                            </p>
                            {(member.year || member.branch) && (
                                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">{[member.year, member.branch].filter(Boolean).join(' • ')}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="mb-6">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">About</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{member.bio}</p>
                        </div>

                        {/* Roles & Responsibilities */}
                        {member.responsibilities && member.responsibilities.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">Roles & Responsibilities</h3>
                                <ul className="space-y-2">
                                    {member.responsibilities.map((r, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                            <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Skills */}
                        {member.skills && member.skills.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {member.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-2 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resume */}
                        {member.resume && (
                            <div className="mb-6">
                                <a href={member.resume} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium text-sm sm:text-base">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    View Resume / CV
                                </a>
                            </div>
                        )}

                        {/* Social Links */}
                        <div className="mb-6">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">Connect</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {member.social.linkedin && member.social.linkedin !== "#" && member.social.linkedin !== "NA" && (
                                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                                        <Linkedin className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">LinkedIn</span>
                                    </a>
                                )}
                                {member.social.googleScholar && member.social.googleScholar !== "#" && member.social.googleScholar !== "NA" && (
                                    <a href={member.social.googleScholar} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md">
                                        <GraduationCap className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">Google Scholar</span>
                                    </a>
                                )}
                                {member.social.github && member.social.github !== "#" && member.social.github !== "NA" && (
                                    <a href={member.social.github} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors shadow-md">
                                        <Github className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">GitHub</span>
                                    </a>
                                )}
                                {member.social.instagram && member.social.instagram !== "#" && member.social.instagram !== "NA" && (
                                    <a href={member.social.instagram} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-md">
                                        <Instagram className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">Instagram</span>
                                    </a>
                                )}
                                {member.social.email && member.social.email !== "#" && member.social.email !== "NA" && (
                                    <a href={member.social.email.startsWith('mailto:') ? member.social.email : `mailto:${member.social.email}`}
                                        className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md">
                                        <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">Email</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- ORG CHART COMPONENT ---
function OrgChart({
    convenors,
    techRep,
    onMemberClick,
    onDomainClick,
}: {
    convenors: TeamMember[];
    techRep: TeamMember;
    onMemberClick: (m: TeamMember) => void;
    onDomainClick: (category: string) => void;
}) {
    const domains = [
        { key: 'technical', label: 'Technical' },
        { key: 'pr', label: 'PR' },
        { key: 'social media', label: 'Social Media' },
        { key: 'creative', label: 'Creative' },
        { key: 'marketing', label: 'Marketing' },
    ];

    const VLine = () => <div className="w-px h-7 bg-gray-300 mx-auto" />;

    return (
        <div className="max-w-xl mx-auto px-4 py-2">
            <div className="text-center mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Organization</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Committee <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Structure</span></h2>
                <p className="text-xs text-gray-400 mt-2">Click a highlighted card to view profile · Click a domain to see members</p>
            </div>

            <div className="flex flex-col items-center">

                {/* Director — label only */}
                <div className="w-64 sm:w-72 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-6 py-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Director</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Bro. Shantilal Kujur</p>
                    <p className="text-xs text-gray-400 mt-0.5">St. Francis Institute of Technology</p>
                </div>
                <VLine />

                {/* Principal — label only */}
                <div className="w-64 sm:w-72 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-6 py-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Principal</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Dr. Deepak Jayaswal</p>
                    <p className="text-xs text-gray-400 mt-0.5">St. Francis Institute of Technology</p>
                </div>
                <VLine />

                {/* Tech Rep — clickable */}
                <button
                    onClick={() => onMemberClick(techRep)}
                    className="w-64 sm:w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-blue-600 rounded-xl px-6 py-4 text-center shadow-sm hover:shadow-md hover:bg-blue-50/50 transition-all group"
                >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">Faculty Technical Representative</p>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700">{techRep.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Faculty Technical Representative, SFIT</p>
                    <p className="text-[10px] text-blue-500 mt-2 font-semibold">View Profile →</p>
                </button>
                <VLine />

                {/* Convenors — fork branch */}
                <div className="w-full max-w-xs sm:max-w-sm">
                    <div className="flex">
                        <div className="flex-1 h-6 border-t border-l border-gray-300 rounded-tl-lg" />
                        <div className="flex-1 h-6 border-t border-r border-gray-300 rounded-tr-lg" />
                    </div>
                    <div className="flex items-stretch gap-3">
                        {convenors.map(c => (
                            <button
                                key={c.id}
                                onClick={() => onMemberClick(c)}
                                className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-indigo-600 rounded-xl px-3 py-4 text-center shadow-sm hover:shadow-md hover:bg-indigo-50/50 transition-all group"
                            >
                                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-1">{c.role}</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-indigo-700 leading-tight">{c.name}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{c.branch}</p>
                                <p className="text-[10px] text-indigo-500 mt-2 font-semibold">View Profile →</p>
                            </button>
                        ))}
                    </div>
                    <div className="flex">
                        <div className="flex-1 h-6 border-b border-l border-gray-300 rounded-bl-lg" />
                        <div className="flex-1 h-6 border-b border-r border-gray-300 rounded-br-lg" />
                    </div>
                </div>
                <VLine />

                {/* Core — clickable */}
                <button
                    onClick={() => onDomainClick('core')}
                    className="w-64 sm:w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-purple-600 rounded-xl px-6 py-4 text-center shadow-sm hover:shadow-md hover:bg-purple-50/50 transition-all group"
                >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600 mb-1">Core Committee</p>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-purple-700">Core Members — IEEE & WIE</p>
                    <p className="text-[10px] text-purple-500 mt-2 font-semibold">View Members ↓</p>
                </button>
                <VLine />

                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Domain Teams</p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {domains.map(d => (
                        <button
                            key={d.key}
                            onClick={() => onDomainClick(d.key)}
                            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-3 text-center shadow-sm hover:shadow-md hover:border-gray-400 hover:bg-gray-50 dark:bg-slate-950 transition-all group"
                        >
                            <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:text-white whitespace-nowrap">{d.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">IEEE · WIE</p>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}

// --- HELPER FUNCTIONS ---
const getDirectImageLink = (googleDriveLink: string | undefined): string => {
    if (!googleDriveLink || typeof googleDriveLink !== 'string') return '';
    const fileIdMatch = googleDriveLink.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) {
        return `https://drive.google.com/uc?id=${fileIdMatch[0]}`;
    }
    return googleDriveLink;
};

const normalizeYear = (abbr: string = ''): string => {
    const yearMap: { [key: string]: string } = {
        'se': 'Second Year', 'te': 'Third Year', 'be': 'Final Year', 'fe': 'First Year',
    };
    return yearMap[abbr.toLowerCase().trim()] || abbr;
};

const normalizeBranch = (abbr: string = ''): string => {
    const branchMap: { [key: string]: string } = {
        'cmpn': 'Computer Engineering', 'inft': 'Information Technology', 'extc': 'Electronics & Telecommunication', 'aiml': 'AI & Machine Learning', 'ecs': 'Electronics & Computer Science', 'mech': 'Mechanical Engineering',
    };
    return branchMap[abbr.toLowerCase().trim()] || abbr;
};

const getRolePriority = (role: string, committee: string): number => {
    const lowerRole = role.toLowerCase();
    const upperCommittee = committee.toUpperCase();
    const isWIE = upperCommittee.includes('WIE');

    // --- ADD THIS BLOCK ---
    if (lowerRole.includes('convenor')) {
        return 0; // Highest priority
    }
    // --------------------

    if (lowerRole.includes('head') && !lowerRole.includes('joint') && !lowerRole.includes('vice')) {
        return isWIE ? 2 : 1;
    }
    if (lowerRole.includes('joint head') || lowerRole.includes('vice head')) {
        return isWIE ? 4 : 3;
    }
    if (lowerRole.includes('executive')) {
        return isWIE ? 6 : 5;
    }
    return 99;
};

// --- LEADERSHIP DATA (module-level, static) ---
const convenors: TeamMember[] = [
    {
        id: 0,
        name: 'Valentina Rani',
        role: 'Convenor',
        category: 'convenor',
        year: '',
        branch: 'Electronics & Telecommunication',
        image: 'https://res.cloudinary.com/degzo3jzl/image/upload/v1726587187/valentinarani_zbvaxd.jpg',
        bio: 'Leading the IEEE × WIE Student Branch with a vision for innovation, inclusivity, and excellence in technology education.',
        achievements: [],
        skills: ['Leadership', 'Strategic Planning', 'Event Management', 'Public Speaking', 'Team Coordination'],
        social: { linkedin: 'https://www.linkedin.com/in/valentina-rani-39a49bb0/', email: 'valentinabasker@sfit.ac.in', github: '', instagram: '', googleScholar: '' },
        featured: true,
        committee: 'IEEEXWIE',
        responsibilities: [
            'Leads the overall IEEE × WIE Student Branch committee at SFIT',
            'Sets the vision and strategic direction for the academic year',
            'Coordinates with domain heads to ensure smooth execution of events',
            'Represents the student branch at institutional and IEEE forums',
            'Manages approvals, external communications, and budgeting',
            'Fosters a culture of innovation and inclusivity within the committee',
        ],
    },
    {
        id: 1,
        name: 'Dr. Mrinmoyee Mukherjee',
        role: 'Co-Convenor',
        category: 'convenor',
        year: '',
        branch: 'Information Technology',
        image: 'https://res.cloudinary.com/degzo3jzl/image/upload/v1772716360/e475ae92-1a54-4ba1-96a6-fb8e4d62a06f.png',
        bio: 'Fostering the next generation of engineers by bridging the gap between advanced statistical signal processing and real-world IoT solutions.',
        achievements: [],
        skills: ['Statistical Signal Processing', 'IoT Research', 'Academic Planning', 'Event Planning', 'Team Building'],
        social: { linkedin: 'https://www.linkedin.com/in/drmrinmoyeemukherjee/', email: 'mrinmoyeemukherjee@sfit.ac.in', github: '', instagram: '', googleScholar: '' },
        featured: true,
        committee: 'IEEEXWIE',
        responsibilities: [
            'Supports the Convenor in all committee operations and decisions',
            'Oversees faculty-student coordination and academic alignment',
            'Guides technical, research-oriented, and WIE-focused activities',
            'Chairs committee meetings in the Convenor\'s absence',
            'Mentors core members in their respective domain roles',
            'Ensures compliance with IEEE and WIE guidelines and standards',
        ],
    },
];

const techRep: TeamMember = {
    id: -1,
    name: 'Amrita Mathur',
    role: 'Faculty Technical Representative',
    category: 'faculty',
    year: '',
    branch: 'St. Francis Institute of Technology',
    image: 'https://res.cloudinary.com/degzo3jzl/image/upload/v1773105482/7a47b8a2-d55e-43a0-b679-b37cd126ea45.png',
    bio: 'Faculty Technical Representative at St. Francis Institute of Technology, responsible for overseeing student technical activities, guiding research initiatives, and fostering a culture of innovation and professional development among students.',
    achievements: [],
    skills: ['Technical Leadership', 'Research Guidance', 'Academic Mentorship', 'Project Oversight', 'Student Development'],
    social: { linkedin: '', email: 'amritamathur@sfit.ac.in', github: '', instagram: '', googleScholar: '' },
    featured: false,
    committee: 'SFIT',
    responsibilities: [
        'Oversees all student technical activities and initiatives at SFIT',
        'Acts as liaison between the college administration and student technical committees',
        'Mentors students in technical research, projects, and innovations',
        'Reviews and approves event proposals and technical workshop plans',
        'Represents SFIT at inter-collegiate and regional technical forums',
        'Ensures quality and academic integrity of all technical programs',
    ],
    resume: '',
};

const TeamPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [activeRole, setActiveRole] = useState<string>('all');
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const teamSectionRef = useRef<HTMLDivElement>(null);

    const { ref: headerRef } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3, triggerOnce: true });
    const { ref: teamRef} = useStaggeredAnimation<HTMLDivElement>(teamMembers.length, 150);
    
    const handleMemberClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    // This effect resets the Role filter when the main Category changes
    useEffect(() => {
        setActiveRole('all');
    }, [activeCategory]);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                const response = await fetch("https://script.google.com/macros/s/AKfycbzGTQv525hbcuS2wHFHlynwo4dcBRztbkK1_hBn3SyP1TykvC-oq1wqQEwSpj9iDnsw/exec");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const rawData: (string | number)[][] = await response.json();
                if (!Array.isArray(rawData) || rawData.length < 2) throw new Error("Invalid or empty data format received from API.");

                const headers = rawData[0].map(header => String(header).trim());
                const memberRows = rawData.slice(1);

                const transformedData: TeamMember[] = memberRows.map((row, rowIndex) => {
                    const memberObject: { [key: string]: string | number } = headers.reduce((acc, header, i) => {
                        acc[header] = row[i]; return acc;
                    }, {} as { [key: string]: string | number });

                    const cleanMember = memberObject;
                    const domainRoleParts = String(cleanMember['Domain-Role'] || '').split('-');
                    const domain = domainRoleParts[0]?.trim() || '';
                    const role = domainRoleParts.slice(1).join('-').trim() || 'Member';
                    const [yearAbbr = '', branchAbbr = ''] = String(cleanMember['Year-Branch'] || '').split('-').map(s => s.trim());
                    const skills = String(cleanMember['Skills'] || '').split(',').map(skill => skill.trim()).filter(Boolean);
                    const formatName = (name: string) => name.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');

                    // Helper to capitalize first letter of each sentence and proper nouns
                    const capitalizeSentences = (text: string) => {
                        if (!text) return '';
                        // Split by sentence-ending punctuation
                        return text
                            .split(/([.!?]\s+)/)
                            .map((part, idx, arr) => {
                                // If it's a sentence (not just punctuation)
                                if (part.trim().length > 0 && !/[.!?]\s+/.test(part)) {
                                    // Capitalize first letter of each word (for proper nouns)
                                    return part
                                        .split(' ')
                                        .map((word, i) => {
                                            // Capitalize first word, or if previous part ends with punctuation
                                            if (i === 0 || (idx > 0 && /[.!?]\s+$/.test(arr[idx - 1]))) {
                                                return word.charAt(0).toUpperCase() + word.slice(1);
                                            }
                                            // Otherwise, keep as is
                                            return word;
                                        })
                                        .join(' ');
                                }
                                return part;
                            })
                            .join('');
                    };

                    return {
                        id: rowIndex + 100,
                        name: formatName(String(cleanMember['Full Name'] || 'N/A')),
                        role: role
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' '),
                        category: domain.toLowerCase() || 'general',
                        year: normalizeYear(yearAbbr),
                        branch: normalizeBranch(branchAbbr),
                        image: getDirectImageLink(String(cleanMember['Picture'])),
                        bio: capitalizeSentences(String(cleanMember['About Bio'] || 'A passionate member of the team.')),
                        achievements: [],
                        skills: skills.map(skill =>
                            skill
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')
                        ),
                        social: {
                            linkedin: String(cleanMember['LinkedIn Profile Link'] || '#'),
                            email: cleanMember['Email Address'] ? `mailto:${cleanMember['Email Address']}` : '#',
                            github: String(cleanMember['Github Link'] || '#'),
                            instagram: String(cleanMember['Instagram Link'] || '#')
                        },
                        featured: (domain.toLowerCase() === 'core'),
                        committee: String(cleanMember['Committee'] || 'N/A').toUpperCase(),
                    };
                });

                // Dedup: match by significant name tokens (handles "Dr. X" vs "X", middle names, typos)
                // Build convenor dedup identifiers
                const convenorEmails = convenors
                    .map(c => c.social.email.replace('mailto:', '').toLowerCase().trim())
                    .filter(e => e && e !== '#' && e !== 'na');

                const sigTokens = (name: string) =>
                    name.toLowerCase()
                        .replace(/\b(dr|prof|mr|mrs|ms)\b\.?\s*/gi, '')
                        .replace(/[^a-z\s]/g, '')
                        .trim()
                        .split(/\s+/)
                        .filter(t => t.length >= 3);

                // First long distinctive token (≥6 chars) from each convenor name (their given name).
                // Using only the first such token avoids false-positives from common family names.
                // e.g. 'Valentina', 'Mrinmoyee' — both extremely rare given names.
                const convenorDistinctTokens = convenors
                    .map(c => sigTokens(c.name).find(t => t.length >= 6))
                    .filter(Boolean) as string[];

                const isConvenorDuplicate = (sheetMember: TeamMember) => {
                    // 1. Category
                    if (sheetMember.category === 'convenor') return true;
                    // 2. Email
                    const sheetEmail = sheetMember.social.email.replace('mailto:', '').toLowerCase().trim();
                    if (sheetEmail && convenorEmails.includes(sheetEmail)) return true;
                    // 3. Substring: does the sheet member's normalised name CONTAIN any distinctive convenor token?
                    //    e.g. "mrinmoyee" (9 chars) will always be found inside "Mrinmoyee Mukherjee"
                    const sheetNameNorm = sheetMember.name.toLowerCase().replace(/[^a-z\s]/g, '');
                    if (convenorDistinctTokens.some(t => sheetNameNorm.includes(t))) return true;
                    return false;
                };

                const combinedData = [
                    ...convenors,
                    ...transformedData.filter(m => !isConvenorDuplicate(m)),
                ];

                const sortedData = combinedData.sort((a, b) => {
                    const categoryComparison = a.category.localeCompare(b.category);
                    if (categoryComparison !== 0) return categoryComparison;
                    if (a.category === 'core' || a.category === 'convenor') return a.id - b.id;
                    const priorityA = getRolePriority(a.role, a.committee);
                    const priorityB = getRolePriority(b.role, b.committee);
                    if (priorityA !== priorityB) return priorityA - priorityB;
                    return a.name.localeCompare(b.name);
                });
                (window as any).__teamMembersCache = sortedData;

                if (!cancelled) setTeamMembers(sortedData);
            } catch (e: any) {
                if (!cancelled) setError(e.message || "Could not load team members.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, []);

    // --- DYNAMIC FILTER OPTIONS ---
    const mainCategories = [
        { id: 'all', name: 'All Members', count: teamMembers.length },
        ...[...new Set(teamMembers.map(m => m.category))].sort().map(cat => ({
            id: cat, name: `${cat.charAt(0).toUpperCase() + cat.slice(1)}`, count: teamMembers.filter(m => m.category === cat).length
        }))
    ];

    // Options for dropdowns are now based on the selected category
    const membersInActiveCategory = teamMembers.filter(member => activeCategory === 'all' || member.category === activeCategory);
    const roleOptions = [...new Set(membersInActiveCategory.map(m => m.role))].sort();

    // Hard failsafe: convenors never appear under any category-specific tab except 'all' and 'convenor'.
    // Use each convenor's first given name as a substring check — this catches any name variant
    // (e.g. "Mrinmoyee", "Mrinmoyee Mukherjee", "Dr. Mrinmoyee Mukherjee") without fragile exact matching.
    const convenorFirstNames = convenors.map(c =>
        c.name.toLowerCase()
            .replace(/\b(dr|prof|mr|mrs|ms)\b\.?\s*/gi, '') // strip honorifics
            .trim()
            .split(/\s+/)[0]                                // take first given name
    ); // e.g. ['valentina', 'mrinmoyee']

    // Final filtering logic for displaying members
    const filteredMembers = membersInActiveCategory
        .filter(member => activeRole === 'all' || member.role === activeRole)
        .filter(member => {
            // In 'all' or 'convenor' tab: show everyone
            if (activeCategory === 'all' || activeCategory === 'convenor') return true;
            // In ANY other tab: block any member whose name contains a convenor's first name
            const nameLower = member.name.toLowerCase();
            return !convenorFirstNames.some(fn => nameLower.includes(fn));
        });

    const executiveCount = teamMembers.filter(m => m.category === 'core').length;

    if (isLoading) return <TeamLoader />;
    if (error) return <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header Section */}
            <section className="pt-32 pb-12 relative overflow-hidden ">
                <div className="absolute top-10 left-5 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                <div className="absolute top-20 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2000"></div>
                <div className="absolute top-40 left-1/3 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-4000"></div>
                <div className="absolute top-60 right-1/4 w-28 h-28 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-1000"></div>
                <div className="absolute top-80 left-10 w-36 h-36 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-3000"></div>

                {/* Row 2 */}
                <div className="absolute top-[30rem] left-1/5 w-44 h-44 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                <div className="absolute top-[34rem] right-20 w-52 h-52 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-1500"></div>
                <div className="absolute top-[38rem] left-1/2 w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2500"></div>
                <div className="absolute top-[42rem] right-1/3 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-3500"></div>
                <div className="absolute top-[46rem] left-16 w-30 h-30 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-500"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div ref={headerRef} className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 opacity-100">Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">Team</span></h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed opacity-100">Meet the passionate individuals who drive our committee forward, dedicated to empowering the next generation of technology leaders.</p>
                    </div>

                    {/* Org Chart — shown at top before stats */}
                    <div className="mb-16">
                        <OrgChart
                            convenors={convenors}
                            techRep={techRep}
                            onMemberClick={handleMemberClick}
                            onDomainClick={(key) => {
                                // Resolve the org-chart key against actual loaded categories
                                // e.g. 'sm' should match 'social media' from the sheet
                                const allCategories = [...new Set(teamMembers.map(m => m.category))];
                                const normalise = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');
                                const matched = allCategories.find(c =>
                                    normalise(c) === normalise(key) ||
                                    normalise(c).includes(normalise(key)) ||
                                    normalise(key).includes(normalise(c))
                                ) ?? key;
                                setActiveCategory(matched);
                                setTimeout(() => {
                                    teamSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 opacity-100">
                        {[
                            { icon: Users, value: teamMembers.length, suffix: '', label: 'Active Members', color: 'blue' },
                            { icon: Award, value: executiveCount, suffix: '', label: 'Core Leaders', color: 'purple' },
                            { icon: Star, value: 4, suffix: '+', label: 'Events Hosted', color: 'pink' },
                            { icon: Users, value: 2, suffix: '', label: 'Convenors', color: 'indigo' }
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 card-tilt text-center">
                                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600`} />
                                <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.value}{stat.suffix}</div>
                                <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Sleek Minimalist Filters */}
                    <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                        {/* Compact Tabs */}
                        <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                            {mainCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 py-2 rounded-full font-semibold text-xs tracking-wider transition-all duration-300 ${
                                        activeCategory === category.id 
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/10' 
                                            : 'bg-white dark:bg-slate-900 hover:bg-gray-100 text-gray-500 dark:text-gray-400 hover:text-gray-800 border border-gray-100'
                                    }`}
                                >
                                    {category.name} <span className="opacity-60 ml-0.5">({category.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Minimalist Dropdowns */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {/* Role Filter */}
                            <div className="relative">
                                <select 
                                    value={activeRole} 
                                    onChange={(e) => setActiveRole(e.target.value)} 
                                    className="appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-full pl-4 pr-9 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm transition-all"
                                >
                                    <option value="all">All Roles</option>
                                    {roleOptions.map(role => (<option key={role} value={role}>{role}</option>))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </div>
                            </div>

                            {/* Sleek Reset Button */}
                            {(activeCategory !== 'all' || activeRole !== 'all') && (
                                <button
                                    onClick={() => {
                                        setActiveCategory('all');
                                        setActiveRole('all');
                                    }}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline px-2 py-1 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="pb-20" ref={teamSectionRef}>
                {/* Animated Background Blobs for Team Grid */}
                <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-0 z-0">
                        {/* Row 1 */}
                        <div className="absolute top-10 left-5 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2000"></div>
                        <div className="absolute top-40 left-1/3 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-4000"></div>
                        <div className="absolute top-60 right-1/4 w-28 h-28 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-1000"></div>
                        <div className="absolute top-80 left-10 w-36 h-36 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-3000"></div>
                        {/* Row 2 */}
                        <div className="absolute top-[35rem] left-1/5 w-44 h-44 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[40rem] right-20 w-52 h-52 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[45rem] left-1/2 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[50rem] right-1/3 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[55rem] left-16 w-30 h-30 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="space-y-16">
                        {(() => {
                            // Group filtered members by category (domain)
                            const grouped: { [key: string]: TeamMember[] } = {};
                            filteredMembers.forEach((member) => {
                                const cat = member.category || 'general';
                                if (!grouped[cat]) {
                                    grouped[cat] = [];
                                }
                                grouped[cat].push(member);
                            });

                            // Define order of categories to display
                            const categoryOrder = ['convenor', 'faculty', 'core', 'technical', 'creative', 'pr', 'marketing', 'social media', 'general'];
                            // Filter and sort the categories that actually have members in the current filter state
                            const activeGroups = Object.keys(grouped).sort((a, b) => {
                                const indexA = categoryOrder.indexOf(a);
                                const indexB = categoryOrder.indexOf(b);
                                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                if (indexA !== -1) return -1;
                                if (indexB !== -1) return 1;
                                return a.localeCompare(b);
                            });

                            if (activeGroups.length === 0) {
                                return (
                                    <div className="col-span-full text-center py-16 flex flex-col items-center justify-center">
                                        <Frown className="w-16 h-16 text-gray-400 mb-4" />
                                        <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">No Members Found</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters to find who you're looking for.</p>
                                    </div>
                                );
                            }

                            return activeGroups.map((cat) => {
                                const members = grouped[cat];
                                const displayCategoryName = cat === 'pr'
                                    ? 'PR Team'
                                    : cat === 'ieeexwie'
                                        ? 'IEEE x WIE'
                                        : `${cat.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} Team`;

                                return (
                                    <div key={cat} className="space-y-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <h2 className="text-2xl font-bold text-gray-800 tracking-wide border-b-2 border-blue-500 pb-1 inline-block">
                                                {displayCategoryName}
                                            </h2>
                                            <div className="flex-grow h-px bg-gray-200"></div>
                                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                                {members.length} {members.length === 1 ? 'member' : 'members'}
                                            </span>
                                        </div>

                                        <div ref={teamRef} className={cat === 'convenor' ? "flex flex-wrap gap-8 justify-center" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center"}>
                                            {members.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className={`bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group relative will-change-transform cursor-pointer w-full ${cat === 'convenor' ? 'sm:w-[280px] md:w-[320px] flex-shrink-0' : ''}`}
                                                    onClick={() => handleMemberClick(member)}
                                                >
                                                    {member.featured && member.category === "core" && (
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-full">
                                                                <Star className="w-4 h-4 mr-1" /> Core
                                                            </div>
                                                        </div>
                                                    )}

                                                    {member.featured && member.category === "convenor" && (
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-medium rounded-full">
                                                                <Star className="w-4 h-4 mr-1" /> {member.role}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="relative overflow-hidden">
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="w-full h-64 brightness-100 object-cover object-center group-hover:scale-110 group-hover:brightness-125 transition duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bottom-6">
                                                            {member.social.linkedin && member.social.linkedin !== "#" && member.social.linkedin !== "NA" && (
                                                                <a
                                                                    href={member.social.linkedin}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-10 h-10 bg-white dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Linkedin className="w-5 h-5 text-blue-700" />
                                                                </a>
                                                            )}

                                                            {member.social.github && member.social.github !== "#" && member.social.github !== "NA" && (
                                                                <a
                                                                    href={member.social.github}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-10 h-10 bg-white dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Github className="w-5 h-5 text-gray-800" />
                                                                </a>
                                                            )}

                                                            {member.social.instagram && member.social.instagram !== "#" && member.social.instagram !== "NA" && (
                                                                <a
                                                                    href={member.social.instagram}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-10 h-10 bg-white dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Instagram className="w-5 h-5 text-pink-600" />
                                                                </a>
                                                            )}

                                                            {member.social.email && member.social.email !== "#" && member.social.email !== "NA" && (
                                                                <a
                                                                    href={member.social.email.startsWith('mailto:') ? member.social.email : `mailto:${member.social.email}`}
                                                                    className="w-10 h-10 bg-white dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Mail className="w-5 h-5 text-green-600" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="p-6">
                                                        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600">{member.name}</h3>
                                                        <p className="text-blue-600 font-semibold text-sm mb-1">
                                                            {member.committee.toLowerCase() == "ieeexwie" ? "IEEE x WIE" : member.committee}
                                                            {" - "}
                                                            {member.category == "convenor"
                                                                ? member.role
                                                                : member.category == "core"
                                                                    ? member.role
                                                                    : member.category == "pr"
                                                                        ? `PR ${member.role}`
                                                                        : `${member.category.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")} ${member.role}`}
                                                        </p>
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{member.year} • {member.branch}</p>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 h-20 overflow-hidden">
                                                            {member.bio.length > 100
                                                                ? (() => {
                                                                    const truncated = member.bio.slice(0, 100);
                                                                    const lastSpace = truncated.lastIndexOf(" ");
                                                                    const safeTruncate = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
                                                                    return <>{safeTruncate}...</>;
                                                                })()
                                                                : member.bio}
                                                        </p>
                                                        <div className="mb-4">
                                                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Skills:</h4>
                                                            <div className="flex flex-wrap gap-1">
                                                                {member.skills.slice(0, 5).map((skill, skillIndex) => (
                                                                    <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{skill}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <MemberModal
                member={selectedMember}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default TeamPage;