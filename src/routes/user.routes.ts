// External imports
import express from 'express';

// Local imports
import getAllApprovedTickets from '../controllers/user/getAllApprovedTickets.js';
import getSingleTicket from '../controllers/user/getSingleTicket.js';

const router = express.Router();

router.get('/get-approved-tickets', getAllApprovedTickets);
router.get('/ticket/:id', getSingleTicket)

export { router as userRouter };