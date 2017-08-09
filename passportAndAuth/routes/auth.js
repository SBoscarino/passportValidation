//for authorization

const router = require('express').Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const passport = require('passport');

router.get('/login', (req, res) =>{
  res.render('login');
})

router.post('/login', (passport.authenticate('local', {
  successRedirect : '/home',
  failureRedirect : '/login'
}))); //when someone posts, passport handles authentication. Passport is gluing some things together.



router.get('/register', (req, res, next) =>{
    res.render('/register'); //get register page.
})
//from register page form post.
router.post('/register', (req, res) => {
  console.log('hi im the auth.js', req.body);
  const user = new User ({ username : req.body.username, password : req.body.password});
  user.save((err) => {
    if (err) {
      console.log('error at auth.js', err);
    }
    next();
  });
}, passport.authenticate('local', {
    successRedirect : '/home',
}));


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})



module.exports = router;
