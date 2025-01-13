import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import './Navbar.css';

/**
 * Navigation component that appears on all pages.
 * Features responsive design with hamburger menu for mobile.
 * Includes main navigation links and authentication button.
 */
function Navbar() {
  // Controls mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span>NoBeeswax</span>
        </Link>
        
        {/* Hamburger menu button for mobile */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links and auth button */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {isSignedIn ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/hunt" className="navbar-link">Hunt Coupons</Link>
              <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
              <Link to="/posts" className="navbar-link">Community</Link>
              <div className="navbar-auth">
                <UserButton className="btn btn-primary"/>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <SignedOut>
                <button className="btn btn-primary" onClick={() => window.location.href = '/sign-in'} >Join Us</button>
              </SignedOut>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
