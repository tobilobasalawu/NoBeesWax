import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    // Apply theme on mount and theme change
    document.body.classList.toggle('light-theme', !isDarkTheme);
  }, [isDarkTheme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span>NoBeeswax</span>
        </Link>
        
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/hunt" className="navbar-link">Hunt Coupons</Link>
          <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
          <Link to="/posts" className="navbar-link">Community</Link>
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkTheme ? '🌞' : '🌙'}
          </button>
          <div className="navbar-auth">
            <button className="btn btn-primary">Sign In</button>
          </div>
        </div>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
