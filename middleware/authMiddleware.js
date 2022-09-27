import { secretKey } from '../controllers/authControllers.js';
import jwt from 'jsonwebtoken';
import Auth from '../models/Auth.js'

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if(token) {
    jwt.verify( token, secretKey, (err, decodedToken) => {
      if(err) { res.redirect('/auth/login') }
      else { next(); }
    })
  } else { res.redirect('/auth/login'); }
};

// Check User
const checkUserMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if(token) {
    jwt.verify( token, secretKey, async (err, decodedToken) => {
      if(err) { 
        res.locals.user = null;
        next(); 
      } else { 
        let user = await Auth.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  } else { 
    res.locals.user = null;
    next();
  }
}

export {
  authMiddleware,
  checkUserMiddleware
}
  
