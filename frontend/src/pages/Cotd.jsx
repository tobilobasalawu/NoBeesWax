import React, { useState } from 'react';
import { motion } from 'framer-motion';
import "./Cotd.css";
import { FaClipboard, FaRegQuestionCircle, FaSpinner, FaSync } from 'react-icons/fa';

const RetailerSelect = ({ selectedRetailer, setSelectedRetailer, retailers }) => (
  <div className="mb-4">
    <label htmlFor="retailer" className="block text-lg text-gray-700 mb-2">Select Retailer</label>
    <select
      id="retailer"
      value={selectedRetailer}
      onChange={(e) => setSelectedRetailer(e.target.value)}
      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
    >
      {retailers.map((retailer) => (
        <option key={retailer.value} value={retailer.value}>
          {retailer.name}
        </option>
      ))}
    </select>
  </div>
);

const GetLatestButton = ({ onClick, loading }) => (
  <motion.button
    onClick={onClick}
    disabled={loading}
    className="w-full mb-8 px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-400 text-white rounded-lg hover:bg-orange-500 transition transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-semibold shadow-lg"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {loading ? (
      <FaSpinner className="animate-spin" />
    ) : (
      <>
        <FaSync /> Get Latest Coupons!
      </>
    )}
  </motion.button>
);

const CouponCard = ({ coupon, loading, fetchCoupon, error }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 text-center">
    <p className="text-lg mb-4 text-gray-700">
      Want to save big today? Click below to reveal today’s exclusive deal!
    </p>

    <div className="relative group mb-4">
      <button
        onClick={fetchCoupon}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-400 text-white rounded-lg hover:bg-orange-500 transition transform hover:scale-105 disabled:opacity-50"
      >
        {loading ? (
          <FaSpinner className="animate-spin mx-auto text-white" />
        ) : (
          'Get Coupon'
        )}
      </button>
      <div className="absolute bottom-[-35px] left-1/2 transform -translate-x-1/2 text-xs text-gray-600 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
        Click to uncover today's deal!
      </div>
    </div>

    {error && (
      <div className="mt-4 text-red-600">
        <FaRegQuestionCircle className="inline mr-2" /> {error}
      </div>
    )}

    {coupon && (
      <motion.div
        className="coupon-container mt-6 p-4 bg-gray-50 rounded-lg border shadow-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Exclusive Deal</h2>
        <p className="text-lg text-gray-700 mb-4">{coupon.description}</p>
        <div className="text-xl font-bold text-blue-600 mb-4">
          Code: <span className="bg-yellow-200 px-2 py-1 rounded">{coupon.coupon}</span>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(coupon.coupon);
              alert('Coupon code copied to clipboard!');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            <FaClipboard className="inline mr-2" /> Copy Code
          </button>
          <a
            href="#how-it-works"
            className="text-blue-500 hover:text-blue-600"
          >
            How it works <span className="font-bold">→</span>
          </a>
        </div>
      </motion.div>
    )}
  </div>
);

const HowItWorks = () => (
  <motion.div
    id="how-it-works"
    className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <h3 className="text-xl font-bold mb-4">How It Works</h3>
    <ol className="list-decimal list-inside space-y-2 text-gray-700">
      <li>Click the "Get Coupon" button to reveal the deal of the day.</li>
      <li>Copy the code and use it during checkout on the respective website.</li>
      <li>Enjoy your savings!</li>
    </ol>
  </motion.div>
);

export default function Cotd() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRetailer, setSelectedRetailer] = useState('walmart');  

  const retailers = [
    { name: 'Walmart', value: 'walmart' },
    { name: 'Target', value: 'target' },
    { name: 'Amazon', value: 'amazon' },
    { name: 'Best Buy', value: 'best-buy' },
    { name: 'Macy\'s', value: 'macys' }
  ];

  const fetchLatestCoupons = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subreddit: 'coupons',
          image_count: 6
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch latest coupons.');
      }

      const data = await response.json();
      console.log(data); // Log the data to the console
      setCoupons(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cotd-container p-6">
      <motion.h1
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Coupons of the Day
      </motion.h1>

      <GetLatestButton onClick={fetchLatestCoupons} loading={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {(coupons.length > 0 ? coupons : [
          {
            coupon: 'TECH20',
            description: 'Amazon - Save 20% on select electronics'
          },
          {
            coupon: 'SAVE10NOW',
            description: 'Walmart - $10 off your purchase of $50 or more'
          }
        ]).map((coupon, index) => (
          <motion.div
            key={index}
            className="coupon-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="coupon-header">
              <h2 className="retailer">Exclusive Deal</h2>
              <h3 className="title">Today's Coupon</h3>
            </div>
            
            <div className="coupon-content">
              <div className="code-section">
                <span className="code">{coupon.coupon}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.coupon);
                    alert('Coupon code copied to clipboard!');
                  }}
                  className="copy-button"
                >
                  <FaClipboard />
                </button>
              </div>
              
              <p className="description">{coupon.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <HowItWorks />

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-3 text-center">
        <p className="text-sm">Enjoy exclusive daily deals directly from us! 🛍️</p>
      </div>
    </div>
  );
}