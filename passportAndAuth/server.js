const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');



mongoose.Promise = global.Promise;

const app = express();

app.use(express.static('public'));

//handle post bodies
app.use(bodyParser.urlencoded({ extended : false }));

app.use(session({
  secret : 'Gotta Catch Em All!',
  resave : false,
  saveUninitialized: false
})) //use express-session. keeps track of users.

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig').configure(passport); //export configure function from passport.

const mustache = mustacheExpress();
mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache');

app.use(require('./routes/general')); //use general.js in routes.
app.use(require('./routes/auth')) // use auth.js in routes

let url = 'mongodb://localhost:27017/passportpractice';

mongoose.connect(url, { useMongoClient: true }).then(function(){console.log("connected to database for passportpractice")});

app.listen(4500, function(){
  console.log('listening on port 4500');
})
