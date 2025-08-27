import React, { useState } from 'react';
import { Calendar, MapPin, Users, ArrowRight, Clock, Star } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });

  const { ref: tabsRef, isVisible: tabsVisible } = useScrollAnimation({
    threshold: 0.5,
    triggerOnce: true
  });

  const { ref: eventsRef, visibleItems: eventsVisible } = useStaggeredAnimation(6, 200);

  const upcomingEvents = [
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

  const pastEvents = [
    {
      id: 4,
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
      id: 5,
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

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

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
              onClick={() => setSelectedEvent(event)}
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
                  <button className="w-full btn-ripple btn-glow bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group/btn relative overflow-hidden">
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
          <button className="btn-ripple px-8 py-4 bg-white text-gray-700 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden group">
            <span className="relative z-10">View All Events</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Simple Modal for Event Details */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={() => setSelectedEvent(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-64 object-cover rounded-t-2xl" />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                  <span className="text-gray-600">×</span>
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedEvent.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{selectedEvent.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-purple-500" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-pink-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-green-500" />
                    <span>{selectedEvent.attendees} attendees</span>
                  </div>
                </div>
                <button className="w-full btn-glow bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  {activeTab === 'upcoming' ? 'Register for Event' : 'View Event Gallery'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
