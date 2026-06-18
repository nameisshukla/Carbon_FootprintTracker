import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ActivityContext } from '../context/ActivityContext';
import { AuthContext } from '../context/AuthContext';
import AutoCarbonMeter from '../components/AutoCarbonMeter';
import Dashboard from '../components/Dashboard';
import { Shield, Award, Zap, Star } from 'lucide-react';

const HomePage = () => {
  const { activities, stats, deleteActivity, fetchActivities } = useContext(ActivityContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchActivities();
  }, []);

  const totalCO2e = stats?.totalCO2e || 0;
  const activityCount = activities.length;

  // Gamification Logic
  let level = "Eco Beginner";
  let progress = 0;
  if (activityCount >= 10 && totalCO2e < 100) { level = "Earth Guardian"; progress = 100; }
  else if (activityCount >= 5) { level = "Carbon Ninja"; progress = 60; }
  else if (activityCount >= 1) { level = "Green Sprout"; progress = 30; }
  else { progress = 10; }

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0' }}>Welcome, {user?.name}! 👋</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Here is your carbon impact summary.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/log-activity" className="btn-primary">
            + Log New Activity
          </Link>
          <Link to="/progress" className="btn-secondary">
            View Analytics
          </Link>
        </div>
      </div>

      {/* Gamification Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ marginBottom: '40px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield color="var(--color-primary)" /> Current Level: {level}
            </h3>
            <div className="level-progress-bar">
              <div className="level-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Log more activities and keep emissions low to level up!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div className={`badge-icon ${activityCount > 0 ? '' : 'badge-locked'}`}>🌱</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>First Log</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className={`badge-icon ${activityCount >= 5 ? '' : 'badge-locked'}`}>🔥</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>5 Streak</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className={`badge-icon ${totalCO2e < 50 && activityCount > 5 ? '' : 'badge-locked'}`}>👑</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Low Emitter</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card">
          <div className="stat-label">Total Emissions</div>
          <div className="stat-value">{totalCO2e.toFixed(1)} <span style={{fontSize:'1rem', color:'var(--color-text-muted)'}}>kg CO₂e</span></div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card">
          <div className="stat-label">Activities Logged</div>
          <div className="stat-value">{activityCount}</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card">
          <div className="stat-label">Green Score</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{progress}/100</div>
        </motion.div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <AutoCarbonMeter onActivityLogged={fetchActivities} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Dashboard activities={activities} onDelete={deleteActivity} />
      </motion.div>
    </div>
  );
};

export default HomePage;