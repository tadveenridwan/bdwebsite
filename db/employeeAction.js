
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
