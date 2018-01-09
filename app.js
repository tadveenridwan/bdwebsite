
var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//Configuring flash
var flash = require('express-flash');

// Configuring Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var database = require('./db');
var action = require('./db/action');











var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

//Using flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//Getting the index/home page
app.get('/', function(req, res, next) {
    res.render('index',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});


//showing contactform/Message page

app.get('/contactform', function(req, res, next) {
    res.render('contactform',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});

app.post('/contactform', function(req, res, next) {
    // debugging purpose console.log("Ridwan" + req.body.Name);
    console.log(req.body.email);
    console.log(req.body.Subject);
    console.log(req.body.Message);
    employeeAction.addContactUsForm(req, res);
});












//Showing about us page
app.get('/aboutus', function(req, res, next) {
    res.render('aboutus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});












//showing websocket/socket.io page
app.get('/websocket', isMemberAuthenticated, function(req, res){
    res.render('websocket',
        {
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'},
            user: req.user
        });
});


// Configuring the websocket
var io = require('socket.io').listen(3080);
var userSocket = [];
var memberSocket = [];
var connections = [];


// connected and disconnected
    io.on('connection', function(socket){
    console.log('coming here');
    connections.push(socket);
    console.log('connected: %s ',connections.length);

    socket.on('disconnect',function(socket){
        memberSocket.splice(memberSocket.indexOf(socket),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected:%s connected',connections.length);
    });

    //Sending the username who are chatting
    socket.on('username',function(data,callback){
        console.log('username is:' +data);
        socket.memberSocket = data.username;
        memberSocket.push(socket.memberSocket);
        updateUsernames();
    });
    function updateUsernames(){
        io.emit('get users', memberSocket);
    }

    socket.on('chat message', function(data){
        io.emit('chat message', {msg : data, username: socket.memberSocket});
    });

});




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



