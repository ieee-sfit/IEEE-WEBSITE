import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Users, ArrowRight, Clock, Star, Award, TrendingUp,
  Target, CheckCircle
} from 'lucide-react';
import Footer from '../components/Footer';
import { eventsData } from '../data/eventsData';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: 'easeOut' as const }
  })
};
const cardStagger = {
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};
const cardItem = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 + 1, duration: 0.8, ease: 'easeOut' as const }
  })
};
const heroTitleReveal = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 1.2
    }
  }
};
const magneticHover = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.05,
    rotate: [-1, 1, -1, 0],
    transition: {
      rotate: {
        repeat: 2,
        duration: 0.3
      },
      scale: {
        duration: 0.2
      }
    }
  }
};
const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 10px rgba(147, 51, 234, 0.15)",
      "0 0 20px rgba(147, 51, 234, 0.25)",
      "0 0 10px rgba(147, 51, 234, 0.15)"
    ],
    scale: [1, 1.01, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};
const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20
    }
  }
};
const slideInRight = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20
    }
  }
};
const morphingCard = {
  rest: {
    scale: 1,
    rotateY: 0,
    z: 0
  },
  hover: {
    scale: 1.03,
    rotateY: 5,
    z: 50,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  }
};

// Static config — defined outside component to avoid re-creation on every render
const STATS_DATA = [
  { icon: Award, value: 10, suffix: '+', label: 'Events Organized', color: 'blue', textClass: 'text-blue-600' },
  { icon: Users, value: 1200, suffix: '+', label: 'Total Participants', color: 'purple', textClass: 'text-purple-600' },
  { icon: TrendingUp, value: 89, suffix: '%', label: 'Avg Satisfaction', color: 'green', textClass: 'text-green-600' },
  { icon: Target, value: 8, suffix: '', label: 'Completed Events', color: 'pink', textClass: 'text-pink-600' },
];

// Fixed orb positions (deterministic — no Math.random on render)
const ORB_CONFIG = [
  { color: 'bg-purple-200', w: 40, h: 40, top: 8, left: 5 },
  { color: 'bg-blue-200', w: 32, h: 32, top: 20, left: 80 },
  { color: 'bg-pink-200', w: 48, h: 48, top: 60, left: 15 },
  { color: 'bg-yellow-200', w: 24, h: 24, top: 75, left: 70 },
  { color: 'bg-green-200', w: 36, h: 36, top: 40, left: 55 },
  { color: 'bg-indigo-200', w: 28, h: 28, top: 15, left: 40 },
  { color: 'bg-teal-200', w: 44, h: 44, top: 85, left: 90 },
  { color: 'bg-orange-200', w: 20, h: 20, top: 50, left: 30 },
  { color: 'bg-purple-200', w: 32, h: 32, top: 30, left: 92 },
  { color: 'bg-blue-200', w: 48, h: 48, top: 70, left: 45 },
  { color: 'bg-pink-200', w: 24, h: 24, top: 5, left: 65 },
  { color: 'bg-green-200', w: 36, h: 36, top: 92, left: 25 },
];

// Hardcoded events array with form link field and sorted with new IDs


