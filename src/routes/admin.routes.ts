// External imports
import express from 'express';

// Local imports
import getUsersData from '../controllers/admin/getUsersData.js';
import updateRole from '../controllers/admin/updateRole.js';
import updateIsFraud from '../controllers/admin/updateIsFraud.js';
import getTickets from '../controllers/admin/getTickets.js';
import updateTicketStatus from '../controllers/admin/updateTicketStatus.js';

const router = express.Router();

router.get('/get-user-data', getUsersData);
router.get('/tickets', getTickets);
router.patch('/update-role', updateRole);
router.patch('/update-is-fraud', updateIsFraud);
router.patch('/update-ticket-status', updateTicketStatus);

export { router as adminRouter };
