var passport = require('passport');
var express = require('express');
var router = express.Router();

var Account = require('../models/Account');
var Supplier = require('../controllers/supplierController');
var Customer = require('../controllers/customerController');
var Statuses = require('../controllers/statusController');
var UserAccount = require('../controllers/accountController');
var Operations = require('../controllers/operationController');
var Reports   = require('../controllers/reportController');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'CTM [v1.0.0]', user: req.user });
});

router.get('/register', function(req, res) {
  res.render('register', {});
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    res.redirect('/');
  });
});

router.get('/login', function(req, res) {
  res.render('login', {title: 'CTM [v1.0.1]', user: req.user});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// router.get('/users', function(req, res) {
//   res.render('login', {title: 'CTM [v1.0.1] - Usuários', user: req.user});
// });


// ++++++++++++++++++++++ Suppliers +++++++++++++++++++++++++++

router.get('/suppliers',  isLoggedIn, Supplier.list);
// Get single user by id
router.get('/suppliers/show/:id', isLoggedIn, Supplier.show);
// Create user
router.get('/suppliers/new', isLoggedIn, Supplier.create);
// Save user
router.post('/suppliers/save', isLoggedIn, Supplier.save);
// Edit user
router.get('/suppliers/edit/:id', isLoggedIn, Supplier.edit);
// Edit user
router.post('/suppliers/update/:id',isLoggedIn,  Supplier.update);
// Delete
router.post('/suppliers/delete/:id', isLoggedIn, Supplier.delete);

router.get('/suppliers/exportxls',  isLoggedIn, Supplier.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// ++++++++++++++++++++++ Customers +++++++++++++++++++++++++++

router.get('/customers',  isLoggedIn, Customer.list);
// Get single user by id
router.get('/customers/show/:id', isLoggedIn, Customer.show);
// Create user
router.get('/customers/new', isLoggedIn, Customer.create);
// Save user
router.post('/customers/save', isLoggedIn, Customer.save);
// Edit user
router.get('/customers/edit/:id', isLoggedIn, Customer.edit);
// Edit user
router.post('/customers/update/:id',isLoggedIn,  Customer.update);
// Delete
router.post('/customers/delete/:id', isLoggedIn, Customer.delete);

router.get('/customers/exportxls',  isLoggedIn, Customer.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Statuses +++++++++++++++++++++++++++

router.get('/statuses',  isLoggedIn, Statuses.list);
// Get single user by id
router.get('/statuses/show/:id', isLoggedIn, Statuses.show);
// Create user
router.get('/statuses/new', isLoggedIn, Statuses.create);
// Save user
router.post('/statuses/save', isLoggedIn, Statuses.save);
// Edit user
router.get('/statuses/edit/:id', isLoggedIn, Statuses.edit);
// Edit user
router.post('/statuses/update/:id',isLoggedIn,  Statuses.update);
// Delete
router.post('/statuses/delete/:id', isLoggedIn, Statuses.delete);

router.get('/statuses/exportxls',  isLoggedIn, Statuses.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ User Account +++++++++++++++++++++++++++

router.get('/users',  isLoggedIn, UserAccount.list);
// Get single user by id
router.get('/users/show/:id', isLoggedIn, UserAccount.show);
// Create user
router.get('/users/new', isLoggedIn, UserAccount.create);
// Save user
router.post('/users/save', isLoggedIn, UserAccount.save);
// Edit user
router.get('/users/edit/:id', isLoggedIn, UserAccount.edit);
// Edit user
router.post('/users/update/:id',isLoggedIn,  UserAccount.update);
// Delete
router.post('/users/delete/:id', isLoggedIn, UserAccount.delete);

router.get('/users/exportxls',  isLoggedIn, UserAccount.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Operations Account +++++++++++++++++++++++++++

router.get('/operations',  isLoggedIn, Operations.list);
// Get single user by id
router.get('/operations/show/:id', isLoggedIn, Operations.show);
// Create user
router.get('/operations/new', isLoggedIn, Operations.create);
// Save user
router.post('/operations/save', isLoggedIn, Operations.save);
// Edit user
router.get('/operations/edit/:id', isLoggedIn, Operations.edit);
// Edit user
router.post('/operations/update/:id',isLoggedIn,  Operations.update);
// Delete
router.post('/operations/delete/:id', isLoggedIn, Operations.delete);

router.get('/operations/exportxls',  isLoggedIn, Operations.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Report Operations Grid +++++++++++++++++++++++++++
// View List
router.get('/report/operation',  isLoggedIn, Reports.operationsshow);
// loadData
router.get('/report/operations',  isLoggedIn, Reports.operationslist);
// // updateItem
// router.put('/report/operations',  isLoggedIn, Reports.operationsupdate);
// // deleteItem
// router.delete('/report/operations',  isLoggedIn, Reports.operationsdelete);

module.exports = router;

function isLoggedIn(req, res, next) {            
  // if (req.isAuthenticated())        
      return next();

  // res.redirect('/login');
}