// External imports
import express from 'express';

// Local imports
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.js';
import verifyUserRole from '../middlewares/verifyUserRole.js';
import { authRouter } from './auth.routes.js';
import { adminRouter } from './admin.routes.js';
import { vendorRouter } from './vendor.routes.js';
import { userRouter } from './user.routes.js';
import { publicRouter } from './public.routes.js';

const router = express.Router();

router.get('/', (req, res) => res.send('server is running'));

router.use('/auth', authRouter);
router.use('/admin', verifyFirebaseToken, verifyUserRole('admin'), adminRouter);
router.use('/vendor', verifyFirebaseToken, verifyUserRole('vendor'), vendorRouter);
router.use('/user', verifyFirebaseToken, userRouter);
router.use('/public', publicRouter);

export default router;
