import express from 'express';
import { adminLogin, adminRegister, userAuthenticated, userLogout } from '../Controller/authenticationController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', adminRegister);
router.get('/isAuthenticated', authMiddleware, userAuthenticated);
router.get('/logout', userLogout);
// router.get('/refreshAccessToken', refreshAccessToken);

export default router; 