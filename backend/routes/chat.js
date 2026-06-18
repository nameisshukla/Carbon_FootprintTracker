import express from 'express';
import { handleChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to handle chat messages
// We use the 'protect' middleware to ensure only logged-in users can use the bot
router.post('/', protect, handleChat);

export default router;
