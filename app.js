import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'cookie-session';
import passport from 'passport';
import 'dotenv/config';

// Routes
import blogDeatilsRoutes from './routes/blogDetailsRoutes.js';
import authRoutes from './routes/authRoutes.js';

// React Blogs
import { saveReactBlogs, displayReactBlogs } from './controllers/blogControllers.js';

// Middleware
import { authMiddleware, checkUserMiddleware } from './middleware/authMiddleware.js';

const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware & static files 
app.use(morgan('tiny'));
// make form submit attach to req, able req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// static files
app.use(express.static('public'));
// file inside public can assess from front-end
// because default server dont allow end-user to touch file

// Cookie session
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SESSION_KEYS
}));

app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
const dbURL = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPw}@node.qrxhn.mongodb.net/${process.env.mongoDBName}?retryWrites=true&w=majority`;

mongoose.connect(dbURL)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

  
// Auth
app.get('*', checkUserMiddleware);
app.use('/auth', authRoutes);

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
}); 

app.get('/about', authMiddleware, (req, res) => {
  res.render('about', { title: 'About' });
});

// blog details routes
app.use('/blogs', authMiddleware, blogDeatilsRoutes);

// For React Blog
app.get('/reactblogs', displayReactBlogs);
app.post('/reactblogs', saveReactBlogs);

// all other url req will go to this url
// so this must put in the bottom, wait above matching first
app.use( (req, res) => {
  res.status(404).render('404', { title: '404' });
});