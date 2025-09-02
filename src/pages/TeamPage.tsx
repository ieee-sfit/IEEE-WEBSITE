import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, Github, Award, Users, Star, ChevronDown, Instagram, Frown } from 'lucide-react';
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

    const { ref: headerRef } = useScrollAnimation({ threshold: 0.3, triggerOnce: true });
    const { ref: teamRef, visibleItems: teamVisible } = useStaggeredAnimation(teamMembers.length, 150);
    const isLaptop = window.innerWidth > 768;

    const [visibleCards, setVisibleCards] = useState<number[]>([]);

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

                const sortedData = transformedData.sort((a, b) => {
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
                            { icon: Star, value: 15, suffix: '+', label: 'Events Hosted', color: 'pink' },
                            { icon: Users, value: 4, suffix: '', label: 'Year Levels', color: 'indigo' }
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
                        {/* Row 3 */}
                        <div className="absolute top-[60rem] left-1/6 w-36 h-36 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[65rem] right-24 w-40 h-40bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[70rem] left-1/3 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[75rem] right-1/5 w-44 h-44 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[80rem] left-20 w-28 h-28 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 4 */}
                        <div className="absolute top-[85rem] left-1/4 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[90rem] right-32 w-36 h-36 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[95rem] left-1/2 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[100rem] right-1/3 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[105rem] left-24 w-30 h-30 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 5 */}
                        <div className="absolute top-[110rem] left-1/5 w-44 h-44 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[115rem] right-20 w-52 h-52 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[120rem] left-1/2 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[125rem] right-1/3 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[130rem] left-16 w-30 h-30 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 6 */}
                        <div className="absolute top-[135rem] left-1/6 w-36 h-36 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[140rem] right-24 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[145rem] left-1/3 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[150rem] right-1/5 w-44 h-44 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[155rem] left-20 w-28 h-28 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 7 */}
                        <div className="absolute top-[160rem] left-1/4 w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[165rem] right-32 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[170rem] left-1/2 w-24 h-24 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[175rem] right-1/3 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[180rem] left-24 w-30 h-30 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 8 */}
                        <div className="absolute top-[185rem] left-1/5 w-44 h-44 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[190rem] right-20 w-52 h-52 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[195rem] left-1/2 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[200rem] right-1/3 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[205rem] left-16 w-30 h-30 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 9 */}
                        <div className="absolute top-[210rem] left-1/6 w-36 h-36 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[215rem] right-24 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[220rem] left-1/3 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[225rem] right-1/5 w-44 h-44 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[230rem] left-20 w-28 h-28 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 10 */}
                        <div className="absolute top-[235rem] left-1/4 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[240rem] right-32 w-36 h-36 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[245rem] left-1/2 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[250rem] right-1/3 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[255rem] left-24 w-30 h-30 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 11 */}
                        <div className="absolute top-[260rem] left-1/5 w-44 h-44 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[265rem] right-20 w-52 h-52 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[270rem] left-1/2 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[275rem] right-1/3 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[280rem] left-16 w-30 h-30 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 12 */}
                        <div className="absolute top-[285rem] left-1/6 w-36 h-36 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[290rem] right-24 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[295rem] left-1/3 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[300rem] right-1/5 w-44 h-44 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[305rem] left-20 w-28 h-28 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 13 */}
                        <div className="absolute top-[310rem] left-1/4 w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[315rem] right-32 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[320rem] left-1/2 w-24 h-24 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[325rem] right-1/3 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[330rem] left-24 w-30 h-30 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        {/* Row 14 */}
                        <div className="absolute top-[335rem] left-1/5 w-44 h-44 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[340rem] right-20 w-52 h-52 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[345rem] left-1/2 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[350rem] right-1/3 w-60 h-60 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
                        <div className="absolute top-[355rem] left-16 w-30 h-30 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>

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
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 card-tilt overflow-hidden group relative will-change-transform will-change-opacity"
                                >
                                    {member.featured && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-full">
                                                <Star className="w-4 h-4 mr-1" /> Core
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
                                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"><Linkedin className="w-5 h-5 text-blue-700" /></a>
                                            <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"><Github className="w-5 h-5 text-gray-800" /></a>
                                            <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"><Instagram className="w-5 h-5 text-pink-600" /></a>
                                            <a href={member.social.email} className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"><Mail className="w-5 h-5 text-green-600" /></a>
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
                                            {member.role}
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
        </div>
    );
};

export default TeamPage;