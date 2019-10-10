module.exports = (app,passport) => {
	const notes = require('../controllers/note.controller.js');

	//=======================passport routes====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('../views/passport/index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('../views/passport/login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('../views/passport/signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/fill_info', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    app.get('/fill_info', isLoggedIn, function(req, res) {
        res.render('../views/passport/fill.info.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });


    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('../views/passport/profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

	//=======================notes routes====================================

    // define a simple route
    app.get('/test',isLoggedIn, function (req, res) {
        res.render('../views/note/index.ejs');
    });

    // Create a new Note
    app.post('/notes',isLoggedIn, notes.create);

    // Retrieve all Notes
    app.get('/notes',isLoggedIn, notes.findAll);

    // Retrieve a single Note with noteId
    app.get('/notes/:noteId',isLoggedIn, notes.findOne);

    // Update a Note with noteId
    app.put('/notes/:noteId',isLoggedIn, notes.update);

    // Delete a Note with noteId
    app.delete('/notes/:noteId',isLoggedIn, notes.delete);
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}