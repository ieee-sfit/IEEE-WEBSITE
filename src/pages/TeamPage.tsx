import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, Github, Award, Users, Star, ChevronDown, Instagram, Frown, X } from 'lucide-react';
// Make sure your hooks are correctly imported from their location
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';
import { motion } from "framer-motion";


// --- TYPE DEFINITIONS ---
interface SocialLinks {
    linkedin: string;
    email: string;
    github: string;
    instagram: string;
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
            {/* Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto overflow-x-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Image */}
                    <div className="lg:w-2/5 relative">
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-80 lg:h-full object-cover object-center rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                        />
                        {/* Featured Badge */}
                        {member.featured && (
                            <div className="absolute top-6 left-6">
                                <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-full shadow-lg">
                                    <Star className="w-4 h-4 mr-2" />
                                    {member.role === "Convenor" ? "Convenor" : "Core"}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Information */}
                    <div className="lg:w-3/5 p-6 sm:p-8 lg:p-10">
                        {/* Header Info */}
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">{member.name}</h2>
                            <p className="text-blue-600 font-semibold text-base sm:text-lg mb-2">
                                {member.committee.toLowerCase() === "ieeexwie" ? "IEEE x WIE" : member.committee}
                                {" - "}
                                {member.category === "core"
                                    ? ""
                                    : member.category === "pr"
                                        ? "PR"
                                        : member.category.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}
                                {" "}
                                {member.role === "Convenor" ? "" : member.role}
                            </p>
                            <p className="text-gray-600 text-base sm:text-lg">{member.year} • {member.branch}</p>
                        </div>

                        {/* Bio */}
                        <div className="mb-8">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">About</h3>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{member.bio}</p>
                        </div>

                        {/* Skills */}
                        <div className="mb-8">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {member.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-2 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mb-6">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Connect</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {member.social.linkedin && member.social.linkedin !== "#" && member.social.linkedin !== "NA" && (
                                    <a
                                        href={member.social.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                                    >
                                        <Linkedin className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">LinkedIn</span>
                                    </a>
                                )}
                                
                                {member.social.github && member.social.github !== "#" && member.social.github !== "NA" && (
                                    <a
                                        href={member.social.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors shadow-md"
                                    >
                                        <Github className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">GitHub</span>
                                    </a>
                                )}
                                
                                {member.social.instagram && member.social.instagram !== "#" && member.social.instagram !== "NA" && (
                                    <a
                                        href={member.social.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-md"
                                    >
                                        <Instagram className="w-5 h-5 mr-2 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">Instagram</span>
                                    </a>
                                )}
                                
                                {member.social.email && member.social.email !== "#" && member.social.email !== "NA" && (
                                    <a
                                        href={member.social.email.startsWith('mailto:') ? member.social.email : `mailto:${member.social.email}`}
                                        className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md"
                                    >
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

// --- HELPER FUNCTIONS ---
const getDirectImageLink = (googleDriveLink: string | undefined): string => {
    if (!googleDriveLink || typeof googleDriveLink !== 'string') return '';
    const fileIdMatch = googleDriveLink.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) {
        console.log(`https://lh3.googleusercontent.com/d/${fileIdMatch[0]}=w2000`)
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


const TeamPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [activeRole, setActiveRole] = useState<string>('all');
    const [activeCommittee, setActiveCommittee] = useState<string>('all');
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { ref: headerRef } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });
    const { ref: teamRef, visibleItems: teamVisible } = useStaggeredAnimation(teamMembers.length, 150);
    const isLaptop = window.innerWidth > 768;

    const [visibleCards, setVisibleCards] = useState<number[]>([]);

    // Add this right after the useState declarations in your TeamPage component
    const convenors: TeamMember[] = [
        {
            id: 0, // Use a unique ID like 0
            name: 'Valentina Rani',
            role: 'Convenor',
            category: 'convenor', // Assign to 'core' to appear in that filter
            year: '',
            branch: 'Electronics & Telecommunication',
            image: 'https://res.cloudinary.com/degzo3jzl/image/upload/v1726587187/valentinarani_zbvaxd.jpg', // <-- Replace with actual image URL
            bio: 'Leading the team with a vision for innovation and excellence.',
            achievements: [],
            skills: ['Leadership', 'Management', 'Public Speaking'],
            social: {
                linkedin: 'https://www.linkedin.com/in/valentina-rani-39a49bb0/',
                email: 'valentinabasker@sfit.ac.in',
                github: '',
                instagram: ''
            },
            featured: true, // Mark as featured
            committee: 'IEEEXWIE', // Or the relevant committee name
        },
        {
            id: -1, // Use another unique ID like -1
            name: 'Dr. Dakshata Panchal',
            role: 'Convenor',
            category: 'convenor',
            year: '',
            branch: 'Computer Engineering',
            image: 'https://res.cloudinary.com/degzo3jzl/image/upload/v1726587089/drdakshatapanchal_qkcqd2.png', // <-- Replace with actual image URL
            bio: 'Dedicated to fostering a collaborative and empowering environment for all members.',
            achievements: [],
            skills: ['Strategy', 'Event Planning', 'Team Building'],
            social: {
                linkedin: 'https://www.linkedin.com/in/dr-dakshata-panchal-01b101210/',
                email: 'dakshatapanchal@sfit.ac.in',
                github: '',
                instagram: ''
            },
            featured: true,
            committee: 'IEEEXWIE',
        }
    ];

    const handleInView = (index: number) => {
        // On mobile, get the next 3 cards (current + next 2)
        const newCards = isLaptop
            ? [index]
            : [index, index + 1, index + 2].filter((i) => i < filteredMembers.length);

        // Only add cards that are not already visible
        const cardsToAdd = newCards.filter((i) => !visibleCards.includes(i));
        if (cardsToAdd.length === 0) return; // nothing new to add

        setVisibleCards((prev) => [...prev, ...cardsToAdd]);
    };

    const handleMemberClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    // This effect resets the Role and Committee filters when the main Category changes
    useEffect(() => {
        setActiveRole('all');
        setActiveCommittee('all');
    }, [activeCategory]);

    useEffect(() => {
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
                        id: rowIndex + 1,
                        name: formatName(String(cleanMember['Full Name'] || 'N/A')),
                        role: role
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' '),
                        category: domain.toLowerCase() || 'general',
                        year: normalizeYear(yearAbbr),
                        branch: normalizeBranch(branchAbbr),
                        image: getDirectImageLink(String(cleanMember['Picture'])),
                        bio: capitalizeSentences(String(cleanMember['About Bio'] || 'A passionate member of the team.').toLowerCase()),
                        achievements: [],
                        skills: skills.map(skill =>
                            skill
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')
                        ),
                        social: {
                            linkedin: String(cleanMember['LinkedIn Profile Link'] || '#'),
                            email: `mailto:${cleanMember['Email Address']}` || '#',
                            github: String(cleanMember['Github Link'] || '#'),
                            instagram: String(cleanMember['Instagram Link'] || '#')
                        },
                        featured: (domain.toLowerCase() === 'core'),
                        committee: String(cleanMember['Committee'] || 'N/A').toUpperCase(),
                    };
                });

                const combinedData = [...convenors, ...transformedData]; // <-- ADD THIS LINE

                const sortedData = combinedData.sort((a, b) => {
                    const categoryComparison = a.category.localeCompare(b.category);
                    if (categoryComparison !== 0) return categoryComparison;
                    if (a.category === 'core') return a.id - b.id;
                    const priorityA = getRolePriority(a.role, a.committee);
                    const priorityB = getRolePriority(b.role, b.committee);
                    if (priorityA !== priorityB) return priorityA - priorityB;
                    return a.name.localeCompare(b.name);
                });

                setTeamMembers(sortedData);
            } catch (e: any) {
                console.error("Failed to fetch team data:", e);
                setError(e.message || "Could not load team members.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
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
    const committeeOptions = [...new Set(membersInActiveCategory.map(m => m.committee))].sort();

    // Final filtering logic for displaying members
    const filteredMembers = membersInActiveCategory
        .filter(member => activeRole === 'all' || member.role === activeRole)
        .filter(member => activeCommittee === 'all' || member.committee === activeCommittee);

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
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed opacity-100">Meet the passionate individuals who drive our committee forward, dedicated to empowering the next generation of technology leaders.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 opacity-100">
                        {[
                            { icon: Users, value: teamMembers.length, suffix: '', label: 'Active Members', color: 'blue' },
                            { icon: Award, value: executiveCount, suffix: '', label: 'Core Leaders', color: 'purple' },
                            { icon: Star, value: 10, suffix: '+', label: 'Events Hosted', color: 'pink' },
                            { icon: Users, value: 2, suffix: '', label: 'Convenors', color: 'indigo' }
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 card-tilt text-center">
                                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600`} />
                                <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.value}{stat.suffix}</div>
                                <div className="text-gray-600 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-6 mb-12">
                        <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200 flex flex-wrap justify-center">
                            {mainCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 md:px-6 py-3 rounded-full font-semibold transition-all duration-300 m-1 ${activeCategory === category.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
                                >
                                    {category.name} ({category.count})
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="relative">
                                <select value={activeRole} onChange={(e) => setActiveRole(e.target.value)} className="appearance-none w-full bg-white border border-gray-200 rounded-full pl-4 pr-8 py-2 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
                                    <option value="all">All Roles</option>
                                    {roleOptions.map(role => (<option key={role} value={role}>{role}</option>))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"><ChevronDown className="h-4 w-4" /></div>
                            </div>

                            <div className="relative">
                                <select value={activeCommittee} onChange={(e) => setActiveCommittee(e.target.value)} className="appearance-none w-full bg-white border border-gray-200 rounded-full pl-4 pr-8 py-2 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
                                    <option value="all">All Committees</option>
                                    {committeeOptions.map(com => (<option key={com} value={com}>{com}</option>))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"><ChevronDown className="h-4 w-4" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="pb-20">
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

                    <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={visibleCards.includes(index) ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onViewportEnter={() => handleInView(index)}
                                    viewport={{ once: true, amount: isLaptop ? 0.01 : 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 card-tilt overflow-hidden group relative will-change-transform will-change-opacity cursor-pointer"
                                    onClick={() => handleMemberClick(member)}
                                >
                                    {member.featured && member.role !== "Convenor" && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-full">
                                                <Star className="w-4 h-4 mr-1" /> Core
                                            </div>
                                        </div>
                                    )}

                                    {member.featured && member.role === "Convenor" && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-medium rounded-full">
                                                <Star className="w-4 h-4 mr-1" /> Convenor
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
                                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
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
                                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
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
                                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Instagram className="w-5 h-5 text-pink-600" />
                                                </a>
                                            )}
                                            
                                            {member.social.email && member.social.email !== "#" && member.social.email !== "NA" && (
                                                <a
                                                    href={member.social.email.startsWith('mailto:') ? member.social.email : `mailto:${member.social.email}`}
                                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
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
                                            {member.category == "core"
                                                ? ""
                                                : member.category == "pr"
                                                    ? "PR"
                                                    : member.category.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}
                                            {" "}
                                            {member.role == "Convenor" ? "" : member.role}
                                        </p>
                                        <p className="text-gray-500 text-sm mb-4">{member.year} • {member.branch}</p>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 h-20 overflow-hidden">
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
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 flex flex-col items-center justify-center">
                                <Frown className="w-16 h-16 text-gray-400 mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-600">No Members Found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your filters to find who you're looking for.</p>
                            </div>
                        )}
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