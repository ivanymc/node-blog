import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Scheme = mongoose.Schema;

const authSchemea = new Scheme({
  name: {
    type: String,
    required: [true, "User Name Required"],
    unique: true,
  },
  googleId: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minlength: [4, "Minimum Password Length is 4 Characters"]
  }
}, { timestamps: true })


// Bcrypt before save the pw, dont use arrow function
// in order to use 'this' 
authSchemea.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})


// Static method to login
authSchemea.statics.login = async function(name, password) {
  const user = await this.findOne({ name });
  if(user) {
    // compare text password with hashed password
    const auth = await bcrypt.compare( password, user.password );
    if(auth) { return user; }
    throw Error('Incorrect Password');
  }
  throw Error('User do not exist');
}



const Auth = mongoose.model('Auth', authSchemea);

export default Auth;