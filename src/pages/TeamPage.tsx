import React, { useState } from 'react';
import { Linkedin, Mail, Github, Award, Users, Star, ChevronDown } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const TeamPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });
  
  const { ref: teamRef, visibleItems: teamVisible } = useStaggeredAnimation(12, 150);

  const teamMembers = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Chapter President",
      category: "executive",
      year: "Final Year",
      branch: "Computer Engineering",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Leading IEEE×WIE SFIT with passion for women empowerment in technology and innovation.",
      achievements: ["Best Student Leader 2023", "Google WTM Ambassador", "Hackathon Winner"],
      skills: ["Leadership", "Machine Learning", "Public Speaking"],
      social: {
        linkedin: "#",
        email: "priya@ieee.sfit.ac.in",
        github: "#"
      },
      featured: true
    },
    {
      id: 2,
      name: "Anita Gupta",
      role: "Vice President",
      category: "executive",
      year: "Third Year",
      branch: "Electronics Engineering",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Driving technical excellence and fostering innovation in electronics and IoT domains.",
      achievements: ["IEEE Student Ambassador", "Best Project Award", "Tech Innovation Contest Winner"],
      skills: ["IoT", "Electronics Design", "Project Management"],
      social: {
        linkedin: "#",
        email: "anita@ieee.sfit.ac.in",
        github: "#"
      },
      featured: true
    },
    {
      id: 3,
      name: "Kavita Singh",
      role: "Technical Secretary",
      category: "executive",
      year: "Final Year",
      branch: "Information Technology",
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Organizing technical workshops and ensuring quality in all IEEE×WIE technical initiatives.",
      achievements: ["Microsoft Student Partner", "Coding Competition Winner", "Research Paper Published"],
      skills: ["Full Stack Development", "Data Science", "Research"],
      social: {
        linkedin: "#",
        email: "kavita@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 4,
      name: "Riya Desai",
      role: "Event Coordinator",
      category: "executive",
      year: "Third Year",
      branch: "Computer Engineering",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Coordinating and managing all IEEE×WIE events with creativity and attention to detail.",
      achievements: ["Event Management Excellence", "Cultural Fest Organizer", "Volunteer Recognition"],
      skills: ["Event Planning", "Team Coordination", "Creative Design"],
      social: {
        linkedin: "#",
        email: "riya@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 5,
      name: "Meera Patel",
      role: "Publicity Head",
      category: "executive",
      year: "Second Year",
      branch: "Electronics Engineering",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Managing social media presence and promoting IEEE×WIE initiatives across platforms.",
      achievements: ["Digital Marketing Certification", "Social Media Growth Award", "Content Creation Excellence"],
      skills: ["Digital Marketing", "Content Creation", "Social Media"],
      social: {
        linkedin: "#",
        email: "meera@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 6,
      name: "Shreya Agarwal",
      role: "Treasurer",
      category: "executive",
      year: "Third Year",
      branch: "Information Technology",
      image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Managing finances and ensuring proper resource allocation for all chapter activities.",
      achievements: ["Finance Management Certificate", "Budget Planning Excellence", "Audit Appreciation"],
      skills: ["Financial Planning", "Budget Management", "Analytics"],
      social: {
        linkedin: "#",
        email: "shreya@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 7,
      name: "Nisha Agrawal",
      role: "Web Development Lead",
      category: "technical",
      year: "Second Year",
      branch: "Computer Engineering",
      image: "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Leading web development initiatives and maintaining IEEE×WIE digital presence.",
      achievements: ["Web Development Competition Winner", "Open Source Contributor", "UI/UX Design Award"],
      skills: ["React", "Node.js", "UI/UX Design"],
      social: {
        linkedin: "#",
        email: "nisha@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 8,
      name: "Pooja Sharma",
      role: "AI/ML Coordinator",
      category: "technical",
      year: "Final Year",
      branch: "Computer Engineering",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Coordinating AI/ML workshops and research activities within the chapter.",
      achievements: ["ML Research Paper", "Data Science Competition", "AI Workshop Organizer"],
      skills: ["Machine Learning", "Python", "Data Science"],
      social: {
        linkedin: "#",
        email: "pooja@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 9,
      name: "Asha Patel",
      role: "Workshop Coordinator",
      category: "operations",
      year: "Second Year",
      branch: "Electronics Engineering",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Organizing and coordinating technical workshops and training sessions.",
      achievements: ["Workshop Excellence Award", "Training Coordinator", "Skill Development Recognition"],
      skills: ["Workshop Planning", "Training", "Technical Communication"],
      social: {
        linkedin: "#",
        email: "asha@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 10,
      name: "Sunita Rai",
      role: "Content Writer",
      category: "operations",
      year: "First Year",
      branch: "Information Technology",
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Creating engaging content for IEEE×WIE publications and digital platforms.",
      achievements: ["Content Writing Competition", "Blog Post Featured", "Newsletter Recognition"],
      skills: ["Content Writing", "Research", "Creative Writing"],
      social: {
        linkedin: "#",
        email: "sunita@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 11,
      name: "Divya Shah",
      role: "Social Media Manager",
      category: "operations",
      year: "Second Year",
      branch: "Computer Engineering",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Managing social media strategies and online community engagement.",
      achievements: ["Social Media Growth", "Community Building", "Engagement Excellence"],
      skills: ["Social Media Strategy", "Community Management", "Analytics"],
      social: {
        linkedin: "#",
        email: "divya@ieee.sfit.ac.in",
        github: "#"
      }
    },
    {
      id: 12,
      name: "Neha Verma",
      role: "Research Coordinator",
      category: "technical",
      year: "Final Year",
      branch: "Electronics Engineering",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Coordinating research activities and promoting academic excellence in engineering.",
      achievements: ["Research Excellence Award", "Conference Paper", "Innovation Contest"],
      skills: ["Research", "Technical Writing", "Innovation"],
      social: {
        linkedin: "#",
        email: "neha@ieee.sfit.ac.in",
        github: "#"
      }
    }
  ];

  const filteredMembers = activeCategory === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Members', count: teamMembers.length },
    { id: 'executive', name: 'Executive Team', count: teamMembers.filter(m => m.category === 'executive').length },
    { id: 'technical', name: 'Technical Team', count: teamMembers.filter(m => m.category === 'technical').length },
    { id: 'operations', name: 'Operations Team', count: teamMembers.filter(m => m.category === 'operations').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-20 left-5 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div ref={headerRef} className="text-center mb-16">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
            }`}>
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">Team</span>
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
            } animation-delay-200`}>
              Meet the passionate women engineers who drive IEEE×WIE SFIT forward, 
              dedicated to empowering the next generation of technology leaders.
            </p>
          </div>

          {/* Team Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-400`}>
            {[
              { icon: Users, value: 50, suffix: '+', label: 'Active Members', color: 'blue' },
              { icon: Award, value: 6, suffix: '', label: 'Executive Leaders', color: 'purple' },
              { icon: Star, value: 15, suffix: '+', label: 'Award Winners', color: 'pink' },
              { icon: Users, value: 4, suffix: '', label: 'Year Levels', color: 'indigo' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 card-tilt text-center animation-delay-${600 + index * 100}`}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600`} />
                <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Category Filter */}
          <div className={`flex justify-center mb-12 transition-all duration-700 ${
            headerVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'
          } animation-delay-800`}>
            <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200 flex flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 md:px-6 py-3 rounded-full font-semibold transition-all duration-300 m-1 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMembers.map((member, index) => (
              <div
                key={member.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 card-tilt overflow-hidden group relative ${
                  teamVisible[index] ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Featured badge */}
                {member.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full">
                      <Star className="w-4 h-4 mr-1" />
                      Featured
                    </div>
                  </div>
                )}

                {/* Profile Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Social Links Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href={member.social.linkedin} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                    </a>
                    <a href={member.social.email} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <Mail className="w-4 h-4 text-green-600" />
                    </a>
                    <a href={member.social.github} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <Github className="w-4 h-4 text-gray-800" />
                    </a>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mb-1">{member.role}</p>
                    <p className="text-gray-500 text-sm">{member.year} • {member.branch}</p>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Achievements:</h4>
                    <div className="space-y-1">
                      {member.achievements.slice(0, 2).map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-start">
                          <Award className="w-3 h-3 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{achievement}</span>
                        </div>
                      ))}
                      {member.achievements.length > 2 && (
                        <button className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors duration-300">
                          <ChevronDown className="w-3 h-3 mr-1" />
                          View more
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
