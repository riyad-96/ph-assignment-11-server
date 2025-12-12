// External imports
import express from 'express';

// Local imports
import verifyFirebaseToken from '../middlewares/verifyFirebaseToken.js';
import getUser from '../controllers/auth/getUser.js';
import createUser from '../controllers/auth/createUser.js';
import socialLogin from '../controllers/auth/socialLogin.js';
import updateProfile from '../controllers/auth/updateProfile.js';

const router = express.Router();

router.get('/get', verifyFirebaseToken, getUser);
router.post('/create', createUser);
router.post('/sociallogin', verifyFirebaseToken, socialLogin);
router.post('/update', verifyFirebaseToken, updateProfile);

// home routes

export { router as authRouter };
