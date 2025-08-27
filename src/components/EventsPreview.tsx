import React from 'react';
import { Calendar, MapPin, Users, ArrowRight, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const EventsPreview = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });

  const featuredEvents = [
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

  return (
    <section id="events-preview" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-5 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          }`}>
            Upcoming <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">Events</span>
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-200`}>
            Join us for exciting workshops, seminars, and networking events designed to 
            empower and inspire the next generation of women engineers.
          </p>
        </div>

        {/* Featured Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {featuredEvents.map((event, index) => (
            <div
              key={event.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 card-tilt relative cursor-pointer ${
                headerVisible ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${400 + index * 200}ms` }}
            >
              {/* Event Image */}
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 group-hover:rotate-1"
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
              </div>

              {/* Event Content */}
              <div className="p-6 relative">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 group-hover:animate-pulse">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <Calendar className="w-4 h-4 mr-3 text-blue-500 group-hover:animate-bounce" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <Users className="w-4 h-4 mr-3 text-green-500 group-hover:animate-bounce" />
                      <span className="text-sm">{event.attendees} attendees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Event Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 transition-all duration-700 ${
          headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
        } animation-delay-800`}>
          {[
            { number: '25+', label: 'Events Organized', color: 'blue' },
            { number: '500+', label: 'Total Attendees', color: 'purple' },
            { number: '15+', label: 'Industry Experts', color: 'pink' },
            { number: '10+', label: 'Workshop Series', color: 'indigo' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className={`text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 card-tilt animation-delay-${900 + index * 100}`}
            >
              <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* View All Events Button */}
        <div className={`text-center transition-all duration-700 ${
          headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
        } animation-delay-1200`}>
          <Link 
            to="/events" 
            className="btn-ripple btn-glow inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">View All Events & Timeline</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
