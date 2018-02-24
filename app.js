var env = process.env.NODE_ENV || 'development';

var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('cookie-session');
var mongoose      = require('mongoose');
var config        = require('./config/config')[env];
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var helpers       = require('view-helpers');
var acl           = require('acl');

global.config = config;
global.version = '1.0.0';

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.db);
mongoose.connection.on('connected', () => {
    
    // Init ACL on Mongoose
    acl = new acl(new acl.mongodbBackend(mongoose.connection.db, "acl_"));
    
    // Defining roles and routes
    set_roles();
    set_routes();

    return console.log('Mongoose conectado');
});
mongoose.connection.on('disconnected', () => {
    return console.log('Mongoose desconectado');
});
mongoose.connection.on('error', error => {
    return console.log('Mongoose erro de conexão: ' + error);
});

//Middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({keys: [config.crypto.secret]}));

//*********************************************************************************************
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})
//*********************************************************************************************  
app.use(helpers('CTM'));
// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var Account = require('./models/Account');
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Set Service Scope for Intercharge messages
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

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

// This creates a set of roles which have permissions on
//  different resources.
function set_roles() {
  
      // Define roles, resources and permissions
      acl.allow([
          {
              roles: 'A',
              allows: [
                  { resources: '/dashboard', permissions: '*' }
              ]
          }, {
              roles: 'C',
              allows: [
                  { resources: '/users', permissions: '*' }
              ]
          }, {
              roles: 'B',
              allows: []
          }
      ]);
  
      // Inherit roles
      //  Every user is allowed to do what guests do
      //  Every admin is allowed to do what users do
      acl.addRoleParents( 'A', 'guest' );
      acl.addRoleParents( 'B', 'guest' );
      acl.addRoleParents( 'C', 'user' );
  }
// Defining routes ( resources )
function set_routes() {
  
      // Simple overview of granted permissions
      app.get( '/info',
          function( request, response, next ) {   
              acl.allowedPermissions( get_user_id(), [ '/info', '/secret', '/topsecret' ], function( error, permissions ){
                  response.json( permissions );
              });
          }
      );
  
      // Only for users and higher
      app.get( '/secret', acl.middleware( 1, get_user_id ),
          function( request, response, next ) {
              response.send( 'Welcome Sir!' );
          }
      );
  
      // Only for admins
      app.get( '/topsecret', acl.middleware( 1, get_user_id ),
          function( request, response, next ) {
              response.send( 'Hi Admin!' );
          }
      );
  
      // Setting a new role
      app.get( '/allow/:user/:role', function( request, response, next ) {
          acl.addUserRoles( request.params.user, request.params.role );
          response.send( request.params.user + ' is a ' + request.params.role );
      });
  
      // Unsetting a role
      app.get( '/disallow/:user/:role', function( request, response, next ) {
          acl.removeUserRoles( request.params.user, request.params.role );
          response.send( request.params.user + ' is not a ' + request.params.role + ' anymore.' );
      });
  }
