// External imports
import express from 'express';

// Local imports
import createTicket from '../controllers/vendor/createTickets.js';
import getTickets from '../controllers/vendor/getTickets.js';
import updateTicket from '../controllers/vendor/updateTicket.js';
import deleteTicket from '../controllers/vendor/deleteTicket.js';

const route = express.Router();

route.post('/create-ticket', createTicket);
route.get('/tickets', getTickets);
route.patch('/update-ticket', updateTicket);
route.delete('/delete-ticket/:ticketId', deleteTicket);

export { route as vendorRouter };
