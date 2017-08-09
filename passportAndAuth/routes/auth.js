//for authorization

const router = require('express').Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const passport = require('passport');

router.get('/login', (req, res) =>{
  const flashMessages = res.locals.getMessages();
  console.log('flash messages', flashMessages);

  if(flashMessages.error){
    res.render('login', {
      showErrors : true,
      errors : flashMessages.error //errors
    })
  } else {


  res.render('login');
  }
})

router.post('/login', (passport.authenticate('local', {
  successRedirect : '/home',
  failureRedirect : '/login',
  failureFlash: true //tell passport to start saving errors in flash memory
}))); //when someone posts, passport handles authentication. Passport is gluing some things together.



router.get('/register', (req, res, next) =>{
  const flashMessages = res.locals.getMessages();
  console.log('flash messages', flashMessages);

  if (flashMessages.error) {
    res.render('register', {
      showErrors: true,
      errors: flashMessages.error
    })
  }
  else {
    res.render('register');
  }
})



//from register page form post.
router.post('/register', (req, res) => {

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  req.getValidationResult()
    .then(function(result){
      if (result.isEmpty() === false) {
        result.array().forEach((error) => {
          req.flash('error', error.msg);
        })
        res.redirect('/register');
      }
      else {
        console.log('hi im the auth.js', req.body);
        const user = new User ({ username : req.body.username, password : req.body.password});
        user.save((err) => {
          if (err) {
            if (error.message.indexOf('duplicate key error') > -1){
              req.flash('Username already in use');
            } else {
              req.flash('there was a problem.');
            }
            res.redirect('/register');
          } else {
              next();
          }
        });
      }
    })
}, passport.authenticate('local', {
    successRedirect : '/home',
}));


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})

router.get('/help', (req, res) => {
  res.render('help');
})

module.exports = router;
