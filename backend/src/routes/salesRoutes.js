import express from 'express';
import { getSales, getFilters, getAnalytics, healthCheck } from '../controllers/salesController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

router.use(limiter);

// Routes
router.get('/sales', getSales);
router.get('/filters', getFilters);
router.get('/analytics', getAnalytics);
router.get('/health', healthCheck);

export default router;
