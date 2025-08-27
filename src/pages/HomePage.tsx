import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import EventsPreview from '../components/EventsPreview';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <EventsPreview />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
