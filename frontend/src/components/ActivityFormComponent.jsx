import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarFront, Zap, Utensils, ShoppingBag, Info } from 'lucide-react';

const ActivityFormComponent = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'travel',
    category: 'car_petrol',
    value: '',
  });

  const categories = {
    travel: [
      { value: 'car_petrol', label: 'Car (Petrol)' },
      { value: 'car_diesel', label: 'Car (Diesel)' },
      { value: 'bus', label: 'Bus' },
      { value: 'train', label: 'Train' },
      { value: 'flight_domestic', label: 'Flight (Domestic)' },
      { value: 'walking', label: 'Walking' },
      { value: 'cycling', label: 'Cycling' }
    ],
    energy: [
      { value: 'electricity', label: 'Electricity' },
      { value: 'natural_gas', label: 'Natural Gas' },
      { value: 'lpg', label: 'LPG' }
    ],
    diet: [
      { value: 'meat_beef', label: 'Beef' },
      { value: 'meat_chicken', label: 'Chicken' },
      { value: 'vegetarian', label: 'Vegetarian Meal' },
      { value: 'vegan', label: 'Vegan Meal' }
    ],
    shopping: [
      { value: 'clothing', label: 'Clothing Item' },
      { value: 'electronics', label: 'Electronics' }
    ]
  };

  const units = { travel: 'km', energy: 'kWh', diet: 'kg/meal', shopping: 'items' };

  const emissionFactors = {
    travel: { car_petrol: 0.192, car_diesel: 0.171, bus: 0.089, train: 0.041, flight_domestic: 0.255, walking: 0, cycling: 0 },
    energy: { electricity: 0.82, natural_gas: 2.0, lpg: 1.5 },
    diet: { meat_beef: 27.0, meat_chicken: 6.9, vegetarian: 2.5, vegan: 1.5 },
    shopping: { clothing: 10.0, electronics: 50.0 }
  };

  const typeIcons = {
    travel: <CarFront size={28} />,
    energy: <Zap size={28} />,
    diet: <Utensils size={28} />,
    shopping: <ShoppingBag size={28} />
  };

  const typeLabels = {
    travel: 'Travel',
    energy: 'Energy',
    diet: 'Diet',
    shopping: 'Shopping'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.value || isNaN(formData.value)) return;
    
    const co2e = parseFloat((formData.value * emissionFactors[formData.type][formData.category]).toFixed(3));
    
    const activity = {
      id: Date.now().toString(),
      ...formData,
      value: parseFloat(formData.value),
      unit: units[formData.type],
      co2e,
      date: new Date().toISOString()
    };

    onAdd(activity);
    if (onCancel) onCancel();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card" 
      style={{ maxWidth: '700px', margin: '0 auto', border: '1px solid var(--color-primary)' }}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>1. Select Activity Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
            {Object.keys(categories).map(type => (
              <motion.div
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ 
                  ...formData, 
                  type,
                  category: categories[type][0].value,
                  value: ''
                })}
                style={{
                  padding: '20px 10px',
                  background: formData.type === type ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${formData.type === type ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  color: formData.type === type ? 'var(--color-primary)' : 'var(--color-text-main)',
                  transition: 'background 0.3s'
                }}
              >
                {typeIcons[type]}
                <span style={{ fontSize: '1.1rem', fontWeight: formData.type === type ? '600' : '400' }}>
                  {typeLabels[type]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={formData.type}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="form-group"
            style={{ marginTop: '30px' }}
          >
            <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>2. Specify Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {categories[formData.type].map(cat => (
                <motion.div
                  key={cat.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  style={{
                    padding: '10px 20px',
                    background: formData.category === cat.value ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${formData.category === cat.value ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '30px',
                    cursor: 'pointer',
                    color: formData.category === cat.value ? 'white' : 'var(--color-text-main)',
                    fontSize: '0.95rem',
                    fontWeight: formData.category === cat.value ? '600' : '400',
                    transition: 'all 0.2s',
                    boxShadow: formData.category === cat.value ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
                  }}
                >
                  {cat.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="form-group" style={{ marginTop: '30px' }}>
          <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>3. Enter Value</label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              className="form-input"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
              min="0"
              step="0.1"
              placeholder={`Amount in ${units[formData.type]}`}
              style={{ 
                fontSize: '1.5rem', 
                padding: '20px', 
                paddingRight: '80px',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <span style={{ 
              position: 'absolute', 
              right: '20px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              {units[formData.type]}
            </span>
          </div>
          
          {formData.value && !isNaN(formData.value) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                marginTop: '15px', 
                padding: '15px', 
                background: 'rgba(16, 185, 129, 0.1)', 
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--color-text-main)'
              }}
            >
              <Info size={20} color="var(--color-primary)" />
              <span>
                Estimated footprint: <strong style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>
                  {(formData.value * emissionFactors[formData.type][formData.category]).toFixed(2)} kg CO₂e
                </strong>
              </span>
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
          {onCancel && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button" 
              onClick={onCancel}
              className="btn-secondary"
              style={{ flex: 1, padding: '15px', fontSize: '1.1rem' }}
            >
              Cancel
            </motion.button>
          )}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn-primary" 
            style={{ flex: 2, padding: '15px', fontSize: '1.1rem' }}
          >
            Log Impact Activity
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ActivityFormComponent;