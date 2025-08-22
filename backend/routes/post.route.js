import express from 'express';
import { getPosts, createPost, likePost,  commentPost } from '../controller/post.controller.js';
import { authMiddleware }from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/', authMiddleware, getPosts);      // GET all posts
router.post('/', authMiddleware, createPost);   // POST a new post
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/comment', authMiddleware, commentPost);


export default router;
