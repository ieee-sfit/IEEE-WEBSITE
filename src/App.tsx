import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import TeamPage from './pages/TeamPage';
import XtremePage from './pages/XtremePage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

const SplashCursor = lazy(() => import('./components/ui/SplashCursor/SplashCursor'));
import CtrlFreakPage from './pages/CtrlFreakPage';
import CtrlFreakInfoPage from './pages/CtrlFreakInfoPage';

function AppContent() {
  const [isLaptop, setIsLaptop] = useState(window.innerWidth > 768);
  const location = useLocation();
  const isCtrlFreakRoute = location.pathname.startsWith('/ctrl-freak');

  useEffect(() => {
    const handleResize = () => setIsLaptop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Toaster position="bottom-right" />
      {isLaptop && !isCtrlFreakRoute && (
        <Suspense fallback={null}>
          <SplashCursor SPLAT_RADIUS={0.02} PRESSURE_ITERATIONS={16} DYE_RESOLUTION={1200} />
        </Suspense>
      )}
      <div className="min-h-screen">
        {!isCtrlFreakRoute && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/xtreme" element={<XtremePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/ctrl-freak" element={<CtrlFreakPage />} />
          <Route path="/ctrl-freak/info" element={<CtrlFreakInfoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
