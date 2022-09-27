import Auth from '../models/Auth.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';


// handle errors
const handleErrors = err => {
  let errors = { name: "", password: "" }

  // duplicate error
  if(err.code === 11000) {
    errors.name = '* ' + 'This name is already registered.';
    return errors;
  }

  // validation error, should done at front-end, much more easy
  if(err.message.includes('Auth validation failed')) {
    Object.values(err.errors).forEach( error => {
      errors[error.properties.path] = '* ' + error.properties.message
    })
    return errors;
  }

  // login - name
  if(err.message === 'User do not exist') {
    errors.name = '* ' + 'This User do not exist.';
    return errors;
  }

  // login - password
  if(err.message === 'Incorrect Password') {
    errors.password = '* ' + 'Incorrect Password';
    return errors;
  }
};


// create token
const secretKey = process.env.JWT_SECRET;
const maxAge = 365 * 24 * 60 * 60;
const createToken = id => {
  return jwt.sign( { id }, secretKey , { expiresIn: maxAge })
};


// Routes Controllers
const getLogininPage = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

const getRegisterPage = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};


const register = async (req, res) => {
  const { name, password  } = req.body;

  try {
    const user = await Auth.create({ name, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
    res.status(201).json({ user: user._id });
  } catch (err) { 
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  };
};


const login = async (req, res) => {
  const { name, password } = req.body;
  
  try {
    const user = await Auth.login(name, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
    res.status(200).json({ user: user._id })
  } 
  catch (err) { 
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  };
};


const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};



/* ========================================================
// Google Auth Controllers
======================================================== */
// Passport Google Strategy
// Send cookie from server to user
// express-session for passport
passport.serializeUser( (user, done) => {
  done(null, user._id);
});

// receive cookie from user
passport.deserializeUser( (_id, done) => {
  Auth.findById(_id)
    .then( user => done(null, user ));
});


passport.use( new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
  }, 
  async function(accessToken, refreshToken, profile, done) {
    await Auth.findOne({ googleId: profile.id })
      .then( async currentUser => {
        if(currentUser) {
          // User already exist
          console.log('user is:' + currentUser);
          done(null, currentUser);
        } else {
          // New User
          console.log('profile', profile);
          await Auth.create({
            name: profile.displayName,
            googleId: profile.id,
            password: profile.id
          })
            .then( newUser => { done(null, newUser)})
        }
      });
  }
));


// Google Login Redirect
const googleRedirect = async (req, res) => {
  try {
    const token = createToken(req.user._id);
    console.log(req.user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
    res.redirect('/blogs');
  } catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  };
};


export {
  getLogininPage,
  getRegisterPage,
  register,
  login,
  logout,
  secretKey,
  googleRedirect
}