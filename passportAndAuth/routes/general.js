const router = require('express').Router();


router.get('/index', (req, res) => {
  res.render('index');
});

function authRequired(req, res, next){
  if(req.user) {
    next();
  } else {
    res.redirect('./login');
  }
}

router.get('/home', authRequired, (req, res) => {
  console.log("user:", req.user)
  res.render('home', {
    username: req.user.username
  })
});

router.get('/register', (req, res) => {
  res.render('register');
});

module.exports = router;
