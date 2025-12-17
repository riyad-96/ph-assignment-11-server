// External imports
import express from 'express';

// Local imports
import createTicket from '../controllers/vendor/createTickets.js';
import getTickets from '../controllers/vendor/getTickets.js';
import updateTicket from '../controllers/vendor/updateTicket.js';
import deleteTicket from '../controllers/vendor/deleteTicket.js';
import getBookedTickets from '../controllers/vendor/getBookedTickets.js';
import updateBookedTicketStatus from '../controllers/vendor/updateBookedTicketStatus.js';
import getRevenueOverview from '../controllers/vendor/getRevenueOverview.js';
import getVendorDashboardStats from '../controllers/vendor/getVendorDashboardStats.js';

const router = express.Router();

router.post('/create-ticket', createTicket);
router.get('/tickets', getTickets);
router.patch('/update-ticket', updateTicket);
router.delete('/delete-ticket/:ticketId', deleteTicket);
router.get('/booked-tickets', getBookedTickets);
router.patch('/udpate-booked-ticket-status', updateBookedTicketStatus);
router.get('/revenue', getRevenueOverview);
router.get('/dashboard-stats', getVendorDashboardStats);

export { router as vendorRouter };
