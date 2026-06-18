import Activity from '../models/Activity.js';

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addActivity = async (req, res) => {
  try {
    const activityData = { ...req.body, user: req.user._id };
    const activity = new Activity(activityData);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found or unauthorized' });
    }
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalCO2e = await Activity.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$co2e' } } }
    ]);
    
    const byType = await Activity.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$type', total: { $sum: '$co2e' } } }
    ]);

    res.json({
      totalCO2e: totalCO2e[0]?.total || 0,
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.total;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};