const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

function configure(passport) {
  console.log(passport)
  const strategyFunc = function(username, password, done) {
    User.authenticate(username, password, function(err, user){
      if(err) {
      console.log('Local Strategy - error in passport config', err);
      done(err);
    } else if (user) {
      console.log('Local Strategy - user obtained');
      done(null, user); //pass along user so it can be saved in session.
    } else {
      console.log('Local strategy -- no user or something...')
      done(null, false, {
        message: 'either the username or password was invalid.'
      });
      }
    })
  }


  passport.use(new LocalStrategy(strategyFunc));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    })
  })
}

module.exports = {
  configure
};
