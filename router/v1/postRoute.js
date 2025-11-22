import express from 'express';
import {
	addLoveOrUnlike,
	addPost,
	getAllPost,
} from '../../controllers/postControllers.js';
import { isAuthenticated } from '../../meddilwares/auth.js';

const router = express.Router();

router.post('/addpost', isAuthenticated, addPost);
router.get('/getAllPost', isAuthenticated, getAllPost);
router.get('/addLoveOrUnlike', isAuthenticated, addLoveOrUnlike);

export default router;
