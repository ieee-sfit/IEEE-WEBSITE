import React, { useState } from 'react';
import { Github, Linkedin, Mail, Users, Crown, Code, Megaphone, TrendingUp, Palette, Share2 } from 'lucide-react';
import { useEffect } from 'react';

const Team = () => {
  const [activeCategory, setActiveCategory] = useState('convenors');

  const teamCategories = [
    { id: 'convenors', name: 'Convenors', icon: Crown, color: 'from-yellow-500 to-orange-500' },
    { id: 'core', name: 'Core Team', icon: Users, color: 'from-blue-500 to-purple-500' },
    { id: 'technical', name: 'Technical', icon: Code, color: 'from-green-500 to-teal-500' },
    { id: 'pr', name: 'Public Relations', icon: Megaphone, color: 'from-pink-500 to-rose-500' },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'from-indigo-500 to-blue-500' },
    { id: 'creative', name: 'Creative', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'social', name: 'Social Media', icon: Share2, color: 'from-cyan-500 to-blue-500' }
  ];

  const teamMembers = {
    convenors: [
      {
        name: "Priya Sharma",
        role: "Student Convenor",
        image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Leading IEEE×WIE SFIT with passion for women empowerment in technology.",
        social: { linkedin: "#", github: "#", email: "priya@sfit.ac.in" }
      },
      {
        name: "Dr. Anjali Patel",
        role: "Faculty Convenor",
        image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Guiding and mentoring students towards excellence in engineering.",
        social: { linkedin: "#", email: "anjali.patel@sfit.ac.in" }
      }
    ],
    core: [
      {
        name: "Sneha Reddy",
        role: "Vice Convenor",
        image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Supporting organizational activities and member engagement.",
        social: { linkedin: "#", github: "#", email: "sneha@sfit.ac.in" }
      },
      {
        name: "Kavya Nair",
        role: "Secretary",
        image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Managing documentation and administrative responsibilities.",
        social: { linkedin: "#", email: "kavya@sfit.ac.in" }
      },
      {
        name: "Riya Gupta",
        role: "Treasurer",
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Handling financial planning and budget management.",
        social: { linkedin: "#", github: "#", email: "riya@sfit.ac.in" }
      }
    ],
    technical: [
      {
        name: "Ananya Singh",
        role: "Technical Head",
        image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Leading technical workshops and innovation projects.",
        social: { linkedin: "#", github: "#", email: "ananya@sfit.ac.in" }
      },
      {
        name: "Meera Joshi",
        role: "Web Developer",
        image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Developing and maintaining digital platforms.",
        social: { linkedin: "#", github: "#", email: "meera@sfit.ac.in" }
      }
    ],
    pr: [
      {
        name: "Ishita Agarwal",
        role: "PR Head",
        image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Managing external communications and partnerships.",
        social: { linkedin: "#", email: "ishita@sfit.ac.in" }
      }
    ],
    marketing: [
      {
        name: "Pooja Mehta",
        role: "Marketing Head",
        image: "https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Developing marketing strategies and brand promotion.",
        social: { linkedin: "#", email: "pooja@sfit.ac.in" }
      }
    ],
    creative: [
      {
        name: "Aditi Rao",
        role: "Creative Head",
        image: "https://images.pexels.com/photos/3184341/pexels-photo-3184341.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Leading design and creative content development.",
        social: { linkedin: "#", email: "aditi@sfit.ac.in" }
      }
    ],
    social: [
      {
        name: "Nisha Kapoor",
        role: "Social Media Head",
        image: "https://images.pexels.com/photos/3184343/pexels-photo-3184343.jpeg?auto=compress&cs=tinysrgb&w=400",
        bio: "Managing social media presence and engagement.",
        social: { linkedin: "#", email: "nisha@sfit.ac.in" }
      }
    ]
  };

  const currentMembers = teamMembers[activeCategory] || [];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our dedicated team of passionate individuals working together to create an inclusive 
            and empowering environment for women in engineering.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {teamCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <category.icon className="w-5 h-5 mr-2" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentMembers.map((member, index) => (
            <div
              key={member.name}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Member Image */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              {/* Member Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{member.bio}</p>

                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      className="w-10 h-10 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-800 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.email && (
                    <a
                      href={`mailto:${member.social.email}`}
                      className="w-10 h-10 bg-purple-100 hover:bg-purple-500 text-purple-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Want to Join Our Team?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for passionate individuals who want to make a difference 
              in the engineering community. Join us in our mission!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;