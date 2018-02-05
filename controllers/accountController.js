// 'use strict';
var mongoose        = require('mongoose');
var passport        = require('passport');
var Account         = require('../models/Account');
var Countries       = require('../models/Countries');
var AccountType     = require('../models/AccountType'); 
/*
ExcelJS
*/
var Excel           = require('exceljs');
// var workbook        = new Excel.Workbook();
/******************************************************** */


var accountController = {};

/**
 * CRUD
 */ 
accountController.list = function(req, res) {       
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Account
        .find()          
        .populate({
            path:'nd_AccountType', 
            select:'accountTypeDescription',
            options: { sort: { $natural: -1 }}
          })   
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, siti){                
            Account.count().exec(function(err, count){   
                    if(err) {  
                        console.log('Error no save:'+ err);
                        switch (err.code)
                        {
                            case 11000: 
                                req.flash('alert-danger', 'Estes dados já existem no registro de usuários.');    
                                break;        
                            default: 
                                req.flash('alert-danger', "Erro ao salvar:"+ err);  
                                break;
                        }
                    }else{
                        console.log('List:'+JSON.stringify(siti));
                        res.render('users/index',
                        { title: 'CTM [v1.0.0] - Usuários', 
                            list: siti,
                            user_info: req.user,
                            page: page + 1,
                            pages: Math.ceil(count / limit)}
                        );   
                    }    
                }); 
            });               
  };

accountController.create = function(req, res){   
    try {
        AccountType
            .find()
            .exec(function(err, acctp){
                res.render('users/new', { title: 'CTM [v1.0.0] - Novo Usuário', acctypes: acctp });              
        });         
    } catch ( err ) {                
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!Detalhe do erro:'+err});    
    };

  }; 
 
accountController.show = function(req, res){ 
  if (req.params.id != null || req.params.id != undefined) {      
    Account.findOne({_id: req.params.id})  
        .exec(function (err, actuser) {            
                if (err) {
                    switch (err.code)
                    {
                        case 11000: 
                            req.flash('alert-danger', 'Estes dados já existem no registro de Usuários.');    
                            break;        
                        default: 
                            req.flash('alert-danger', "Erro ao exibir:"+ err);  
                            break;
                    }   
                } else {                     
                    AccountType
                    .find().exec(function(err, acctp){
                      if (err) {                   
                          req.flash('alert-danger', "Erro ao Exibir:"+ err);                            
                        } else {  
                            req.flash('alert-info', 'Dados salvos com sucesso!'); 
                            res.render('users/show', {accounts: actuser, acctypes: acctp});
                        };
                    });   
                }
            });
    } else {    
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
    }
  }    

accountController.edit = function(req, res){ 
  Account.findOne({_id: req.params.id}).exec(function (err, accuser) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de Usuários.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          };   
        } else {    
            AccountType
              .find().exec(function(err, acctp){
                if (err) {                   
                    req.flash('alert-danger', "Erro ao editar:"+ err);                            
                  } else {  
                    res.render('users/edit', {uaccount: accuser, acctypes: acctp});
                  };
              });                
        };
      });
  };

accountController.update = function(req, res){  
    
    var moduser;
    if (req.user){
        moduser = req.user.username;
    }

    Account.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                username: req.body.username, 
                email: req.body.email, 
                password: req.body.password,
                accountType: req.body.accountType,
                gender: req.body.gender,                
                active: req.body.active,
                modifiedBy: moduser
              }
          }, 
          { new: true }, 
   function (err, uacc) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de Usuários.');    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err);  
                 break;
          }             
          AccountType
            .find().exec(function(err, acctp){
                if (err) {                   
                    req.flash('alert-danger', "Erro ao atualizar:"+ err);                            
                } else {  
                    res.render('users/edit', {uaccount: req.body, acctypes: acctp});
                };
            });  
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!');         
          res.redirect("/users/show/"+uacc._id);
        };
      });
  };

accountController.save  =   function(req, res){    
    var ulogin =  '';
  
    if (req.user){    
      ulogin =  req.user.userid;
    }
  
    var user = new Account({ 
      username: req.body.username, 
      email: req.body.email, 
      accountType: req.body.accountType,      
      gender: req.body.gender,
      active: req.body.active,
      modifiedBy: ulogin
    })      
    console.log('User to save:'+ JSON.stringify(user));
    Account.register(user, req.body.password, function(err, user) {      
      if(err) {  
          console.log('Error no save:'+ err);
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de usuários.');    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err);  
               break;
        }           
        AccountType
        .find().exec(function(err, acctp){
          if (err) {                   
              req.flash('alert-danger', "Erro ao editar:"+ err);                            
            } else {  
              res.render('users/edit', {uaccount: req.body, acctypes: acctp});
            };
        });  
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!');  
        res.redirect('/users/show/'+user._id);
      };
     });
  };

accountController.delete = function(req, res){        
    Account.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de Usuários.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/users");
        }
      });
  };

accountController.export2excel = function(req, res) {   
        
    Account
        .find()       
        .exec(function(err, uaccc){     
            Account.count().exec(function(err, count){                    
                if(count)    {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment; filename="usuários.xlsx"',
                        'Transfer-Encoding': 'chunked',
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      });
                    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
                    var worksheet = workbook.addWorksheet('lista');
                    worksheet.columns = [
                        { header: 'Código', key: 'userid', width: 10 },
                        { header: 'Usuário', key: 'username', width: 32 },
                        { header: 'Email', key: 'email', width: 15 },
                        { header: 'Tipo', key: 'accountType', width: 22},
                        { header: 'Ativo', key: 'active', width: 10}
                    ];                                        
                    for(i=0;i < count; i++){
                        var codfor = uaccc[i].userid;
                        var desfor = uaccc[i].username;
                        var cdpais = uaccc[i].email;
                        var contac = uaccc[i].accountType;
                        var ativo = uaccc[i].active;
                       
                        worksheet.addRow([codfor, desfor,cdpais,contac,ativo]).commit();
                    }                    
                    worksheet.commit();
                    workbook.commit();
                 } else {
                    req.flash('alert-danger', "Sem dados para exportar ao Excel."); 
                    res.redirect("/users");
                 };  
                }); 
            });               
  }  

module.exports = accountController;