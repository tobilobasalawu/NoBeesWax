import { useState } from 'react';
import './Leaderboard.css';

export default function Leaderboard() {
  const [leaderboardData] = useState([
    { rank: 1, username: 'CouponMaster', points: 5230, couponsFound: 45 },
    { rank: 2, username: 'SaverPro', points: 4150, couponsFound: 38 },
    { rank: 3, username: 'DiscountHunter', points: 3890, couponsFound: 35 },
    { rank: 4, username: 'DealFinder', points: 3450, couponsFound: 30 },
    { rank: 5, username: 'BargainPro', points: 3120, couponsFound: 28 },
  ]);

  return (
    <div className="leaderboard-container" style={{ animation: 'fadeIn 0.6s forwards' }}>
      <h1 style={{ marginLeft: "12px" }}>Weekly Leaderboard</h1>
      
      <div className="leaderboard-table">
        <div className="table-header">
          <div>Rank</div>
          <div>Username</div>
          <div>Points</div>
          <div>Coupons Found</div>
        </div>
        
        {leaderboardData.map((user) => (
          <div key={user.rank} className="leaderboard-row">
            <div className="rank">
              {user.rank === 1 && '🥇'}
              {user.rank === 2 && '🥈'}
              {user.rank === 3 && '🥉'}
              {user.rank > 3 && `#${user.rank}`}
            </div>
            <div className="username">{user.username}</div>
            <div>{user.points.toLocaleString()} pts</div>
            <div>{user.couponsFound}</div>
          </div>
        ))}
      </div>

      <div className="points-info">
        <div className="points-card">
          <h3 className="points-title">Find Coupons</h3>
          <p className="points-description">50 points per valid coupon found</p>
        </div>
        <div className="points-card">
          <h3 className="points-title">Validate Codes</h3>
          <p className="points-description">30 points for confirming code validity</p>
        </div>
        <div className="points-card">
          <h3 className="points-title">Share Success</h3>
          <p className="points-description">20 points for sharing working codes</p>
        </div>
      </div>
    </div>
  );
}