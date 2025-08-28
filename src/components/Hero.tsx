import React from 'react';
import { ArrowRight, Sparkles, Users, Calendar } from 'lucide-react';
import Counter from './Counter';

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SplashCursor from './ui/SplashCursor/SplashCursor';

const Hero = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <section
      ref={heroRef}
      id="home"
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-gradient-shift"
    >
      <SplashCursor SPLAT_RADIUS={0.1}/>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>



        {/* Floating particles */}
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className={`inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-8 transition-all duration-700 ${
            heroVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          }`}>
            <Sparkles className="w-4 h-4 text-purple-600 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Empowering Women in Engineering</span>
          </div>

          {/* Main Heading */}
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-700 ${
            heroVisible ? 'animate-text-reveal opacity-100' : 'opacity-0'
          } animation-delay-200`}>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">
              IEEE×WIE
            </span>
            <br />
            <span className="text-gray-800 text-4xl md:text-5xl animate-fade-in-up animation-delay-400">SFIT</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
            heroVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-600`}>
            St. Francis Institute of Technology's IEEE Women in Engineering Committee -
            Inspiring innovation, fostering collaboration, and building the future of technology.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 ${
            heroVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-800`}>
            <button className="group btn-ripple btn-glow px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center relative overflow-hidden">
              <span className="relative z-10">Explore Events</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </button>
            <button className="btn-ripple px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full font-semibold border border-gray-200 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <span className="relative z-10">Meet Our Team</span>
            </button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-700 ${
            heroVisible ? 'animate-slide-in-up opacity-100' : 'opacity-0 translate-y-12'
          } animation-delay-1000`}>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 card-tilt group">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:animate-bounce" />
              <Counter endValue={50} suffix="+" className="text-2xl font-bold text-gray-800 mb-1" />
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 card-tilt group animation-delay-100">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:animate-bounce" />
              <Counter endValue={25} suffix="+" className="text-2xl font-bold text-gray-800 mb-1" />
              <p className="text-gray-600">Events Organized</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 card-tilt group animation-delay-200">
              <Sparkles className="w-8 h-8 text-pink-600 mx-auto mb-3 group-hover:animate-bounce" />
              <Counter endValue={5} suffix="+" className="text-2xl font-bold text-gray-800 mb-1" />
              <p className="text-gray-600">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
