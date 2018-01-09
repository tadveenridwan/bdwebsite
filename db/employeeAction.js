var express = require('express');
var router = express.Router();
var db = require('../db');
var employeeAction = require('../db/employeeAction');
// Submitting contactUs/contactform form details

exports.addContactUsForm = function(req, res){

    usr = req.body;
    console.log(usr);
    var details = {
        firstname: usr.firstname,
        lastname: usr.lastname,
        email: usr.email,
        subject: usr.subject,
        message: usr.message
    };
    db.query('INSERT into  `contactus` SET ?', details, function (err, result) {
        if (err)
            throw err;
        else{
            console.log(' The value inserted in database. ');
            req.flash('success', 'Thanks for your query, we will reply as soon as possible');
            res.redirect('/contactform');
        }
    });
//Searching the Student name

exports.findEmployeeName = function(req, res){

var queryName = 'SELECT * FROM employee WHERE username = "'+ req.body.username +'"';
db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result[0]); 
        if(result[0] != undefined)
        {
            console.log("here is coming"); 
            req.flash('usernameExist', 'The username is already exist');
            res.redirect('/contactus');
        }
        else 
            employeeAction.findEmployeeEmail(req, res);
    }
    
});
};

//Maching the email with username

exports.findEmployeeEmail = function(req, res){

var queryName = 'SELECT * FROM employee WHERE email = "'+ req.body.email +'"';
db.query(queryName,function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result[0]); 
        if(result[0] != undefined)
        {
            req.flash('userEmail', 'The email is already exist');
            res.redirect('/contactus');
        }
        else 
            employeeAction.addEmployee(req, res);
    }
    
});

};


//Registration an student

exports.addEmployee = function(req, res){

    usr = req.body;
	console.log(usr);
    var details = {
        username: usr.username,
        password: usr.password,
        fname: usr.fname,
        lname: usr.lname,
        gender: usr.gender,
        email: usr.email,
        mobile: usr.mobile,
        category: usr.categiryType,
        confirmation: usr.confirmation
    };
    db.query('INSERT into  `employee` SET ?', details, function (err, result) {
        if (err)
            throw err;
        else{
        console.log(' The value inserted. ');
                req.flash('success', 'Your registration has been successfully completed.');
            res.redirect('/contactus');
        }
    });

};

// Passport sign in


exports.findByUsername = function(username, cb) {
    console.log(username);
  process.nextTick(function() {
        console.log(username);
        var queryName = 'SELECT * FROM employee WHERE username = "'+ username +'"';
        db.query(queryName,function(err, result) {
        console.log(result);
      if (result[0] != undefined) {
        return cb(null, result[0]);
      }
    
    return cb(null, null);
        });
  });
    };

//Finding by the userId

    exports.findById = function(id, cb) {
    console.log(id);
  process.nextTick(function() {
    var queryName = 'SELECT * FROM employee WHERE id = "'+ id +'"';
    db.query(queryName,function(err, result) {
        console.log(result);
      if (result[0] != undefined) {
        return cb(null, result[0]);
      }
    
    return cb(null, null);
        });
  });
};
