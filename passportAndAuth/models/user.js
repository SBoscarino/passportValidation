//provide schema for registration
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //a library for hashing the password.

//wireframe for username and password
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})

userSchema.virtual('password')
  .get(function() {return null; })
  .set(function(value) {   //value = value of the password entered by user.
    const hash = bcrypt.hashSync(value, 10); //does the hashing
    this.passwordHash = hash; //sets uer password = to the hashed values.
  })

userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
} //puts an authenticate function on every password when logging in when it comes from the database. bcrypt compares the hashed password from the login to the hashed version in the database.

userSchema.statics.authenticate = function(username, password, done){
  this.findOne({ username : username }, function(err, user) {
    if (err) {
      console.log('error when trying to authenticate in user.js', err)
      done(err)
    } else if (user && user.authenticate(password)) {
      console.log('Successful login');
      done(null, user)
    } else {
      console.log('pasword is wrong?');
      done(null, false) //no user matching or no user registered.
    }
  })
}

const User = mongoose.model('User', userSchema);

module.exports = User;
