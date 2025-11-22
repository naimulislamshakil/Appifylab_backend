import express from 'express';
import { addPost } from '../../controllers/postControllers.js';
import { isAuthenticated } from '../../meddilwares/auth.js';

const router = express.Router();

router.post('/addpost', isAuthenticated, addPost);

export default router;
