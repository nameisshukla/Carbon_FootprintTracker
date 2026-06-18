import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChartComponent from './Chart';
import { CarFront, Zap, Utensils, ShoppingBag, Trash2, Calendar, Activity } from 'lucide-react';

const Dashboard = ({ activities, onDelete }) => {
  const [filter, setFilter] = useState('all');
  
  const list = activities || [];
  
  let filtered = [];
  if (filter === 'all') {
    filtered = list;
  } else if (filter === '7days') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    filtered = list.filter(a => {
      if (!a || !a.date) return false;
      const actDate = new Date(a.date);
      return actDate >= sevenDaysAgo;
    });
  } else {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filtered = list.filter(a => {
      if (!a || !a.date) return false;
      const actDate = new Date(a.date);
      return actDate >= thirtyDaysAgo;
    });
  }

  // Sorting: newest first
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  let total = 0;
  let zeroCount = 0;
  const byType = {};

  for (let i = 0; i < filtered.length; i++) {
    const a = filtered[i];
    const co2e = a.co2e || 0;
    const type = a.type || 'other';
    
    total = total + co2e;
    if (co2e === 0) zeroCount = zeroCount + 1;
    byType[type] = (byType[type] || 0) + co2e;
  }

  let dateLabel = 'All Time';
  if (filter === '7days') {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    dateLabel = d.toLocaleDateString() + ' - Today';
  } else if (filter === '30days') {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    dateLabel = d.toLocaleDateString() + ' - Today';
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'travel': return <CarFront size={22} color="var(--color-secondary)" />;
      case 'energy': return <Zap size={22} color="var(--color-accent)" />;
      case 'diet': return <Utensils size={22} color="var(--color-primary)" />;
      case 'shopping': return <ShoppingBag size={22} color="#ec4899" />;
      default: return <Activity size={22} color="var(--color-text-muted)" />;
    }
  };

  const getCategoryColor = (co2e) => {
    if (co2e === 0) return 'var(--color-primary)';
    if (co2e > 20) return '#ef4444'; // red
    return 'var(--color-accent)'; // yellow/orange
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {['all', '7days', '30days'].map(f => (
          <motion.button 
            key={f}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)} 
            style={{
              background: filter === f ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? '#fff' : 'var(--color-text-main)',
              border: `1px solid ${filter === f ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'background 0.3s'
            }}
          >
            {f === 'all' ? 'All Time' : f === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
          </motion.button>
        ))}
      </div>

      {/* Date Range Display */}
      <p style={{ 
        textAlign: 'right', 
        color: 'var(--color-text-muted)', 
        fontSize: '0.9rem', 
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '6px'
      }}>
        <Calendar size={14} /> {dateLabel} | {filtered.length} activities
      </p>

      {/* Charts & List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <ChartComponent activities={filtered} byType={byType} />
        </div>
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--color-primary)" />
            Recent Logged Activities
          </h3>
          
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px', paddingRight: '5px' }}>
            {filtered.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px 0', fontSize: '1.1rem' }}
              >
                No activities logged in this period 🌱
              </motion.p>
            ) : (
              <AnimatePresence>
                {filtered.map((a) => {
                  let fDate = 'Unknown';
                  if (a && a.date) {
                    const dt = new Date(a.date);
                    if (!isNaN(dt.getTime())) {
                      fDate = dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }
                  }
                  
                  return (
                    <motion.div 
                      key={a.id} 
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: -20 }}
                      transition={{ duration: 0.2 }}
                      style={{ 
                        padding: '16px', 
                        marginBottom: '10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        gap: '12px' 
                      }}
                      whileHover={{ 
                        background: 'rgba(255, 255, 255, 0.08)',
                        scale: 1.02,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          padding: '10px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getTypeIcon(a.type)}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--color-text-main)', display: 'block', fontSize: '1.05rem', textTransform: 'capitalize' }}>
                            {a.category?.replace('_', ' ') || 'Unknown'}
                          </strong>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                            {a.value || 0} {a.unit || ''} • {fDate}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ 
                            fontWeight: '700', 
                            color: getCategoryColor(a.co2e || 0), 
                            fontSize: '1.1rem',
                            display: 'block'
                          }}>
                            {(a.co2e || 0).toFixed(2)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>kg CO₂e</span>
                        </div>
                        
                        <motion.button 
                          whileHover={{ scale: 1.1, color: '#ef4444' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(a.id)} 
                          style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'var(--color-text-muted)', 
                            padding: '8px', 
                            borderRadius: '50%', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;