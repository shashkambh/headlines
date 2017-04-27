var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session'); 
var passport = require('passport');
var flash = require('connect-flash');

// routes
var routes = require('./routes/index');
var users = require('./routes/users');

// Runs passport setup script
var passportFile = require('./scripts/passport');

var app = express();
app.locals.feedData = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
var headlines_dirname = path.join(__dirname);
app.set('view engine', 'ejs');

// Middleware
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'anystringoftext', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Session-persisted message middleware
app.use(function(req, res, next){
  var signuperr = req.session.signuperror,
      loginerr = req.session.loginerror
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.signuperror;
  delete req.session.loginerror;
  delete req.session.success;
  delete req.session.notice;

  if (signuperr) res.locals.signuperror = signuperr;
  if (loginerr) res.locals.loginerror = loginerr;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});


// Routes
app.use('/', routes);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
//app.use(app.router);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
