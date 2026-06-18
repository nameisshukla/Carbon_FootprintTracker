import { Leaf, Mail } from 'lucide-react';

const GithubIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '40px 20px 20px',
      marginTop: 'auto'
    }}>
      <div className="max-w-6xl mx-auto" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Leaf size={28} color="#10B981" />
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>CarbonTracker</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Empowering individuals to monitor, understand, and reduce their carbon footprint for a sustainable future.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }}><GithubIcon size={20} /></a>
              <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }}><Mail size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</a></li>
              <li><a href="/dashboard" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Dashboard</a></li>
              <li><a href="/meter" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Carbon Meter</a></li>
              <li><a href="/log-activity" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Log Activity</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem' }}>Stay Updated</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '15px' }}>Subscribe to our newsletter for sustainability tips.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="form-input"
                style={{ padding: '10px', background: 'rgba(255,255,255,0.05)' }}
              />
              <button className="btn-primary" style={{ padding: '10px 20px' }}>Subscribe</button>
            </div>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          paddingTop: '20px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.9rem'
        }}>
          &copy; {new Date().getFullYear()} Carbon Tracker. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
