// External imports
import express from 'express';

// Local imports
import createTicket from '../controllers/vendor/createTickets.js';
import getTickets from '../controllers/vendor/getTickets.js';
import updateTicket from '../controllers/vendor/updateTicket.js';
import deleteTicket from '../controllers/vendor/deleteTicket.js';
import getBookedTickets from '../controllers/vendor/getBookedTickets.js';
import updateBookedTicketStatus from '../controllers/vendor/updateBookedTicketStatus.js';

const route = express.Router();

route.post('/create-ticket', createTicket);
route.get('/tickets', getTickets);
route.patch('/update-ticket', updateTicket);
route.delete('/delete-ticket/:ticketId', deleteTicket);
route.get('/booked-tickets', getBookedTickets);
route.patch('/udpate-booked-ticket-status', updateBookedTicketStatus)

export { route as vendorRouter };
