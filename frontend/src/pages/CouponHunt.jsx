import { useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import './CouponHunt.css';

/**
 * CouponHunt page where users can generate and validate coupon codes.
 * Features an AI-powered coupon generator and real-time validation.
 * Includes celebratory animations when coupons are successfully found.
 */
function CouponHunt() {
  // State for UI feedback and animations
  const [showConfetti, setShowConfetti] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [error, setError] = useState('');

  const generateCoupon = async () => {
    if (!selectedRetailer) {
      setError('Please select a retailer first');
      return;
    }

    setError('');
    setIsValidating(true);
    
    try {
      const response = await fetch('http://localhost:5000/generate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ retailer: selectedRetailer }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate coupon');
      }

      const data = await response.json();
      setGeneratedCode(data.code);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      setError('Failed to generate coupon. Please try again.');
      console.error('Error generating coupon:', err);
    } finally {
      setIsValidating(false);
    }
  };

  // Get window dimensions for confetti animation
  const { innerWidth: width, innerHeight: height } = window;

  return (
    <div className="hunt-container">
      {/* Celebration animation when coupon is found */}
      {showConfetti && <Confetti width={width} height={height} />}
      
      <h1>Coupon Hunt</h1>
      
      {/* Main coupon generator interface */}
      <div className="generator-card">
        <h2>AI Coupon Generator</h2>
        <p>Our AI will analyze patterns and generate potential coupon codes for your selected retailer.</p>
        
        <select 
          className="retailer-select"
          value={selectedRetailer}
          onChange={(e) => setSelectedRetailer(e.target.value)}
        >
          <option value="">Select a Retailer</option>
          <option value="amazon">Amazon</option>
          <option value="walmart">Walmart</option>
          <option value="target">Target</option>
        </select>

        {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn"
          onClick={generateCoupon}
          disabled={isValidating}
          id='generateCodeBtn'
        >
          {isValidating ? 'Generating...' : 'Generate Coupon'}
        </motion.button>

        {/* Display generated coupon code */}
        {generatedCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="generated-code"
            style={{ animation: 'fadeIn 0.6s forwards' }}
          >
            <h3>Generated Coupon Code:</h3>
            <p className="code-value">{generatedCode}</p>
            <button className="copy-button" onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              alert('Coupon code copied to clipboard!');
            }}>
              Copy to Clipboard
            </button>
          </motion.div>
        )}
      </div>

      {/* How it works section */}
      <div className="card">
        <h2>How It Works</h2>
        <div className="how-it-works">
          <div>
            <h3 className="step-title">1. Select Retailer</h3>
            <p className="step-description">Choose from our supported retailers list</p>
          </div>
          <div>
            <h3 className="step-title">2. Generate Code</h3>
            <p className="step-description">Our AI predicts potential valid codes</p>
          </div>
          <div>
            <h3 className="step-title">3. Validate & Save</h3>
            <p className="step-description">We'll verify the code works instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponHunt;