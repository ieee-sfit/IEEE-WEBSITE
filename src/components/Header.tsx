import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo1 from "./assets/ieee-logo.png";
import logo2 from "./assets/wie--logo.png";
import ThemeToggle from './ThemeToggle';
const Header = () => {
  const navigate = useNavigate();
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
    { name: 'Navkriti \'26', href: '/navkriti', type: 'route' },
    { name: 'Events', href: '/events', type: 'route' },
    { name: 'Our Team', href: '/team', type: 'route' },
    { name: 'Contact', href: '#contact', type: 'scroll' },
  ];

  const handleNavClick = (item: { name: string; href: string; type: string }) => {
    if (item.type === 'scroll') {
      if (location.pathname !== '/') {
        navigate(`/${item.href}`);
      } else {
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
      isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4 bg-white/90 p-2 rounded-xl backdrop-blur-sm dark:bg-white/95 shadow-sm">
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
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => {
              if (item.type === 'route') {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group py-2 px-1 ${
                      location.pathname === item.href ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                      {item.name}
                    </span>
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                      location.pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                    <span className="absolute inset-0 bg-blue-50 dark:bg-slate-800 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"></span>
                  </Link>
                );
              } else {
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group py-2 px-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                      {item.name}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                    <span className="absolute inset-0 bg-blue-50 dark:bg-slate-800 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"></span>
                  </button>
                );
              }
            })}
            <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 group relative overflow-hidden"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                {/* Hamburger Lines */}
                <span
                  className={`absolute left-0 w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 transform origin-center ${
                    isMenuOpen
                      ? 'top-3 rotate-45'
                      : 'top-1 rotate-0'
                  }`}
                ></span>
                <span
                  className={`absolute left-0 top-3 w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                ></span>
                <span
                  className={`absolute left-0 w-6 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 transform origin-center ${
                    isMenuOpen
                      ? 'top-3 -rotate-45'
                      : 'top-5 rotate-0'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-xl transition-all duration-300 origin-top overflow-hidden ${
          isMenuOpen ? 'max-h-[400px] border-t border-gray-100 dark:border-slate-800' : 'max-h-0'
        }`}>
          <nav className="py-4 px-4 space-y-2">
            {navItems.map((item) => {
              if (item.type === 'route') {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3 px-4 text-base font-medium rounded-lg transition-colors ${
                      location.pathname === item.href 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              } else {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavClick(item);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block py-3 px-4 text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg transition-colors hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    {item.name}
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
