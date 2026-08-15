import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Popup from "../components/Popup";

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Small timeout ensures layout has rendered before scrolling
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);
  return (
    <div className="min-h-screen">
      <Popup />
      <Hero />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
