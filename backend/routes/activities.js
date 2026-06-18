import express from 'express';
import { 
  getActivities, 
  addActivity, 
  deleteActivity, 
  getStats 
} from '../controllers/activityController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getActivities)
  .post(protect, addActivity);

router.route('/:id')
  .delete(protect, deleteActivity);

router.get('/stats', protect, getStats);

export default router;