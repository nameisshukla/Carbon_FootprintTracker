import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({ totalCO2e: 0, byType: {} });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchActivities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get('/activities');
      setActivities(data);
      await fetchStats();
    } catch (error) {
      console.error('Failed to fetch activities', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/activities/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const addActivity = async (activityData) => {
    try {
      const { data } = await api.post('/activities', activityData);
      setActivities((prev) => [data, ...prev]);
      await fetchStats();
      return { success: true };
    } catch (error) {
      console.error('Failed to add activity', error);
      return { success: false, message: error.response?.data?.error || 'Failed to add' };
    }
  };

  const deleteActivity = async (id) => {
    try {
      await api.delete(`/activities/${id}`);
      setActivities((prev) => prev.filter((a) => a._id !== id));
      await fetchStats();
      return { success: true };
    } catch (error) {
      console.error('Failed to delete activity', error);
      return { success: false };
    }
  };

  useEffect(() => {
    if (user) {
      fetchActivities();
    } else {
      setActivities([]);
      setStats({ totalCO2e: 0, byType: {} });
    }
  }, [user]);

  return (
    <ActivityContext.Provider value={{ activities, stats, loading, addActivity, deleteActivity, fetchActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};
