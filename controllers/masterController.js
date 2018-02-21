var mongoose        = require("mongoose")
var User            = require("../models/Account")

var masterController = {};

masterController.list = function(req, res){
   
    User
      .findOne({email:req.user.email}).exec(function(err, user){                            
                          res.render('index',
                          { title: 'CTM [1.0.0]',
                              user: req.user
                             })
                           
                  })      
                
           
 }

module.exports = masterController; 