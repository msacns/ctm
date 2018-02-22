var mongoose        = require("mongoose");
var User            = require("../models/Account");
var Operation       = require("../models/Operations");
var moment          = require("moment");
var masterController = {};

masterController.list = function(req, res){
   
    User
      .findOne({email:req.user.email}).exec(function(err, user){                            
                          res.render('index',
                          { title: 'CTM [1.0.0]',
                              user: req.user
                             });
                           
                  });  
 }

 
masterController.showtimeline = function(req, res){
    Operation
        .find()
        .exec(function(err,cntrs){
            if(err){
                console.log('Error on load timeline:' + err);
            }else{
                var retmsg =[];
                for(var i=0;i < cntrs.length;i++){
                    var Cntr = cntrs[i].cntr;
                    var Invoice = cntrs[i].invoice;
                    var dtinvoice = cntrs[i].dtinvoice;
                    var dtdeparture = cntrs[i].dtdeparture;
                    var dtarrival = cntrs[i].dtarrival;
                    var dtdemurrage = cntrs[i].dtdemurrage;

                    var retorno = {  
                        "title": Invoice ,                     
                        "content": "Invoice",
                        "start": moment(dtinvoice,"DD/MM/YYYY").format("YYYY-MM-DD"),
                        "group": Cntr
                    };   
                    retmsg.push(retorno);
                }
                res.json(retmsg);
            }
        });
 }

module.exports = masterController; 