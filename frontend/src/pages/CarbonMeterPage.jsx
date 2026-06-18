import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityContext } from '../context/ActivityContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Navigation, MapPin, Zap, Play, Square, Footprints, Bike, CarFront, Pause } from 'lucide-react';

const CarbonMeterPage = () => {
  const navigate = useNavigate();
  const { addActivity } = useContext(ActivityContext);
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [travelMode, setTravelMode] = useState('idle');
  const [sessionTime, setSessionTime] = useState(0);
  const [error, setError] = useState('');

  const watchId = useRef(null);
  const lastPosition = useRef(null);
  const totalDistance = useRef(0);
  const speedHistory = useRef([]);
  const timerRef = useRef(null);
  const sessionStart = useRef(null);

  const detectTravelMode = (speedKmh) => {
    if (speedKmh < 0.5) return 'idle';
    if (speedKmh < 6) return 'walking';
    if (speedKmh < 25) return 'cycling';
    return 'driving';
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos((lat1*Math.PI)/180) * Math.cos((lat2*Math.PI)/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setIsTracking(true);
    totalDistance.current = 0;
    speedHistory.current = [];
    lastPosition.current = null;
    sessionStart.current = Date.now();
    setDistance(0);
    setSpeed(0);
    setTravelMode('idle');
    setSessionTime(0);
    setError('');

    timerRef.current = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStart.current) / 1000));
    }, 1000);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (lastPosition.current) {
          const dist = calculateDistance(
            lastPosition.current.lat,
            lastPosition.current.lng,
            latitude,
            longitude
          );
          totalDistance.current += dist;
          setDistance(parseFloat(totalDistance.current.toFixed(3)));

          const timeDiff = (position.timestamp - lastPosition.current.time) / 1000;
          if (timeDiff > 0) {
            const speedKmh = (dist * 1000) / timeDiff * 3.6;
            speedHistory.current.push(speedKmh);
            const avgSpeed = speedHistory.current.slice(-5).reduce((a, b) => a + b, 0) / 5;
            setSpeed(parseFloat(avgSpeed.toFixed(1)));
            setTravelMode(detectTravelMode(avgSpeed));
          }
        }

        lastPosition.current = { lat: latitude, lng: longitude, time: position.timestamp };
      },
      (err) => {
        if (err.code === 1) setError('Location permission denied');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    if (timerRef.current) clearInterval(timerRef.current);

    if (totalDistance.current > 0.1) {
      const category = travelMode === 'walking' ? 'walking' : 
                       travelMode === 'cycling' ? 'cycling' : 'car_petrol';
      
      const activity = {
        id: Date.now().toString(),
        type: 'travel',
        category,
        value: parseFloat(totalDistance.current.toFixed(3)),
        unit: 'km',
        co2e: (travelMode === 'walking' || travelMode === 'cycling') ? 0 : 
              parseFloat((totalDistance.current * 0.192).toFixed(3)),
        date: new Date().toISOString()
      };

      const handleLog = async () => {
        const result = await addActivity(activity);
        if (result.success) {
          alert(`✅ Trip Logged!\n📍 ${totalDistance.current.toFixed(2)} km\n⏱️ ${formatTime(sessionTime)}`);
          navigate('/dashboard');
        } else {
          alert(result.message || 'Failed to log trip');
        }
      };
      handleLog();
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getModeColor = () => {
    switch(travelMode) {
      case 'walking': return 'var(--color-primary)';
      case 'cycling': return 'var(--color-secondary)';
      case 'driving': return '#ef4444';
      default: return 'var(--color-text-muted)';
    }
  };

  const ModeIcon = () => {
    switch(travelMode) {
      case 'walking': return <Footprints size={40} color={getModeColor()} />;
      case 'cycling': return <Bike size={40} color={getModeColor()} />;
      case 'driving': return <CarFront size={40} color={getModeColor()} />;
      default: return <Pause size={40} color={getModeColor()} />;
    }
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
            <Navigation size={32} color="var(--color-primary)" />
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Carbon Meter</h1>
          </div>
          
          <div style={{ width: '80px' }}></div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card" 
          style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden',
            border: isTracking ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)'
          }}
        >
          {/* Background Pulse Animation when tracking */}
          <AnimatePresence>
            {isTracking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '150%',
                  height: '150%',
                  background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 60%)'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid #ef4444',
                  color: '#ef4444', 
                  padding: '12px', 
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '20px'
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            <div style={{ 
              fontSize: '4.5rem', 
              fontWeight: '800', 
              color: 'var(--color-text-main)',
              marginBottom: '15px',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              {formatTime(sessionTime)}
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={{ 
                padding: '20px 40px',
                background: isTracking ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.4)',
                border: `1px solid ${isTracking ? getModeColor() : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 'var(--radius-lg)',
                marginBottom: '40px',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                boxShadow: isTracking ? `0 0 20px ${getModeColor()}40` : 'none',
                transition: 'all 0.3s'
              }}
            >
              <ModeIcon />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Mode</p>
                <p style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  color: getModeColor(),
                  textTransform: 'capitalize',
                  margin: 0
                }}>
                  {travelMode}
                </p>
              </div>
            </motion.div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '40px'
            }}>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '30px',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <MapPin size={32} color="var(--color-secondary)" />
                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Distance Travelled</p>
                <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-text-main)', margin: 0, lineHeight: 1 }}>
                  {distance.toFixed(2)} <span style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>km</span>
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03 }}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '30px',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Zap size={32} color="var(--color-accent)" />
                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Average Speed</p>
                <p style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-text-main)', margin: 0, lineHeight: 1 }}>
                  {speed.toFixed(1)} <span style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>km/h</span>
                </p>
              </motion.div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isTracking ? stopTracking : startTracking}
              style={{ 
                width: '100%',
                maxWidth: '400px',
                padding: '20px',
                background: isTracking ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                color: isTracking ? '#ef4444' : 'white',
                border: isTracking ? '1px solid #ef4444' : 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1.5rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: isTracking ? 'none' : '0 10px 30px rgba(16, 185, 129, 0.4)',
                margin: '0 auto',
                transition: 'all 0.3s'
              }}
            >
              {isTracking ? (
                <><Square size={24} fill="#ef4444" /> Stop & Log Trip</>
              ) : (
                <><Play size={24} fill="white" /> Start Tracking</>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CarbonMeterPage;