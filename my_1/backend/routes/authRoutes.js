// backend/routes/authRoutes.js
import express from 'express';
import {
    register,
    login,
    getCurrentUser,
    updateScore,
    updatePassword,
    updateUserInfo
} from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.post('/update-score', authenticate, updateScore);
router.put('/update-password',authenticate,updatePassword);
router.put('/update-user-info',authenticate,updateUserInfo);
export default router;
