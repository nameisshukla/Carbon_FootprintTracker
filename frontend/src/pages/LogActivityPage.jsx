import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ActivityContext } from '../context/ActivityContext';
import ActivityFormComponent from '../components/ActivityFormComponent';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf } from 'lucide-react';

const LogActivityPage = () => {
  const navigate = useNavigate();
  const { addActivity } = useContext(ActivityContext);

  const handleAdd = async (activity) => {
    const result = await addActivity(activity);
    if (result.success) {
      alert('✅ Activity logged successfully!');
      navigate('/dashboard');
    } else {
      alert(result.message || 'Failed to log activity');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '20px 0' }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
          >
            <ArrowLeft size={18} /> Back
          </motion.button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Leaf size={32} color="var(--color-primary)" />
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Log Activity</h1>
          </div>
          
          <div style={{ width: '80px' }}></div>
        </div>

        {/* Form */}
        <ActivityFormComponent onAdd={handleAdd} onCancel={handleCancel} />

        {/* Info Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card" 
          style={{ marginTop: '40px', padding: '24px', textAlign: 'center' }}
        >
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            🌍 Every action counts
          </h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            The Carbon Footprint Tracker uses standard emission factors to estimate your carbon dioxide equivalent (CO₂e). 
            Choosing more sustainable options like walking, taking public transit, or eating plant-based meals can significantly reduce your impact over time.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LogActivityPage;