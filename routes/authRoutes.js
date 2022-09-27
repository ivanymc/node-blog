import express from 'express';
import passport from 'passport';
import { getLogininPage, getRegisterPage, googleRedirect, login, logout, register } from '../controllers/authControllers.js';

const router = express.Router();


// Get login and register page
router.get('/login', getLogininPage);
router.get('/register', getRegisterPage);

// Create acc
router.post('/register', register);

// Local Login
router.post('/login', login);

// Logout
router.get('/logout', logout)

// Google Login
router.get('/google', passport.authenticate('google', {
  scope: [ 'profile' ]}));

router.get('/google/redirect', passport.authenticate('google'), googleRedirect)

export default router;