import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import './CouponHunt.css';

export default function CouponHunt() {
  // State management
  const [showConfetti, setShowConfetti] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('');

  const generateCoupon = async (retailer) => {

    setError('');
    setIsValidating(true);
    
    try {
      console.log('Generating coupon for retailer:', selectedRetailer); // Debug log
      const response = await fetch('http://localhost:5000/generate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ retailer }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate coupon');
      }

      const data = await response.json();
      if (data.code) {
        setGeneratedCode(data.code);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        throw new Error('No coupon code received');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate coupon. Please try again.');
      console.error('Error generating coupon:', err);
    } finally {
      setIsValidating(false);
    }
  };

  // Get window dimensions for confetti animation
  const { innerWidth: width, innerHeight: height } = window;

  console.log('Rendering CouponHunt component'); // Debug log
  
  return (
    <div className="hunt-container">
      {console.log('CouponHunt container rendered')} {/* Debug log */}
      {/* Celebration animation when coupon is found */}
      {showConfetti && <Confetti width={width} height={height} />}
      
      <h1>Coupon Hunt</h1>
      
      {/* Main coupon generator interface */}
      <motion.div 
        className="generator-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          AI Coupon Generator
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Our AI will analyze patterns and generate potential coupon codes for your selected retailer.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="retailer-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="retailer-btn"
              onClick={() => generateCoupon('amazon')}
              disabled={isValidating}
            >
              Amazon
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="retailer-btn"
              onClick={() => generateCoupon('walmart')}
              disabled={isValidating}
            >
              Walmart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="retailer-btn"
              onClick={() => generateCoupon('target')}
              disabled={isValidating}
            >
              Target
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="retailer-btn"
              onClick={() => generateCoupon('bestbuy')}
              disabled={isValidating}
            >
              Best Buy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="retailer-btn"
              onClick={() => generateCoupon('newegg')}
              disabled={isValidating}
            >
              NewEgg
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p 
              className="error-message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn generate-btn ${isValidating ? 'generating' : ''}`}
          onClick={generateCoupon}
          disabled={isValidating}
          id='generateCodeBtn'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="btn-text">
            {isValidating ? 'Generating...' : 'Generate Coupon'}
          </span>
          {isValidating && <div className="loading-spinner"></div>}
        </motion.button>

        {/* Display generated coupon code */}
        <AnimatePresence mode="wait">
          {generatedCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="generated-code"
            >
              <h3>Generated Coupon Code:</h3>
              <motion.p 
                className="code-value"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {generatedCode}
              </motion.p>
              <motion.button 
                className="copy-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  navigator.clipboard.writeText(generatedCode);
                  const btn = e.target;
                  btn.textContent = 'Copied!';
                  setTimeout(() => {
                    btn.textContent = 'Copy to Clipboard';
                  }, 2000);
                }}
              >
                Copy to Clipboard
              </motion.button>          
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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