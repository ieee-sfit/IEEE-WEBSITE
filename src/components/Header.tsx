import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo1 from "./assets/ieee-logo.png";
import logo2 from "./assets/wie--logo.png";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/', type: 'route' },
    { name: 'About', href: '#about', type: 'scroll' },
    { name: 'Events', href: '/events', type: 'route' },
    { name: 'Our Team', href: '/team', type: 'route' },
    { name: 'Contact', href: '#contact', type: 'scroll' },
  ];

  const handleNavClick = (item: { name: string; href: string; type: string }) => {
    if (item.type === 'scroll') {
      // If we're not on the home page, navigate to home first
      if (location.pathname !== '/') {
        window.location.href = '/' + item.href;
      } else {
        // Smooth scroll to section
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
         <div className="flex items-center space-x-4">
      {/* First Logo */}
      <Link to="/" className="group cursor-pointer">
        <img
          src={logo1}
          alt="Logo 1"
          className="h-16 w-auto transition-transform duration-300 group-hover:scale-110"
        />
      </Link>

      {/* Vertical Divider */}
      <div className="w-px h-12 bg-gray-300"></div>

      {/* Second Logo */}
      <Link to="/" className="group cursor-pointer">
        <img
          src={logo2}
          alt="Logo 2"
          className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
        />
      </Link>
    </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => {
              if (item.type === 'route') {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative text-gray-700 hover:text-blue-600 transition-all duration-300 group py-2 px-1 ${
                      location.pathname === item.href ? 'text-blue-600' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                      {item.name}
                    </span>
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                      location.pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                    <span className="absolute inset-0 bg-blue-50 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"></span>
                  </Link>
                );
              } else {
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 group py-2 px-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                      {item.name}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                    <span className="absolute inset-0 bg-blue-50 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"></span>
                  </button>
                );
              }
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group relative overflow-hidden"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              {/* Hamburger Lines */}
              <span
                className={`absolute left-0 w-6 h-0.5 bg-gray-600 transition-all duration-300 transform origin-center ${
                  isMenuOpen
                    ? 'top-3 rotate-45'
                    : 'top-1 rotate-0'
                }`}
              ></span>
              <span
                className={`absolute left-0 top-3 w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              ></span>
              <span
                className={`absolute left-0 w-6 h-0.5 bg-gray-600 transition-all duration-300 transform origin-center ${
                  isMenuOpen
                    ? 'top-3 -rotate-45'
                    : 'top-5 rotate-0'
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
  isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
} bg-white rounded-lg shadow-lg`}>
          <nav className="py-4 space-y-2">
            {navItems.map((item, index) => {
              if (item.type === 'route') {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 transform ${
                      isMenuOpen
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-4 opacity-0'
                    } hover:scale-105 hover:translate-x-2 ${
                      location.pathname === item.href ? 'text-blue-600 bg-blue-50' : ''
                    }`}
                    style={{
                      transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                );
              } else {
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={`block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 transform ${
                      isMenuOpen
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-4 opacity-0'
                    } hover:scale-105 hover:translate-x-2`}
                    style={{
                      transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms'
                    }}
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </button>
                );
              }
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
