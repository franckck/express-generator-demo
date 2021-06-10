var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql      = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'berceau',
  database : 'demo-auth'
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false
},
function(username, password, done) {
  console.log('username', username, 'password', password);
  connection.query('select * from users where username=? and password=?', [username, password], 
    function(error, results, fields) {
      console.log('error', error);
      if(error) {
        return done(error);
      }
      if(results.length === 0) {
        return done({message: 'Unknown User'});
      }
      var user  = {username: results[0].username, password:  results[0].password};
      return done(null, user);
  });
}
));

connection.connect();

// const  authentication = (req, res, next) => {
//   console.log('LOGGER');
//   const loto = Math.random();
//   if(loto < 0.5) {
//     res.send("403 Non authorise");
//   } else {
//     req.user = {
//       id: 10,
//       name: 'Toto'
//     };
//     next();
//   }
  
// }

// app.use(authentication);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter(connection));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
