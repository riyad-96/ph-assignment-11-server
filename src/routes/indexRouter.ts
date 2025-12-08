import express from 'express';
import { userRouter } from './user.routes.js';
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.js';
import verifyUserRole from '../middlewares/verifyUserRole.js';
import { adminRouter } from './admin.routes.js';

const router = express.Router();

router.get('/', (req, res) => res.send('server is running'));
router.use('/user', userRouter);
router.use('/admin', verifyFirebaseToken, verifyUserRole('admin'), adminRouter);

export default router;
