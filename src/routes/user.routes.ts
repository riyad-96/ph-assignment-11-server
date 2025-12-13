// External imports
import express from 'express';

// Local imports
import getAllApprovedTickets from '../controllers/user/getAllApprovedTickets.js';
import getSingleTicket from '../controllers/user/getSingleTicket.js';
import bookTicket from '../controllers/user/bookTicket.js'

const router = express.Router();

router.get('/get-approved-tickets', getAllApprovedTickets);
router.get('/ticket/:id', getSingleTicket);
router.post('/book-ticket', bookTicket);

export { router as userRouter };