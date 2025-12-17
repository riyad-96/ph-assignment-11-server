// External imports
import express from 'express';

// Local imports
import getAllFilteredTickets from '../controllers/user/getAllFilteredTickets.js';
import getSingleTicket from '../controllers/user/getSingleTicket.js';
import bookTicket from '../controllers/user/bookTicket.js';
import getBookedTickets from '../controllers/user/getBookedTickets.js';
import createCheckoutSession from '../controllers/user/createCheckoutSession.js';
import paymentSuccess from '../controllers/user/paymentSuccess.js';
import getTransactionHistory from '../controllers/user/getTransactionHistory.js';
import getDashboardStats from '../controllers/user/getDashboardStats.js';

const router = express.Router();

router.post('/get-all-filtered-tickets', getAllFilteredTickets);
router.get('/ticket/:id', getSingleTicket);
router.post('/book-ticket', bookTicket);
router.get('/booked-tickets', getBookedTickets);
router.post('/create-checkout-session', createCheckoutSession);
router.post('/payment-success', paymentSuccess);
router.get('/transaction-history', getTransactionHistory);
router.get('/dashboard-stats', getDashboardStats);

export { router as userRouter };
