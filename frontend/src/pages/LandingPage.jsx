import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, TrendingDown, Target, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ padding: '40px 0' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '30px', color: '#10b981', fontWeight: '600', marginBottom: '20px' }}>
            <Leaf size={18} />
            Sustainable Future Starts Here
          </div>
          <h1 style={{ fontSize: '4rem', maxWidth: '800px', margin: '0 auto 20px' }}>
            Track, Reduce, and Offset Your <span className="text-gradient">Carbon Footprint</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 40px' }}>
            Take control of your environmental impact with our advanced carbon tracking platform. Make data-driven decisions for a greener tomorrow.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
              Start Tracking Free
            </Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
              Login to Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: '80px' }}>
        <h2 className="text-center mb-8">Why Track Your Impact?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { icon: <TrendingDown size={32} color="#10b981" />, title: 'Monitor Emissions', desc: 'Log your daily travel, energy usage, and diet to see exactly where your emissions come from.' },
            { icon: <Target size={32} color="#0ea5e9" />, title: 'Set Reduction Goals', desc: 'Establish personal milestones and get actionable insights on how to achieve them effectively.' },
            { icon: <Zap size={32} color="#f59e0b" />, title: 'Automated Tracking', desc: 'Use our advanced Auto Carbon Meter to track travel distance and calculate emissions automatically.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card"
            >
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '20px' }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
