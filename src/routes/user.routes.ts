// External imports
import express from 'express';

// Local imports
import { getUser } from '../controllers/user/getUser.js';
import { createUser } from '../controllers/user/createUser.js';
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.js';
import { socialLogin } from '../controllers/user/socialLogin.js';

const router = express.Router();

router.get('/get', verifyFirebaseToken, getUser);
router.post('/create', createUser);
router.post('/sociallogin', verifyFirebaseToken, socialLogin);

export { router as userRouter };
