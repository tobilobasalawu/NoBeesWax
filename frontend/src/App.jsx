import { BrowserRouter as Router, Routes, Route, useRoutes } from 'react-router-dom';
import routes from "tempo-routes";
import { TempoDevtools } from "tempo-devtools";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CouponHunt from './pages/CouponHunt';
import Leaderboard from './pages/Leaderboard';
import Posts from './pages/Posts';
import './App.css';

/**
 * Root component that handles routing and layout structure.
 * Uses React Router for navigation between different pages.
 * Includes a persistent Navbar and main content area.
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          {/* For the tempo routes - ensure TempoDevtools is initialized */}
          {import.meta.env.VITE_TEMPO && TempoDevtools.isInitialized() && useRoutes(routes)}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hunt" element={<CouponHunt />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/posts" element={<Posts />} />
            {/* Add this before the catchall route if you have one */}
            {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
