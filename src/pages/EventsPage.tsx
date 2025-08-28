import React, { useState } from 'react';
import { Calendar, MapPin, Users, ArrowRight, Clock, Star, Award, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';
import Counter from '../components/Counter';

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });
  
  const { ref: timelineRef, visibleItems: timelineVisible } = useStaggeredAnimation(8, 200);

  const allEvents = [
    {
      id: 1,
      title: "Women in Tech Summit 2024",
      date: "2024-03-15",
      displayDate: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "SFIT Auditorium",
      attendees: 150,
      category: "Conference",
      status: "upcoming",
      description: "A comprehensive day-long summit featuring industry leaders, technical workshops, networking opportunities, and career guidance sessions.",
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: true,
      speakers: ["Dr. Priya Sharma", "Ms. Anita Gupta", "Prof. Kavita Singh"],
      topics: ["AI in Healthcare", "Women Leadership", "Startup Ecosystem"],
      registrations: 120,
      satisfaction: 98
    },
    {
      id: 2,
      title: "AI/ML Workshop Series",
      date: "2024-03-22",
      displayDate: "March 22, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Computer Lab 1",
      attendees: 80,
      category: "Workshop",
      status: "upcoming",
      description: "Hands-on workshop covering machine learning fundamentals, practical applications, and real-world project implementation.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      speakers: ["Dr. Rajesh Kumar", "Ms. Meera Patel"],
      topics: ["Python for ML", "Deep Learning", "Computer Vision"],
      registrations: 65,
      satisfaction: 95
    },
    {
      id: 3,
      title: "Career Guidance Seminar",
      date: "2024-04-05",
      displayDate: "April 5, 2024",
      time: "11:00 AM - 1:00 PM",
      location: "Seminar Hall",
      attendees: 120,
      category: "Seminar",
      status: "upcoming",
      description: "Expert guidance on career paths, interview preparation, industry insights, and professional development strategies.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      speakers: ["Ms. Shruti Agarwal", "Mr. Vikram Malhotra"],
      topics: ["Interview Skills", "Resume Building", "Industry Trends"],
      registrations: 100,
      satisfaction: 92
    },
    {
      id: 4,
      title: "International Women's Day Celebration",
      date: "2024-03-08",
      displayDate: "March 8, 2024",
      time: "9:00 AM - 12:00 PM",
      location: "SFIT Campus",
      attendees: 200,
      category: "Celebration",
      status: "completed",
      description: "Celebrating achievements of women in engineering with inspiring talks, cultural programs, and recognition ceremonies.",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800",
      speakers: ["Prof. Sunita Sharma", "Ms. Riya Desai", "Dr. Neha Verma"],
      topics: ["Women in STEM", "Breaking Barriers", "Future Leaders"],
      attendeesActual: 200,
      satisfaction: 96
    },
    {
      id: 5,
      title: "Hackathon 2024: Code for Change",
      date: "2024-02-20",
      displayDate: "February 20-21, 2024",
      time: "24 Hours",
      location: "Innovation Lab",
      attendees: 100,
      category: "Competition",
      status: "completed",
      description: "48-hour hackathon focusing on solutions for social good, sustainability, and technological innovation.",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
      speakers: ["Tech Mentors", "Industry Judges"],
      topics: ["Social Impact", "Green Tech", "Innovation"],
      attendeesActual: 100,
      satisfaction: 94,
      winners: 3,
      projects: 25
    },
    {
      id: 6,
      title: "Blockchain & Web3 Workshop",
      date: "2024-01-25",
      displayDate: "January 25, 2024",
      time: "3:00 PM - 6:00 PM",
      location: "Tech Lab",
      attendees: 60,
      category: "Workshop",
      status: "completed",
      description: "Introduction to blockchain technology, cryptocurrency, smart contracts, and Web3 development.",
      image: "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=800",
      speakers: ["Mr. Arjun Patel", "Ms. Nisha Agrawal"],
      topics: ["Blockchain Basics", "Smart Contracts", "DeFi"],
      attendeesActual: 60,
      satisfaction: 91
    },
    {
      id: 7,
      title: "Cybersecurity Awareness Seminar",
      date: "2023-12-15",
      displayDate: "December 15, 2023",
      time: "2:00 PM - 4:00 PM",
      location: "Main Auditorium",
      attendees: 180,
      category: "Seminar",
      status: "completed",
      description: "Essential cybersecurity practices, threat awareness, and digital safety for engineering students.",
      image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800",
      speakers: ["Dr. Amit Singh", "Ms. Pooja Sharma"],
      topics: ["Cyber Threats", "Data Protection", "Safe Practices"],
      attendeesActual: 180,
      satisfaction: 89
    },
    {
      id: 8,
      title: "IoT Innovation Workshop",
      date: "2023-11-30",
      displayDate: "November 30, 2023",
      time: "10:00 AM - 4:00 PM",
      location: "Electronics Lab",
      attendees: 70,
      category: "Workshop",
      status: "completed",
      description: "Hands-on experience with IoT devices, sensor integration, and smart system development.",
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
      speakers: ["Prof. Rakesh Kumar", "Ms. Asha Patel"],
      topics: ["IoT Fundamentals", "Sensor Networks", "Smart Devices"],
      attendeesActual: 70,
      satisfaction: 93
    }
  ];

  const filteredEvents = activeFilter === 'all' 
    ? allEvents 
    : allEvents.filter(event => 
        activeFilter === 'upcoming' ? event.status === 'upcoming' : event.status === 'completed'
      );

  const statsData = [
    { icon: Award, value: 25, suffix: '+', label: 'Events Organized', color: 'blue' },
    { icon: Users, value: 850, suffix: '+', label: 'Total Participants', color: 'purple' },
    { icon: TrendingUp, value: 94, suffix: '%', label: 'Avg Satisfaction', color: 'green' },
    { icon: Target, value: 15, suffix: '+', label: 'Industry Partners', color: 'pink' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Row 1 */}
  <div className="absolute top-10 left-5 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
  <div className="absolute top-20 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2000"></div>
  <div className="absolute top-40 left-1/3 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-4000"></div>
  <div className="absolute top-60 right-1/4 w-28 h-28 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-1000"></div>
  <div className="absolute top-80 left-10 w-36 h-36 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-3000"></div>

  {/* Row 2 */}
  <div className="absolute top-[30rem] left-1/5 w-44 h-44 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
  <div className="absolute top-[34rem] right-20 w-52 h-52 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-1500"></div>
  <div className="absolute top-[38rem] left-1/2 w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2500"></div>
  <div className="absolute top-[42rem] right-1/3 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-3500"></div>
  <div className="absolute top-[46rem] left-16 w-30 h-30 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-500"></div>


 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div ref={headerRef} className="text-center mb-16">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
            }`}>
              Events <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">Timeline</span>
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
              headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
            } animation-delay-200`}>
              Explore our comprehensive timeline of workshops, seminars, and networking events 
              designed to empower women engineers and foster technological innovation.
            </p>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${
            headerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-400`}>
            {statsData.map((stat, index) => (
              <div 
                key={stat.label}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 card-tilt text-center animation-delay-${600 + index * 100}`}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600`} />
                <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                  <Counter endValue={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className={`flex justify-center mb-12 transition-all duration-700 ${
            headerVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'
          } animation-delay-800`}>
            <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
              {['all', 'upcoming', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 capitalize ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {filter} Events
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Timeline */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={timelineRef} className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>

            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex items-center mb-16 transition-all duration-700 ${
                  timelineVisible[index] ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Timeline dot */}
                <div className={`absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-lg z-10 ${
                  event.status === 'upcoming' ? 'bg-blue-600' : 'bg-green-600'
                }`}></div>

                {/* Event card */}
                <div className={`w-full md:w-5/12 ${
                  index % 2 === 0 ? 'md:ml-auto md:pl-16' : 'md:pr-16'
                } ml-16 md:ml-0`}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 card-tilt overflow-hidden group">
                    {/* Event image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          event.status === 'upcoming' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {event.category}
                        </span>
                      </div>
                      {event.featured && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full">
                            <Star className="w-4 h-4 mr-1" />
                            Featured
                          </div>
                        </div>
                      )}
                      {event.status === 'completed' && (
                        <div className="absolute bottom-4 right-4">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                      )}
                    </div>

                    {/* Event content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {event.title}
                        </h3>
                        <span className="text-sm text-gray-500">{event.displayDate}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Event details */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-green-500" />
                          {event.status === 'upcoming' ? `${event.registrations}/${event.attendees}` : event.attendeesActual || event.attendees} attendees
                        </div>
                        {event.satisfaction && (
                          <div className="flex items-center text-gray-600">
                            <Award className="w-4 h-4 mr-2 text-yellow-500" />
                            {event.satisfaction}% satisfaction
                          </div>
                        )}
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.topics.map((topic, topicIndex) => (
                          <span 
                            key={topicIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors duration-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Speakers */}
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Speakers:</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.speakers.map((speaker, speakerIndex) => (
                            <span 
                              key={speakerIndex}
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
                            >
                              {speaker}
                              {speakerIndex < event.speakers.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action button */}
                      {event.status === 'upcoming' && (
                        <button className="w-full mt-4 btn-glow bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group/btn">
                          <span>Register Now</span>
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
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

export default EventsPage;
