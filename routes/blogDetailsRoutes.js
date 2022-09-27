import express from 'express';

import { deleteBlog, getAllBlogs, getBlog, getCreateBlog, postBlog } from '../controllers/blogControllers.js';

const router = express.Router();

// Redirect to the create blog
router.get('/create', getCreateBlog);

// Get All Blogs
router.get('/', getAllBlogs);

// Post Blog
router.post('/', postBlog);

// Get centain Blog
router.get('/:id', getBlog );

// Delete Blog
router.delete('/:id', deleteBlog);

export default router;


