import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Clock,
  Star,
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  Play
} from 'lucide-react';

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    setIsVisible(true);

    const csvUrl = "https://docs.google.com/spreadsheets/d/1ePRaRYTrnNrd4jBR95qBBN5kEiYI-2gaM-UoSPxn9DU/export?format=csv&gid=0";

    // Fetch CSV data and parse it
    const fetchEvents = async () => {
      try {
        const res = await fetch(csvUrl);
        const csvText = await res.text();

        const events = csvToJson(csvText);
        setAllEvents(events);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEvents();
  }, []);

  // Parse CSV to array of objects, split multi-item fields, convert datatypes
  const csvToJson = (csvText) => {
    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
      // For robust CSV splitting, this is a simple splitter (may fail if commas inside quotes)
      // For production, consider using PapaParse or similar CSV parser
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      const event = {};
      headers.forEach((header, i) => {
        let val = values[i] ? values[i].replace(/^"|"$/g, '') : ''; // Remove quotes around values if present

        if (['id', 'attendees', 'registrations', 'satisfaction'].includes(header)) {
          val = Number(val);
        }

        if (header === 'Featured') {
          val = val.trim().toLowerCase() === 'true';
        }

        if (['speakers', 'topics', 'highlights'].includes(header)) {
          val = val ? val.split(/,\s*/).map(s => s.trim()) : [];
        }

        event[header] = val;
      });
      return event;
    });
  };

  const featuredEvent = allEvents.find(event => event.Featured);

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

  const orbColors = [
    'bg-purple-200', 'bg-blue-200', 'bg-pink-200',
    'bg-yellow-200', 'bg-green-200', 'bg-indigo-200',
    'bg-red-200', 'bg-teal-200', 'bg-orange-200'
  ];

  const orbAnimations = [
    'animate-pulse', 'animate-bounce', 'animate-[float_10s_ease-in-out_infinite]',
    'animate-[float_12s_ease-in-out_infinite]', 'animate-[float_15s_ease-in-out_infinite]'
  ];

  const orbSizes = [16, 20, 24, 28, 32, 36, 40, 44, 48];

  const orbs = Array.from({ length: 50 }).map((_, i) => {
    const width = orbSizes[Math.floor(Math.random() * orbSizes.length)];
    const height = orbSizes[Math.floor(Math.random() * orbSizes.length)];
    const sizeClass = `w-${width} h-${height}`;
    const colorClass = orbColors[Math.floor(Math.random() * orbColors.length)];
    const animationClass = orbAnimations[Math.floor(Math.random() * orbAnimations.length)];
    const top = Math.floor(Math.random() * 100);
    const left = Math.floor(Math.random() * 100);

    return (
      <div
        key={`orb-${i}`}
        className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-30 ${sizeClass} ${colorClass} ${animationClass} transform-gpu will-change-transform`}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden select-none">
      {orbs}

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-20">
          <div className="text-center mb-16">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Featured Events and Workshops</span>
            </h1>
            <p className={`max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              Explore our comprehensive timeline of workshops, seminars, and networking events designed to empower women engineers and foster technological innovation.
            </p>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
            {statsData.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-center cursor-default select-none"
                  style={{ transitionDelay: `${600 + i * 100}ms` }}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600 animate-pulse`} />
                  <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-600 text-sm select-text">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {featuredEvent && (
            <section className={`pb-12 transition-all duration-1000 ease-out delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50 flex flex-col md:flex-row">
                    <div
                      className="md:w-1/2 relative overflow-hidden h-96 md:h-auto flex items-center justify-center"
                      style={{ backgroundImage: `url(${featuredEvent.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/30"></div>
                      <div className="relative z-10 text-center text-white p-8">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 inline-block select-none">
                          <span className="text-sm font-semibold">FEATURED EVENT</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                          {featuredEvent.title}
                        </h2>
                        <div className="flex items-center justify-center text-lg mb-6 gap-2">
                          <Calendar className="w-5 h-5 text-white" />
                          <span>{featuredEvent.displayDate}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                          {(featuredEvent.highlights || []).map((highlight, idx) => (
                            <span key={idx} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm cursor-default select-text">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer select-none group">
                          <Play className="w-6 h-6 text-white ml-1 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold select-none">
                          {featuredEvent.category}
                        </span>
                        <Star className="w-5 h-5 text-yellow-500 fill-current drop-shadow-md" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">
                        {featuredEvent.title}
                      </h3>
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {featuredEvent.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-8 text-gray-600">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">{featuredEvent.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-pink-500" />
                          <span className="font-medium">{featuredEvent.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">{featuredEvent.registrations}/{featuredEvent.attendees}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-green-500" />
                          <span className="font-medium">{featuredEvent.satisfaction}%</span>
                        </div>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 select-none">Featured Speakers</h4>
                        <div className="flex flex-wrap gap-2">
                          {featuredEvent.speakers.map((speaker, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-4 py-2 rounded-full text-blue-700 font-medium cursor-default select-text hover:scale-105 transition-transform duration-300" title={speaker}>
                              {speaker}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group select-none" aria-label="Register for featured event">
                        <span>Register Now</span>
                        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className={`flex justify-center mb-20 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '800ms' }}>
            <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200 flex gap-2 select-none">
              {['all', 'upcoming', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 capitalize whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  aria-pressed={activeFilter === filter}
                  aria-label={`Filter events by ${filter}`}
                >
                  {filter} Events
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, i) => (
              <div
                key={event.id}
                className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${1000 + i * 200}ms` }}
              >
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden border border-gray-100 hover:border-gray-200 group h-full flex flex-col cursor-pointer select-none transform hover:-translate-y-1 hover:scale-[1.03] will-change-transform">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    {event.Featured && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-pulse select-none">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4 min-h-[4rem]">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 ease-out flex-1 pr-4 line-clamp-2" title={event.title}>
                        {event.title}
                      </h3>
                      <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap select-text" title={event.displayDate}>
                        {event.displayDate}
                      </span>
                    </div>

                    <div className="mb-4 h-20">
                      <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm transition-opacity duration-300 ease-out group-hover:opacity-80" title={event.description}>
                        {event.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm h-24">
                      <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Clock className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                        <span className="truncate" title={event.time}>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <MapPin className="w-4 h-4 mr-2 text-pink-500 flex-shrink-0" />
                        <span className="truncate" title={event.location}>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Users className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                        <span className="truncate" title={`${event.status === 'upcoming' ? `${event.registrations}/${event.attendees}` : event.attendees} attendees`}>
                          {event.status === 'upcoming' ? `${event.registrations}/${event.attendees}` : event.attendees} attendees
                        </span>
                      </div>
                      {event.satisfaction ? (
                        <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                          <Award className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                          <span className="truncate" title={`${event.satisfaction}% satisfaction`}>{event.satisfaction}% satisfaction</span>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-2 rounded-lg opacity-50"></div>
                      )}
                    </div>

                    <div className="mb-4 h-16 overflow-hidden">
                      <div className="flex flex-wrap gap-2">
                        {event.topics.slice(0, 4).map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all duration-300 ease-out whitespace-nowrap cursor-default select-text"
                            title={topic}
                          >
                            {topic}
                          </span>
                        ))}
                        {event.topics.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full select-text cursor-default" title={`${event.topics.length - 4} more`}>
                            +{event.topics.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-6 h-16">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 select-none">Speakers:</h4>
                      <div className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300 ease-out line-clamp-2 select-text" title={event.speakers.join(', ')}>
                        {event.speakers.join(', ')}
                      </div>
                    </div>

                    <div className="mt-auto">
                      {event.status === 'upcoming' ? (
                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 ease-out flex items-center justify-center group select-none cursor-pointer">
                          <span>Register Now</span>
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                        </button>
                      ) : (
                        <div className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center select-none">
                          <CheckCircle className="mr-2 w-4 h-4" />
                          Event Completed
                        </div>
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
