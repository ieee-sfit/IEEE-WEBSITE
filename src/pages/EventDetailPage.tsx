import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  Calendar, MapPin, Users, Clock, Award, TrendingUp,
  CheckCircle, Tag, User, Building2, ChevronRight, ExternalLink, ZoomIn, X
} from 'lucide-react';
import { getEventBySlug, eventsData, EventData } from '../data/eventsData';
import Footer from '../components/Footer';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (slug) {
      const found = getEventBySlug(slug);
      if (found) {
        setEvent(found);
      } else {
        navigate('/events', { replace: true });
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, navigate]);

  if (!event) return null;

  const relatedEvents = eventsData
    .filter((e) => e.slug !== event.slug && e.category === event.category)
    .slice(0, 3)
    .concat(
      eventsData
        .filter(
          (e) =>
            e.slug !== event.slug &&
            e.category !== event.category
        )
        .slice(0, Math.max(0, 3 - eventsData.filter((e) => e.slug !== event.slug && e.category === event.category).length))
    )
    .slice(0, 3);

  const maxAttendance =
    event.attendance
      ? Math.max(...event.attendance.breakdown.map((d) => d.count), 1)
      : 1;

  const handleImgError = (src: string) => {
    setImgErrors((prev) => ({ ...prev, [src]: true }));
  };

  const statusColor =
    event.status === 'completed'
      ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50'
      : 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 dark:text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src={imgErrors[event.image] ? '/fallback.jpg' : event.image}
          alt={event.title}
          onError={() => handleImgError(event.image)}
          className="w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.55)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />


        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-12 pb-10 max-w-6xl mx-auto w-full" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/events" className="hover:text-white transition-colors">Events</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white truncate max-w-[200px]">{event.title}</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
              {event.category}
            </span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>
              {event.status === 'completed' ? '✓ Completed' : '● Upcoming'}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            {event.title}
          </motion.h1>

          <div className="flex flex-wrap gap-5 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{event.displaydate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{event.attendees} Participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-12">

            {/* About section */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full inline-block" />
                About This Event
              </h2>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 text-base">
                {(event.detailedDescription || event.description)
                  .split('\n')
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
            </motion.section>

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full inline-block" />
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i * 0.5}
                      className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl px-4 py-3 border border-blue-100 dark:border-blue-800/30"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm leading-snug">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Speaker */}
            {event.speaker && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full inline-block" />
                  Speaker
                </h2>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 flex gap-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{event.speaker.name}</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium text-sm mb-2">{event.speaker.title}</p>
                    {event.speaker.bio && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{event.speaker.bio}</p>
                    )}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full inline-block" />
                  Event Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden rounded-xl cursor-pointer group aspect-video bg-gray-100 dark:bg-gray-800"
                      onClick={() => setLightboxImg(img)}
                    >
                      <img
                        src={imgErrors[img] ? '/fallback.jpg' : img}
                        alt={`${event.title} — Photo ${i + 1}`}
                        onError={() => handleImgError(img)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Attendance Chart */}
            {event.attendance && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full inline-block" />
                  Attendance Breakdown
                </h2>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Participants</p>
                      <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{event.attendance.total}</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-blue-500 opacity-60" />
                  </div>
                  <div className="space-y-3">
                    {event.attendance.breakdown.map((dept, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-14 flex-shrink-0">{dept.department}</span>
                        <div className="flex-1 bg-white/70 dark:bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(dept.count / maxAttendance) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-8 text-right">{dept.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Topics */}
            {event.topics && event.topics.length > 0 && (
              <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5}>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full inline-block" />
                  Topics Covered
                </h2>
                <div className="flex flex-wrap gap-2">
                  {event.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800/50"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right: Sidebar — both cards wrapped in one sticky block */}
          <div className="sticky top-24 space-y-6 self-start">

            {/* Quick Info Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5">Event Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Date</p>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{event.displaydate}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Time</p>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{event.time}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Location</p>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{event.location}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Participants</p>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{event.attendees}</p>
                  </div>
                </li>
                {event.organizer && (
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Organizer</p>
                      <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{event.organizer}</p>
                    </div>
                  </li>
                )}
                {event.satisfaction && (
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Satisfaction</p>
                      <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{event.satisfaction}%</p>
                    </div>
                  </li>
                )}
              </ul>

              {/* CTA */}
              <div className="mt-6">
                {event.status === 'completed' ? (
                  <div className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Event Completed
                  </div>
                ) : event.form ? (
                  <a
                    href={event.form}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    Register Now <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold text-center">
                    Coming Soon ✨
                  </div>
                )}
              </div>
            </motion.div>

            {/* Speakers card */}
            {event.speakers && event.speakers.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Speakers</h3>
                <ul className="space-y-2">
                  {event.speakers.map((sp, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      {sp}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">More Events</h2>
              <Link
                to="/events"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((rel, i) => (
                <motion.div
                  key={rel.id}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/events/${rel.slug}`)}
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={imgErrors[rel.image] ? '/fallback.jpg' : rel.image}
                      alt={rel.title}
                      onError={() => handleImgError(rel.image)}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                      {rel.category}
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 dark:text-gray-100 line-clamp-2 text-sm leading-snug">
                      {rel.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-2 text-gray-500 dark:text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      {rel.displaydate}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxImg(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImg}
            alt="Gallery"
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventDetailPage;
