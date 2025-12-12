// External imports
import express from 'express';

// Local imports
import getPublicTickets from '../controllers/public/getPublicTickets.js';

const router = express.Router();

router.get('/tickets', getPublicTickets);

export { router as publicRouter };