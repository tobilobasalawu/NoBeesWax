import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

/**
 * Navigation component that appears on all pages.
 * Features responsive design with hamburger menu for mobile.
 * Includes main navigation links and authentication button.
 */
function Navbar() {
  // Controls mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span>CouponAlchemy</span>
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
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/hunt" className="navbar-link">Hunt Coupons</Link>
          <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
          <div className="navbar-auth">
            <button className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;