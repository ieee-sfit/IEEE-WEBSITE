import React from 'react';
import { Calendar, MapPin, Users, Clock, X, TrendingUp, Award } from 'lucide-react';

interface AttendanceStats {
  total: number;
  breakdown: {
    department: string;
    count: number;
  }[];
}

interface EventDetailsData {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  description: string;
  detailedDescription?: string;
  image: string;
  gallery?: string[];
  featured?: boolean;
  attendance?: AttendanceStats;
  organizer?: string;
  speaker?: {
    name: string;
    title: string;
    bio?: string;
  };
  highlights?: string[];
}

interface EventDetailsProps {
  event: EventDetailsData;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header Image */}
        <div className="relative">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-96 object-cover rounded-t-2xl" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-2xl"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 group"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-800 rounded-full">
              {event.category}
            </span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-4xl font-bold text-white mb-2">{event.title}</h2>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Description Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h3>
            <div className="text-gray-600 leading-relaxed space-y-4">
              {event.detailedDescription ? (
                event.detailedDescription.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{event.description}</p>
              )}
            </div>
          </div>

          {/* Speaker Section */}
          {event.speaker && (
            <div className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-purple-600" />
                Speaker
              </h3>
              <div>
                <h4 className="text-xl font-semibold text-gray-800">{event.speaker.name}</h4>
                <p className="text-purple-600 mb-2">{event.speaker.title}</p>
                {event.speaker.bio && (
                  <p className="text-gray-600 leading-relaxed">{event.speaker.bio}</p>
                )}
              </div>
            </div>
          )}

          {/* Highlights Section */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Event Highlights</h3>
              <ul className="space-y-3">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery Section */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Event Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.gallery.map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-xl group cursor-pointer">
                    <img 
                      src={image} 
                      alt={`${event.title} - Photo ${index + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Statistics */}
          {event.attendance && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                Attendance Statistics
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {event.attendance.total}
                    </span>
                    <span className="text-gray-600">Total Participants</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 mb-3">Department-wise Breakdown</h4>
                  {event.attendance?.breakdown.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <span className="text-gray-700 font-medium min-w-[100px]">{dept.department}</span>
                        <div className="flex-1 mx-4 bg-white rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${event.attendance ? (dept.count / event.attendance.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-gray-600 font-semibold min-w-[40px] text-right">{dept.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Event Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <Users className="w-8 h-8 mb-2 opacity-80" />
              <div className="text-3xl font-bold mb-1">{event.attendees}+</div>
              <div className="text-blue-100">Participants</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <Calendar className="w-8 h-8 mb-2 opacity-80" />
              <div className="text-3xl font-bold mb-1">{event.date}</div>
              <div className="text-purple-100">Event Date</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
              <MapPin className="w-8 h-8 mb-2 opacity-80" />
              <div className="text-3xl font-bold mb-1">{event.location}</div>
              <div className="text-pink-100">Venue</div>
            </div>
          </div>

          {/* Organizer Info */}
          {event.organizer && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">Organized by:</span> {event.organizer}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              View More Events
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
