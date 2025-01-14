import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
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
          {isSignedIn ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/hunt" className="navbar-link">Hunt Coupons</Link>
              <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
              <Link to="/posts" className="navbar-link">Community</Link>
              <Link to="/coupon-of-the-day" className="navbar-link">Coupons of the Day!</Link>
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {isDarkTheme ? '🌞' : '🌙'}
              </button>
              {/* User Avatar */}
              <div className="user-button">
                <UserButton />
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <SignedOut>
                <button className="btn btn-primary" onClick={() => window.location.href = '/sign-in'}>
                  Join Us
                </button>
              </SignedOut>
            </div>
          )}
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
