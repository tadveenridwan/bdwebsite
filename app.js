
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

var employeeAction = require('./db/employeeAction');

// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke callback `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use('StudentSignIn-local',new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true, },
    function(req, username, password, cb ) {
      employeeAction.findByUsername(username, function( err, user) {
        if (err) { return cb(err); }
        if (!user) { 
         return cb(null, false, req.flash('username','Invalid username')); 
       }
        if (user.password != password) { 
         return cb(null, false, req.flash('password','Wrong password'));
          }
        return cb(null, user);
      });
    }));
passport.use('MemberSignIn-local',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true, },
    function(req, email, password, cb ) {
      employerAction.findByEmail(email, function( err, user) {
        if (err) { return cb(err); }
        if (!user) { 
         return cb(null, false, req.flash('email','Invalid email address')); 
       }
        if (user.password != password) { 
         return cb(null, false, req.flash('password','Wrong password'));
          }
        return cb(null, user);
      });
    }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {

if (user.fname) {
    // serialize user
    employeeAction.findById(user.id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
  }
if (user.aEmail) {
    // serialize user
    employerAction.findById(user.id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
}
});

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

//getting the index/home page
app.get('/', function(req, res, next) {
    res.render('index',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});


//getting contactform/Message page
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


//Member registration

app.post('/memberRegistration', function(req, res, next) {

    req.checkBody('password', 'Password is too short. Minimum size is 8.').notEmpty().isLength({min:8});
    req.checkBody('confirmPassword', 'Confirm password does not match with password').equals(req.body.password);
    var errors = req.validationErrors();

    console.log(errors);
    if (errors) {

        console.log(req.body);
        // req.flash( 'formdata',req.body); // load form data into flash
        req.flash('errors', errors);
        res.redirect('/contactus');
        // return done(null, false, req.flash('formdata', req.body));
    }
    else
    {
        employerAction.findEmployerEmail(req, res);
        // employerAction.findEmployerEmail(req, res);
    }

});

// Student Registration page showing

app.get('/contactus', function(req, res, next) {
    res.render('contactus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});
// StudentRegistration verification and post

app.post('/employeeRegistration', function(req, res, next) {

    req.checkBody('password', 'Password is too short. Minimum size is 8.').notEmpty().isLength({min:8});
    req.checkBody('rePassword', 'Confirm password is too short. Minimum size is 8.').isLength({min:8});
    req.checkBody('rePassword', 'Confirm password does not match with password').equals(req.body.password);
    var errors = req.validationErrors();

    console.log(errors);
    if (errors) {
            
            console.log(req.body);
            // req.flash( 'formdata',req.body); // load form data into flash
            req.flash('errors', errors);
           res.redirect('/contactus');
            // return done(null, false, req.flash('formdata', req.body));
    }
    else
    {
      employeeAction.findEmployeeName(req, res);
      // employeeAction.findEmployeeEmail(req, res);
    }
});


//Student signin page 

app.get('/employeesign', function(req, res, next) {
    res.render('employeesign',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} 
        });
});

//Student authentication check

app.post('/employeesign',
    passport.authenticate('EmployeeSignIn-local',{ 
      failureRedirect: '/employeesign' ,
      successRedirect: '/',
      failureFlash: true
    })
);


//Checking Student authentication

function isEmployeeAuthenticated(req, res, next) {
    if (req.user.username)
        return next();
    res.redirect('/');
}

//Logging out 

app.get('/logout', function(req, res){
  console.log(req.user);
  req.logout();
  res.redirect('/');
});





//getting about us page
app.get('/aboutus', function(req, res, next) {
    res.render('aboutus',
    { 
            partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
            user : req.user
        });
});


//getting schedule page
app.get('/schedule', function(req, res, next) {
    var queryName = 'SELECT * FROM schedule';
    database.query(queryName,function(err, result) {
        console.log(result);
        //res.send(result);
        res.render('scheduling',
            {
                partials: {header: 'mastertemplate/header',footer: 'mastertemplate/footer'} ,
                user : req.user,
                result : result
            });
    });
});

app.get('/getAllUserList', function(req, res) {
    var queryName = 'SELECT username,fname FROM employee';
    database.query(queryName,function(err, result) {
        //return result;
        console.log(result);
        res.send(result);
        //return JSON.stringify(result);
    });
});

app.post('/postscheduling', function(req, res) {
    schedulingAction.addSchedule(req, res);
});

app.get('/getSingleSchedule', function(req, res) {
    console.log(req.query.search);
    var queryName = 'SELECT * FROM schedule WHERE id = "'+ req.query.search +'"';
    database.query(queryName,function(err, result) {
        res.send(result[0]);
    });
});

app.get('/postSingleSchedule', function(req, res) {
    console.log("req.query");
    var queryName = 'UPDATE schedule SET start="'+ req.query.formDate +'",end="'+ req.query.toDate +'",person="'+ req.query.rePerson +'" WHERE id = "'+ req.query.id +'"';
    database.query(queryName,function(err, result) {
        res.send("updated");
    });
});

//getting websocket/socket.io page
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



