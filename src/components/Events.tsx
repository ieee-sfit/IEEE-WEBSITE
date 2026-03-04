import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Clock, Star } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

interface EventData {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  description: string;
  image: string;
  featured?: boolean;
  slug?: string;
  detailedDescription?: string;
  gallery?: string[];
  speaker?: {
    name: string;
    title: string;
    bio?: string;
  };
  organizer?: string;
  attendance?: {
    total: number;
    breakdown: {
      department: string;
      count: number;
    }[];
  };
  highlights?: string[];
}

const Events = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });

  const { ref: tabsRef, isVisible: tabsVisible } = useScrollAnimation({
    threshold: 0.5,
    triggerOnce: true
  });

  const { ref: eventsRef, visibleItems: eventsVisible } = useStaggeredAnimation(6, 200);

  const upcomingEvents: EventData[] = [
    {
      id: 1,
      title: "Women in Tech Summit 2024",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "SFIT Auditorium",
      attendees: 150,
      category: "Conference",
      description: "A day-long summit featuring industry leaders, technical workshops, and networking opportunities.",
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: true
    },
    {
      id: 2,
      title: "AI/ML Workshop Series",
      date: "March 22, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 1",
      attendees: 80,
      category: "Workshop",
      description: "Hands-on workshop covering machine learning fundamentals and practical applications.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 3,
      title: "Career Guidance Seminar",
      date: "April 5, 2024",
      time: "11:00 AM - 1:00 PM",
      location: "Seminar Hall",
      attendees: 120,
      category: "Seminar",
      description: "Expert guidance on career paths, interview preparation, and industry insights.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  const pastEvents: EventData[] = [
    {
      id: 4,
      slug: 'agentic-ai-workshop',
      title: "Agentic AI Workshop",
      date: "13/8/2025",
      time: "3:00 PM - 5:00 PM",
      location: "Room 614",
      attendees: 68,
      category: "Workshop",
      description: "A comprehensive workshop on Agentic Intelligence led by Mr. Craig D'souza, exploring AI agents and hands-on email automation.",
      image: "/events/agentic-ai-workshop/image1.jpg",
      detailedDescription: "The Agentic AI was organized by IEEE X WIE as an inspiring blend of technology and creativity, perfectly centered around a comprehensive Agentic Intelligence Manifested workshop. The session, led by Mr. Craig D'souza, a B.E. Computer Engineering student from St. Francis Institute of Technology and an enthusiastic AI researcher, brought participants real-world insights into Agentic AI systems while introducing them to this emerging field of AI agents.\n\nDuring this session, attendees explored the foundational understanding of AI agents, difference between traditional AI, generative AI and agentic AI and its core key characteristics. The core agent architecture, the cognitive module, and the model context protocol, the challenges and ethical considerations associated with AI agents, as well as their prospective advancements and future applications were also highlighted.\n\nIn addition, attendees had the opportunity to gain practical experience in building a simple email automation agent using tools such as Python, Gemini Pro API, and Simple Mail Transfer Protocol, making the event even more enriching.",
      gallery: [
        "/events/agentic-ai-workshop/image1.jpg",
        "/events/agentic-ai-workshop/image2.jpg",
        "/events/agentic-ai-workshop/image3.jpg"
      ],
      speaker: {
        name: "Mr. Craig D'souza",
        title: "B.E. Computer Engineering Student & AI Researcher",
        bio: "A B.E. Computer Engineering student from St. Francis Institute of Technology and an enthusiastic AI researcher with expertise in Agentic AI systems."
      },
      organizer: "IEEE X WIE",
      attendance: {
        total: 68,
        breakdown: [
          { department: "CMPN", count: 25 },
          { department: "INFT", count: 17 },
          { department: "AIML", count: 11 },
          { department: "EXTC", count: 8 },
          { department: "ELEC", count: 4 },
          { department: "ECS", count: 3 },
          { department: "MECH", count: 0 }
        ]
      },
      highlights: [
        "Foundational understanding of AI agents and their key characteristics",
        "Differences between traditional AI, generative AI, and agentic AI",
        "Core agent architecture and cognitive modules",
        "Model Context Protocol (MCP) implementation",
        "Challenges and ethical considerations in AI agents",
        "Hands-on experience building an email automation agent",
        "Practical tools: Python, Gemini Pro API, and SMTP"
      ]
    },
    {
      id: 5,
      title: "International Women's Day Celebration",
      date: "March 8, 2024",
      time: "9:00 AM - 12:00 PM",
      location: "SFIT Campus",
      attendees: 200,
      category: "Celebration",
      description: "Celebrating achievements of women in engineering with inspiring talks and cultural programs.",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 6,
      title: "Hackathon 2024",
      date: "February 20-21, 2024",
      time: "24 Hours",
      location: "Innovation Lab",
      attendees: 100,
      category: "Competition",
      description: "48-hour hackathon focusing on solutions for social good and sustainability.",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  const currentEvents: EventData[] = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-5 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          }`}>
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">Events</span>
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-200`}>
            Discover our exciting lineup of workshops, seminars, and networking events designed to
            empower and inspire the next generation of women engineers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div ref={tabsRef} className={`flex justify-center mb-12 transition-all duration-700 ${
          tabsVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'
        }`}>
          <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-500 relative overflow-hidden group ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="relative z-10">Upcoming Events</span>
              {activeTab !== 'upcoming' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-500 relative overflow-hidden group ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="relative z-10">Past Events</span>
              {activeTab !== 'past' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div ref={eventsRef} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {currentEvents.map((event, index) => (
            <div
              key={event.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 card-tilt relative ${
                event.featured ? 'lg:col-span-2 xl:col-span-2' : ''
              } ${
                eventsVisible[index] ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-12'
              } cursor-pointer`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onClick={() => event.slug ? navigate(`/events/${event.slug}`) : navigate('/events')}
            >
              {/* Event Image */}
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                    event.featured ? 'h-64' : 'h-48'
                  } group-hover:rotate-1`}
                />
                {/* Image overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-800 rounded-full hover:scale-105 transition-transform duration-300">
                    {event.category}
                  </span>
                </div>
                {event.featured && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full animate-pulse">
                      <Star className="w-4 h-4 mr-1 animate-spin" />
                      Featured
                    </div>
                  </div>
                )}

                {/* Hover overlay with play button effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 relative">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 group-hover:animate-pulse">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <Calendar className="w-4 h-4 mr-3 text-blue-500 group-hover:animate-bounce" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <Clock className="w-4 h-4 mr-3 text-purple-500 group-hover:animate-spin" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <MapPin className="w-4 h-4 mr-3 text-pink-500 group-hover:animate-pulse" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <Users className="w-4 h-4 mr-3 text-green-500 group-hover:animate-bounce" />
                      <span className="text-sm">{event.attendees} attendees</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => event.slug ? navigate(`/events/${event.slug}`) : navigate('/events')}
                    className="w-full btn-ripple btn-glow bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group/btn relative overflow-hidden"
                  >
                    <span className="relative z-10">{activeTab === 'upcoming' ? 'Register Now' : 'View Details'}</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/events')}
            className="btn-ripple px-8 py-4 bg-white text-gray-700 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">View All Events</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Event Details Modal removed — events open dedicated pages */}
      </div>
    </section>
  );
};

export default Events;
