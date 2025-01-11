import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CouponHunt from './pages/CouponHunt';
import Leaderboard from './pages/Leaderboard';
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hunt" element={<CouponHunt />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;