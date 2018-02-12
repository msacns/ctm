var mongoose        = require("mongoose")
var User            = require("../models/Account")

var masterController = {};

masterController.list = function(req, res){
   
    var uavatar = getInitials(req.user.username);       

    User
      .findOne({email:req.user.email}).exec(function(err, user){                            
                          res.render('index',
                          { title: 'CTM [1.0.0]',
                              user: req.user,                              
                              ulogo: uavatar
                             })
                           
                  })      
                
           
 }

 module.exports = masterController; 

var getInitials = function (string) {
    var names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }else{
        initials = names.substring(0, 1).toUpperCase();
    }   
    return initials;
};