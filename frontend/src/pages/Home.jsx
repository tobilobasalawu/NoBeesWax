import { Link } from 'react-router-dom';
import './Home.css';
import { useAuth } from "@clerk/clerk-react";

// Assuming you have a way to check if the user is signed in
const isUserSignedIn = () => {
  const { isSignedIn } = useAuth();
  return isSignedIn;
};

export default function Home() {
  return (
    <div className="text-center home-container" style={{ animation: 'fadeIn 0.6s forwards' }}>
      <div className="hero">
        <img 
          src="/oiia-oiiaoiiaTransparent.gif" 
          alt="Dynamic Animation" 
          className="hero-animation"
        />
        <h1 className="hero-title">
          Keep Your Deals<br/>
          <span> Private </span> & Sweet
        </h1>
        <p className="hero-description">
          NoBeeswax uses advanced AI to predict and validate discount codes in real-time,
          making your online shopping experience more rewarding.
        </p>
        <div className="hero-buttons">
          {isUserSignedIn() ? (
            <>
              <Link to="/hunt" className="btn" id='startHunting'>Start Hunting</Link>
              <Link to="/dashboard" className="btn" id='viewDash'>View Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="btn" id='startHunting'>Start Hunting</Link>
              <Link to="/sign-in" className="btn" id='viewDash'>View Dashboard</Link>
            </>
          )}
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3 className="feature-title">AI-Powered Predictions</h3>
          <p className="feature-description">Our AI analyzes patterns to generate highly accurate coupon predictions.</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Real-Time Validation</h3>
          <p className="feature-description">Instantly verify coupon codes through retailer integrations.</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Earn Rewards</h3>
          <p className="feature-description">Get points for discovering and sharing working coupon codes.</p>
        </div>
      </div>
      
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>NoBeeswax</h3>
            <p>Real Honey</p>
          </div>
        </div>
      </footer>
    </div>
  );
}