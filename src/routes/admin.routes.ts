// External imports
import express from 'express';

// Local imports
import getUsersData from '../controllers/admin/getUsersData.js'
import updateRole from '../controllers/admin/updateRole.js'

const router = express.Router();

router.get('/get-user-data', getUsersData);
router.post('/update-role', updateRole)

export { router as adminRouter };