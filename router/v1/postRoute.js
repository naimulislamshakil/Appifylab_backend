import express from 'express';
import {
	addComment,
	addLoveOrUnlike,
	addPost,
	getAllPost,
} from '../../controllers/postControllers.js';
import { isAuthenticated } from '../../meddilwares/auth.js';

const router = express.Router();

router.post('/addpost', isAuthenticated, addPost);
router.get('/getAllPost', isAuthenticated, getAllPost);
router.post('/addLoveOrUnlike', isAuthenticated, addLoveOrUnlike);
router.post('/addComment', isAuthenticated, addComment);

export default router;
