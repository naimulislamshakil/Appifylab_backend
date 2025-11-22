import express from 'express';
import { addPost, getAllPost } from '../../controllers/postControllers.js';
import { isAuthenticated } from '../../meddilwares/auth.js';

const router = express.Router();

router.post('/addpost', isAuthenticated, addPost);
router.get('/getAllPost', isAuthenticated, getAllPost);

export default router;
