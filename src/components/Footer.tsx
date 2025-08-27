import React from 'react';
import { Heart, Zap, Instagram, Linkedin, Twitter, Globe, Mail, Phone } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { ref: footerRef, isVisible: footerVisible } = useScrollAnimation({
    threshold: 0.2,
    triggerOnce: true
  });

  const { ref: linksRef, visibleItems: linksVisible } = useStaggeredAnimation(8, 100);

  const { ref: sloganRef, isVisible: sloganVisible } = useScrollAnimation({
    threshold: 0.8,
    triggerOnce: false
  });

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  const resources = [
    { name: 'IEEE Main Site', href: '#' },
    { name: 'WIE Global', href: '#' },
    { name: 'SFIT Website', href: '#' },
    { name: 'Student Portal', href: '#' },
  ];

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white relative overflow-hidden wave-bg">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-32">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              className="fill-blue-600/10 animate-wave"
              style={{ animationDelay: '0s' }}
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              className="fill-purple-600/10 animate-wave"
              style={{ animationDelay: '1s' }}
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-pink-600/10 animate-wave"
              style={{ animationDelay: '2s' }}
            />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="particles">
          <div className="particle bg-blue-400"></div>
          <div className="particle bg-purple-400"></div>
          <div className="particle bg-pink-400"></div>
          <div className="particle bg-indigo-400"></div>
          <div className="particle bg-cyan-400"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ${
          footerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
        }`}>
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-logo-glow">
                  <Zap className="w-7 h-7 text-white group-hover:animate-spin" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-pulse group-hover:animate-ping"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift group-hover:scale-105 transition-transform duration-300">
                  IEEE×WIE SFIT
                </h3>
                <p className={`text-gray-400 text-sm transition-all duration-1000 ${
                  sloganVisible ? 'animate-fade-in-left opacity-100' : 'opacity-70'
                }`}>Empowering Women in Engineering</p>
              </div>
            </div>
            
            <p className={`text-gray-300 leading-relaxed mb-6 max-w-md transition-all duration-700 ${
              footerVisible ? 'animate-fade-in-right opacity-100' : 'opacity-0 translate-x-8'
            } animation-delay-300`}>
              The IEEE Women in Engineering Student Branch at St. Francis Institute of Technology
              is dedicated to inspiring and empowering women engineers through innovative programs,
              mentorship, and professional development opportunities.
            </p>
            
            <div className={`flex space-x-4 transition-all duration-700 ${
              footerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-4'
            } animation-delay-500`}>
              {[
                { icon: Instagram, gradient: 'from-pink-500 to-rose-500', delay: '0ms' },
                { icon: Linkedin, gradient: 'from-blue-500 to-blue-600', delay: '100ms' },
                { icon: Twitter, gradient: 'from-blue-400 to-blue-500', delay: '200ms' },
                { icon: Globe, gradient: 'from-gray-600 to-gray-700', delay: '300ms' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 bg-gradient-to-r ${social.gradient} rounded-lg flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-300 hover:shadow-lg group`}
                  style={{ animationDelay: social.delay }}
                >
                  <social.icon className="w-5 h-5 group-hover:animate-bounce" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div ref={linksRef} className={`transition-all duration-700 ${
            footerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-700`}>
            <h4 className="text-lg font-semibold mb-6 text-blue-400">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.name} className={`transition-all duration-500 ${
                  linksVisible[index] ? 'animate-fade-in-left opacity-100' : 'opacity-0 -translate-x-4'
                }`} style={{ transitionDelay: `${800 + index * 100}ms` }}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className={`transition-all duration-700 ${
            footerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
          } animation-delay-900`}>
            <h4 className="text-lg font-semibold mb-6 text-purple-400">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={resource.name} className={`transition-all duration-500 ${
                  linksVisible[index + 4] ? 'animate-fade-in-left opacity-100' : 'opacity-0 -translate-x-4'
                }`} style={{ transitionDelay: `${1000 + index * 100}ms` }}>
                  <a
                    href={resource.href}
                    className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                  >
                    <span className="relative z-10">{resource.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className={`border-t border-gray-800 mt-12 pt-8 transition-all duration-700 ${
          footerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
        } animation-delay-1200`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-blue-400 group-hover:animate-bounce" />
                  <span className="text-gray-300 group-hover:text-blue-400 transition-colors duration-300">ieee.wie@sfit.ac.in</span>
                </div>
                <div className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-green-400 group-hover:animate-bounce" />
                  <span className="text-gray-300 group-hover:text-green-400 transition-colors duration-300">+91 98765 43210</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-pink-400">Address</h4>
              <p className="text-gray-300 hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                St. Francis Institute of Technology<br />
                Mount Poinsur, S.V.P. Road, Borivali (West)<br />
                Mumbai - 400103, Maharashtra, India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center transition-all duration-700 ${
          footerVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-4'
        } animation-delay-1500`}>
          <p className="text-gray-400 text-sm mb-4 md:mb-0 hover:text-gray-300 transition-colors duration-300">
            © {currentYear} IEEE×WIE SFIT. All rights reserved.
          </p>
          <div ref={sloganRef} className={`flex items-center space-x-2 text-gray-400 text-sm transition-all duration-1000 ${
            sloganVisible ? 'animate-pulse opacity-100' : 'opacity-80'
          }`}>
            <span className="hover:text-gray-300 transition-colors duration-300">Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse hover:animate-bounce hover:scale-125 transition-transform duration-300" />
            <span className="hover:text-gray-300 transition-colors duration-300">by IEEE×WIE SFIT Team</span>
          </div>
        </div>
      </div>

      {/* Animated motivational quote that fades in and out */}
      <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center transition-all duration-2000 ${
        sloganVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'
      }`}>
        <p className="text-blue-400 text-lg font-medium italic animate-pulse">
          "Empowering today's women engineers to build tomorrow's innovations"
        </p>
      </div>
    </footer>
  );
};

export default Footer;
