import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import TeamPage from './pages/TeamPage';
import NavkritiPage from './pages/NavkritiPage';
import NavkritiPortal from './pages/NavkritiPortal';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ErrorBoundary>
      <Router>
      <ScrollToTop />
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
