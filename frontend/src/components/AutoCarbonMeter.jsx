import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Navigation, Play, Square, Footprints, Bike, CarFront, Pause } from 'lucide-react';

const AutoCarbonMeter = ({ onActivityLogged }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [travelMode, setTravelMode] = useState('idle');

  const watchId = useRef(null);
  const lastPosition = useRef(null);
  const totalDistance = useRef(0);
  const speedHistory = useRef([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const detectTravelMode = (speedKmh) => {
    if (speedKmh < 0.5) return 'idle';
    if (speedKmh < 8) return 'walking';
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

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser');
      return;
    }

    setIsTracking(true);
    totalDistance.current = 0;
    speedHistory.current = [];
    lastPosition.current = null;
    setDistance(0);
    setSpeed(0);
    setTravelMode('idle');

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
      (err) => console.error('GPS Error:', err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

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

      onActivityLogged(activity);
      alert(`✅ Trip Logged!\n📍 ${totalDistance.current.toFixed(2)} km\n🌱 Zero emission!`);
    } else {
      alert('Trip too short to be logged.');
    }
  };

  const ModeIcon = () => {
    if (travelMode === 'walking') return <Footprints size={28} color="var(--color-primary)" />;
    if (travelMode === 'cycling') return <Bike size={28} color="var(--color-primary)" />;
    if (travelMode === 'driving') return <CarFront size={28} color="#ef4444" />;
    return <Pause size={28} color="var(--color-text-muted)" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card" 
      style={{ 
        textAlign: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        border: isTracking ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
      }}
    >
      {/* Background Pulse Animation when tracking */}
      <AnimatePresence>
        {isTracking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
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
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
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
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Navigation size={28} color={isTracking ? 'var(--color-primary)' : 'var(--color-text-main)'} /> 
          Auto Carbon Meter
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Distance Card */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ 
              padding: '20px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              <MapPin size={16} /> Distance
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--color-secondary)' }}>
              {distance.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>km</span>
            </p>
          </motion.div>

          {/* Speed Card */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ 
              padding: '20px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              <Zap size={16} /> Speed
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--color-accent)' }}>
              {speed.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>km/h</span>
            </p>
          </motion.div>

          {/* Mode Card */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ 
              padding: '20px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              Mode
            </p>
            <div style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
              <ModeIcon />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px', textTransform: 'capitalize' }}>
              {travelMode}
            </p>
          </motion.div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isTracking ? stopTracking : startTracking}
          style={{ 
            width: '100%',
            padding: '16px',
            background: isTracking ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            color: isTracking ? '#ef4444' : 'white',
            border: isTracking ? '1px solid #ef4444' : 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: isTracking ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)',
            transition: 'background 0.3s'
          }}
        >
          {isTracking ? (
            <>
              <Square size={20} fill="#ef4444" /> Stop Tracking
            </>
          ) : (
            <>
              <Play size={20} fill="white" /> Start Tracking
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AutoCarbonMeter;