import express from 'express';
import {
	getUser,
	login,
	logout,
	register,
} from '../../controllers/userControllers.js';
import { isAuthenticated } from '../../meddilwares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', isAuthenticated, getUser);
router.post('/logout', isAuthenticated, logout);

export default router;
