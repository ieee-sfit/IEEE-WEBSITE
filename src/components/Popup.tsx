import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  image: string;
  headline: string;
  description: string;
}

interface UpdateItem {
  headline: string;
  details: string;
}

export default function Popup() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedUpdate, setExpandedUpdate] = useState<number | null>(null);

  // Fetch data
  useEffect(() => {
    let mounted = true;
    
    // Simulate loading
    setTimeout(() => {
      if (!mounted) return;
      
      // Hardcoded sample data
      const newsData = [
        // {
        //   image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop",
        //   headline: "IEEE WIE Workshop on Machine Learning",
        //   description: "Join us for an exciting workshop covering the fundamentals of machine learning and its applications in engineering."
        // },
        // {
        //   image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        //   headline: "Women in Tech Conference 2024",
        //   description: "Celebrating achievements of women in technology and discussing future opportunities in STEM fields."
        // },
        // {
        //   image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop",
        //   headline: "Coding Bootcamp Registration Open",
        //   description: "Intensive coding bootcamp for beginners focusing on web development and programming fundamentals."
        // }
      ];
      
      const updatesData = [
        // {
        //   headline: "New Scholarship Program Launched",
        //   details: "We're excited to announce a new scholarship program for women pursuing engineering degrees. Applications are now open for the 2024-25 academic year."
        // },
        // {
        //   headline: "Technical Workshop Series",
        //   details: "Monthly technical workshops covering topics like AI, IoT, cybersecurity, and software development. Check our events page for the complete schedule."
        // },
        // {
        //   headline: "Industry Mentorship Program",
        //   details: "Connect with industry professionals through our mentorship program. Get guidance on career development, technical skills, and networking opportunities."
        // },
        // {
        //   headline: "Annual Conference Registration",
        //   details: "Registration is now open for our annual IEEE WIE conference. Early bird pricing available until the end of this month."
        // }
      ];
      
      setNews(newsData);
      setUpdates(updatesData);
      setLoading(false);
      if (newsData.length > 0 || updatesData.length > 0) {
        setOpen(true);
      }
    }, 1500);

    return () => {
      mounted = false;
    };
  }, []);

  // Auto slideshow
  useEffect(() => {
    if (news.length > 1 && open) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % news.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [news, open]);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + news.length) % news.length);
  };
  
  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % news.length);
  };

  const toggleUpdate = (i: number) => {
    setExpandedUpdate(expandedUpdate === i ? null : i);
  };

  if (!open || loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 flex items-center justify-center z-50 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Latest Updates
          </h2>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6 space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-white/70 text-sm">Loading updates...</p>
            </div>
          )}

          {/* News Slider */}
          {!loading && news.length > 0 && (
            <div className="relative">
              <h3 className="text-white/90 font-semibold text-lg mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                Featured News
              </h3>
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="relative h-80">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      key={index}
                      src={news[index]?.image || "/api/placeholder/400/250"}
                      alt="news"
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23ffffff' font-family='system-ui' font-size='14'%3ENews Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="p-5 space-y-3">
                    <h4 className="font-bold text-white text-lg leading-tight">
                      {news[index]?.headline}
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {news[index]?.description}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                {news.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute top-1/2 -translate-y-1/2 left-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 border border-white/20 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute top-1/2 -translate-y-1/2 right-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 border border-white/20 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Dots indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                      {news.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setIndex(i)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === index ? 'bg-white w-6 shadow-lg' : 'bg-white/50 w-2 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Updates */}
          {!loading && updates.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white/90 font-semibold text-lg mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Recent Updates
              </h3>
              
              {updates.map((update, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleUpdate(i)}
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="text-white font-medium">{update.headline}</span>
                    <motion.svg
                      animate={{ rotate: expandedUpdate === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-5 h-5 text-white/70 flex-shrink-0 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  
                  <AnimatePresence>
                    {expandedUpdate === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-white/80 text-sm leading-relaxed border-t border-white/10 pt-3 bg-white/5">
                          {update.details}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-sm hover:from-blue-500 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg border border-white/20 hover:shadow-xl hover:scale-[1.02]"
          >
            Got it, thanks!
          </button>
        </div>

        {/* Close X button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 border border-white/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}