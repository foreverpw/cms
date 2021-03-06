var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');
var $conf = require('./app/web/conf/db');
var db = require('./app/web/dao/dbHelper');

db.init($conf.mysql)

var app = express();

//cors
var whitelist = ['http://localhost:9000']
var corsOptions = {
  credentials:true,
  origin: whitelist
}
app.use(cors(corsOptions))
//Access-Control-Allow-Credentials
app.use(function(req, res, next) {
  next();
});

//session
app.use(session({
  secret: 'content management system',
  resave: false,
  saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/assets')));

//routes
var routes = require('./app/web/routes/index');
var users = require('./app/web/routes/users');
var login = require('./app/web/routes/login/login');

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
