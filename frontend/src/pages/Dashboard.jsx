import { useState } from 'react';
import './Dashboard.css';

/**
 * Dashboard page showing user statistics and recent activity.
 * Displays key metrics like points, coupons found, and success rate.
 * Also shows a feed of recent user actions and rewards.
 */
function Dashboard() {
  // Mock user statistics - will be replaced with real data from API
  const [userStats] = useState({
    points: 1250,
    couponsFound: 15,
    successRate: 75,
    rank: 'Coupon Hunter'
  });

  // Mock activity data - will be replaced with real data from API
  const [recentActivity] = useState([
    { id: 1, action: 'Found coupon', code: 'SAVE20', points: 50, timestamp: '2h ago' },
    { id: 2, action: 'Validated coupon', code: 'SPRING30', points: 30, timestamp: '5h ago' },
    { id: 3, action: 'Shared coupon', code: 'WELCOME10', points: 20, timestamp: '1d ago' },
  ]);

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.6s forwards' }}>
      <h1>Your Dashboard</h1>
      
      {/* User statistics grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-label">Total Points</h3>
          <p className="stat-value">{userStats.points}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Coupons Found</h3>
          <p className="stat-value">{userStats.couponsFound}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Success Rate</h3>
          <p className="stat-value">{userStats.successRate}%</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Current Rank</h3>
          <p className="stat-value">{userStats.rank}</p>
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="card">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-info">
                <h4>{activity.action}</h4>
                <p>Code: {activity.code}</p>
              </div>
              <div className="activity-meta">
                <p className="activity-points">+{activity.points} pts</p>
                <p className="activity-time">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;