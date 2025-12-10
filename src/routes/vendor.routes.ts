// External imports
import express from 'express';
import createTicket from '../controllers/vendor/createTickets.js';

const route = express.Router();

route.post('/create-ticket', createTicket)

export {route as vendorRouter};