const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const getSlug = (id: number) => eventsData.find((e) => e.id === id)?.slug ?? null;

  const allEvents = eventsData;
  const featuredEvent = allEvents.find(event => event.featured);

  const statsData = STATS_DATA;

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return allEvents;
    if (activeFilter === 'upcoming') return allEvents.filter(e => e.status === 'upcoming');
    return allEvents.filter(e => e.status === 'completed');
  }, [activeFilter]);

  // Orbs rendered once — stable between re-renders
  const orbs = useMemo(() => ORB_CONFIG.map((o, i) => (
    <div
      key={`orb-${i}`}
      className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-20 ${o.color}`}
      style={{ width: `${o.w}px`, height: `${o.h}px`, top: `${o.top}%`, left: `${o.left}%`, zIndex: 0, pointerEvents: 'none' }}
    />
  )), []);

  const handleImgError = useCallback((e: { currentTarget: HTMLImageElement }) => {
    e.currentTarget.src = '/fallback.jpg';
    e.currentTarget.onerror = null; // prevent infinite loop if fallback also fails
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden select-none">
      {/* Loading Screen */}
      {/* <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-600 z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full"
            />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-4 text-white text-xl font-semibold"
            >
              Loading Amazing Events...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        {orbs}
      </div>

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-20">
          <motion.div
            variants={heroTitleReveal}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.span
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                Featured Events and Workshops
              </motion.span>
            </motion.h1>
            <motion.p
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed"
            >
              Explore our timeline of workshops, seminars, and events designed to empower women engineers.
            </motion.p>
          </motion.div>

          <motion.div
            variants={cardStagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {statsData.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  variants={magneticHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  animate={pulseGlow.animate}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center cursor-default select-none relative overflow-hidden"
                  key={stat.label}
                >
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                      background: [
                        `radial-gradient(circle at 20% 20%, ${stat.color === 'blue' ? 'rgb(59, 130, 246)' : stat.color === 'purple' ? 'rgb(147, 51, 234)' : stat.color === 'green' ? 'rgb(34, 197, 94)' : 'rgb(236, 72, 153)'} 0%, transparent 50%)`,
                        `radial-gradient(circle at 80% 80%, ${stat.color === 'blue' ? 'rgb(59, 130, 246)' : stat.color === 'purple' ? 'rgb(147, 51, 234)' : stat.color === 'green' ? 'rgb(34, 197, 94)' : 'rgb(236, 72, 153)'} 0%, transparent 50%)`,
                        `radial-gradient(circle at 20% 20%, ${stat.color === 'blue' ? 'rgb(59, 130, 246)' : stat.color === 'purple' ? 'rgb(147, 51, 234)' : stat.color === 'green' ? 'rgb(34, 197, 94)' : 'rgb(236, 72, 153)'} 0%, transparent 50%)`
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.12, 1],
                      opacity: [1, 0.8, 1],
                      rotateY: [0, 10, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.textClass} relative z-10`} />
                  </motion.div>
                  <motion.div
                    className={`text-3xl font-bold ${stat.textClass} mb-2 relative z-10`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: i * 0.2 + 0.5,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2 + 0.8 }}
                    >
                      {stat.value}{stat.suffix}
                    </motion.span>
                  </motion.div>
                  <div className="text-gray-600 text-sm select-text relative z-10">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.section
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
            className="pb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <h2 className="text-2xl font-bold text-gray-800">Featured Event</h2>
            </div>

            {featuredEvent ? (
              <div className="relative group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.02, 1],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  variants={morphingCard}
                  initial="rest"
                  whileHover="hover"
                  className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50 flex flex-col md:flex-row"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    className="md:w-1/2 relative overflow-hidden h-96 md:h-auto flex items-center justify-center"
                    style={{
                      backgroundImage: `url(${featuredEvent.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    whileHover={{
                      scale: 1.02
                    }}
                  >

                  </motion.div>
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
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.07, boxShadow: "0 2px 8px rgba(80,30,250,0.15)" }}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-4 py-2 rounded-full text-blue-700 font-medium select-text cursor-pointer"
                            title={speaker}
                          >
                            {speaker}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{
                        scale: 1.06,
                        boxShadow: "0 8px 32px rgba(100,50,240,0.14)",
                        background: "linear-gradient(45deg, rgb(147, 51, 234), rgb(236, 72, 153))"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-lg flex items-center justify-center group select-none relative overflow-hidden"
                      aria-label="Featured event action"
                      onClick={() => featuredEvent.status !== 'completed' && featuredEvent.form ? window.open(featuredEvent.form, "_blank") : undefined}
                      style={{ cursor: featuredEvent.status === 'completed' || !featuredEvent.form ? 'default' : 'pointer' }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                      />
                      {featuredEvent.status === 'completed' ? (
                        <span className="relative z-10">✓ Event Completed</span>
                      ) : featuredEvent.form ? (
                        <><span className="relative z-10">Register Now </span>✨<ArrowRight className="ml-2 w-4 h-4" /></>
                      ) : (
                        <span className="relative z-10">⏰ Coming Soon</span>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="relative group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-600 rounded-3xl blur-xl opacity-15"
                  animate={{
                    scale: [1, 1.03, 1],
                    opacity: [0.15, 0.22, 0.15]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-200/60">
                  <div className="relative px-8 py-16 md:py-20 flex flex-col items-center justify-center text-center overflow-hidden">
                    {/* Animated shimmer background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/60 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                      style={{ width: "50%" }}
                    />

                    {/* Pulsing star cluster */}
                    <motion.div
                      className="relative mb-6"
                      animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg">
                        <Star className="w-10 h-10 text-purple-400" />
                      </div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400"
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div
                        className="absolute -bottom-1 -left-2 w-3 h-3 rounded-full bg-pink-400"
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      <motion.div
                        className="absolute top-1 -left-3 w-2 h-2 rounded-full bg-blue-400"
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                      />
                    </motion.div>

                    <motion.h3
                      className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto]"
                      animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    >
                      No Featured Event Right Now
                    </motion.h3>
                    <p className="text-gray-500 text-lg max-w-md mb-6 leading-relaxed">
                      Something amazing is brewing behind the scenes.
                      <br />
                      <span className="font-medium text-purple-500">Stay tuned — the next big event is just around the corner! 🚀</span>
                    </p>
                    <motion.div
                      className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-200"
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(147, 51, 234, 0)",
                          "0 0 12px rgba(147, 51, 234, 0.15)",
                          "0 0 0px rgba(147, 51, 234, 0)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Check out our past events below</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </motion.section>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex justify-center mb-20"
          >
            <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200 flex overflow-x-auto flex-nowrap gap-2 md:gap-4 px-2 hide-scrollbar">
              {['all', 'upcoming', 'completed'].map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`min-w-max px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all capitalize whitespace-nowrap relative overflow-hidden text-sm md:text-base ${activeFilter === filter
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  aria-pressed={activeFilter === filter}
                  aria-label={`Filter events by ${filter}`}
                  whileHover={{
                    scale: activeFilter === filter ? 1.05 : 1.02,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={activeFilter === filter ? {
                    boxShadow: [
                      "0 4px 20px rgba(59, 130, 246, 0.3)",
                      "0 4px 20px rgba(147, 51, 234, 0.3)",
                      "0 4px 20px rgba(59, 130, 246, 0.3)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeFilter === filter && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      layoutId="activeFilter"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <span className="relative z-10">{filter} Events</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={cardStagger}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredEvents.map((event, i) => (
                <motion.div
                  variants={cardItem}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  custom={i}
                  key={event.id}
                >
                  <motion.div
                    variants={morphingCard}
                    initial="rest"
                    whileHover="hover"
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 hover:border-gray-200 group h-full flex flex-col select-none relative"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div className="relative h-48 w-full overflow-hidden">
                      <motion.img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={400}
                        height={192}
                        onError={(e) => handleImgError(e)}
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, 1, -1, 0]
                        }}
                        transition={{
                          scale: { duration: 0.6 },
                          rotate: { duration: 0.8, ease: "easeInOut" }
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      {event.featured && (
                        <motion.span
                          animate={{
                            opacity: [0.6, 1, 0.6],
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg select-none"
                        >
                          ✨ Featured
                        </motion.span>
                      )}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full"
                        transition={{ duration: 0.6 }}
                      />
                    </motion.div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4 min-h-[4rem]">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors flex-1 pr-4 line-clamp-2" title={event.title}>
                          {event.title}
                        </h3>
                        <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full select-text" title={event.displaydate}>
                          {event.displaydate}
                        </span>
                      </div>
                      <div className="mb-4 h-20">
                        <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm group-hover:opacity-80" title={event.description}>
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
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              whileHover={{
                                scale: 1.1,
                                boxShadow: "0 4px 12px rgba(70,140,240,0.15)",
                                y: -2
                              }}
                              className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 select-text cursor-pointer relative overflow-hidden"
                              title={topic}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                                whileHover={{ translateX: "100%" }}
                                transition={{ duration: 0.5 }}
                              />
                              <span className="relative z-10">{topic}</span>
                            </motion.span>
                          ))}
                          {event.topics.length > 4 && (
                            <motion.span
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full select-text cursor-default"
                              title={`${event.topics.length - 4} more`}
                              whileHover={{ scale: 1.05 }}
                            >
                              +{event.topics.length - 4} more
                            </motion.span>
                          )}
                        </div>
                      </div>
                      <div className="border-t pt-4 mb-6 h-16">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 select-none">Speakers:</h4>
                        <div className="text-sm text-blue-600 hover:text-blue-800 transition-colors line-clamp-2 select-text" title={event.speakers.join(', ')}>
                          {event.speakers.join(', ')}
                        </div>
                      </div>
                      <div className="mt-auto">
                        {(event.status !== 'completed') ? (
                          event.form ? (
                            <motion.a
                              href={event.form}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0 8px 36px rgba(60,40,240,0.14)",
                                background: "linear-gradient(45deg, rgb(37, 99, 235), rgb(147, 51, 234))"
                              }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center group select-none cursor-pointer relative overflow-hidden"
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{
                                  x: ["-100%", "100%"]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                  ease: "easeInOut"
                                }}
                              />
                              <span className="relative z-10">Register Now</span>
                              <motion.div
                                whileHover={{ x: 7, scale: 1.2 }}
                                transition={{ type: 'spring', stiffness: 320 }}
                                className="relative z-10"
                              >
                                <ArrowRight className="ml-2 w-4 h-4" />
                              </motion.div>
                            </motion.a>
                          ) : (
                            <div
                              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center select-none cursor-default"
                              title="Registration coming soon"
                            >
                              Coming Soon ✨
                            </div>
                          )
                        ) : (
                          <motion.button onClick={() => { const slug = getSlug(event.id); if (slug) navigate(`/events/${slug}`); }} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center select-none" animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}><CheckCircle className="mr-2 w-5 h-5" />View Event Details</motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default EventsPage;
