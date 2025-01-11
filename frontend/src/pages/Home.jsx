import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="text-center" style={{ animation: 'fadeIn 0.6s forwards' }}>
      <div className="hero">
        <h1 className="hero-title">
          Transform Your Shopping with
          <span> AI-Powered</span> Savings
        </h1>
        <p className="hero-description">
          CouponAlchemy uses advanced AI to predict and validate discount codes in real-time,
          making your online shopping experience more rewarding.
        </p>
        <div className="hero-buttons">
          <Link to="/hunt" className="btn" id='startHunting'>Start Hunting</Link>
          <Link to="/dashboard" className="btn" id='viewDash'>View Dashboard</Link>
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
    </div>
  );
}