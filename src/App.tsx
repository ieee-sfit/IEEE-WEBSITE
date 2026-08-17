import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import TeamPage from './pages/TeamPage';
import NavkritiPage from './pages/NavkritiPage';
import NavkritiPortal from './pages/NavkritiPortal';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';

const SplashCursor = lazy(() => import('./components/ui/SplashCursor/SplashCursor'));

function App() {
  const [isLaptop, setIsLaptop] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => setIsLaptop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
      <ScrollToTop />
      {isLaptop && (
        <Suspense fallback={null}>
          <SplashCursor SPLAT_RADIUS={0.02} PRESSURE_ITERATIONS={16} DYE_RESOLUTION={1200} />
        </Suspense>
      )}
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/navkriti" element={<NavkritiPage />} />
          <Route path="/navkriti/portal" element={<NavkritiPortal />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
