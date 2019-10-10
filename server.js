// set up ======================================================================
// get all the tools we need
const express  = require('express');
const app      = express();
const port     = process.env.PORT || 3000;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const configDB = require('./config/database.config.js');
const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// var $ = require('jquery');
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())


// configuration ===============================================================
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(configDB.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


// required for passport

app.use(session({
    secret: 'ilovescotchscotchyscotchscotch',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./config/passport.config.js')(passport);

// view setup ======================================================================
app.set('views','./app/views');
app.set('view engine', 'ejs'); // set up ejs for templating


// routes ======================================================================
// require('./app/routes/note.routes.js')(app);
require('./app/routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



app.use(express.static(__dirname + '/public'));
app.use('/static', express.static('./static'));
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);