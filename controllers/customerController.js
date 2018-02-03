// 'use strict';
var mongoose        = require('mongoose');
var passport        = require('passport');
var Customer        = require('../models/Customers');
var Countries       = require('../models/Countries');
/*
ExcelJS
*/
var Excel           = require('exceljs');
// var workbook        = new Excel.Workbook();
/******************************************************** */


var customerController = {}

/**
 * CRUD
 */ 
 customerController.list = function(req, res) {   
    // var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Customer
        .find()       
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, customers){     
            Customer.count().exec(function(err, count){   
                    res.render('customers/index',
                    { title: 'CTM [v1.0.0] - Clientes', 
                        list: customers,
                        user_info: req.user,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                }); 
            });               
  }

 customerController.create = function(req, res){   
    try {
        Countries
            .find()
            .exec(function(err, country){
                res.render('customers/new', { title: 'CTM [v1.0.0] - Novo Cliente', countries: country });              
        }); 
        
    } catch ( err ) {
        console.log('Error on load json:'+ err);
        // req.flash('alert-danger', "Erro ao exibir:"+ err) 
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!Detalhe do erro:'+err});    
    };

  }; 
 
customerController.show = function(req, res){ 
//   var baseurl = req.protocol + "://" + req.get('host') + "/" 
  if (req.params.id != null || req.params.id != undefined) {      
    Customer.findOne({_id: req.params.id})  
        .exec(function (err, customers) {            
                if (err) {
                    switch (err.code)
                    {
                        case 11000: 
                            req.flash('alert-danger', 'Estes dados já existem no registro de clientes.')    
                            break;        
                        default: 
                            req.flash('alert-danger', "Erro ao exibir:"+ err)  
                            break;
                    }   
                } else {                         
                    req.flash('alert-info', 'Dados salvos com sucesso!')  
                    res.render('customers/show', {clients: customers});
                }
            });
    } else {    
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
    }
  }    

 customerController.edit = function(req, res){ 
//   var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Customer.findOne({_id: req.params.id}).exec(function (err, customers) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de clientes.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {    
            Countries
              .find().exec(function(err, country){
                res.render('suppliers/edit', {clients: customers, countries: country});
              });                
        };
      });
  }

 customerController.update = function(req, res){  
    // var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var moduser;
    if (req.user){
        moduser = req.user.username;
    }

    Customer.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                supplier: req.body.supplier, 
                description: req.body.description, 
                country: req.body.country,
                contact: req.body.contact,
                active: req.body.active,
                modifiedBy: moduser
              }
          }, 
          { new: true }, 
   function (err, customers) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de clientes.');    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err);  
                 break;
          }   
          res.render("customers/edit", {clients: req.body, baseuri:baseurl});
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!');         
          res.redirect("/customers/show/"+suppl._id);
        }
      })
  }  

 customerController.save  =   function(req, res){
    // var baseurl = req.protocol + "://" + req.get('host') + "/";
    var payload = req.body;    
    if(req.user) {                 
      payload.modifiedBy = req.user.username;
    }  
    
    var clients = new Customer(payload);     
    clients.save(function(err) {
      if(err) {            
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de clientes.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err)  
               break;
        }        
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/customers/show/'+clients._id)
      }
    });
  };

 customerController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Customer.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de clientes.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/customers");
        }
      });
  };

customerController.export2excel = function(req, res) {   
    // var baseurl = req.protocol + "://" + req.get('host') + "/"    
    
    Customer
        .find()       
        .exec(function(err, customers){     
            Customer.count().exec(function(err, count){                    
                if(count)    {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment; filename="fornecedores.xlsx"',
                        'Transfer-Encoding': 'chunked',
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      });
                    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
                    var worksheet = workbook.addWorksheet('lista');
                    worksheet.columns = [
                        { header: 'Código', key: 'id', width: 10 },
                        { header: 'Cliente', key: 'name', width: 32 },
                        { header: 'País', key: 'country', width: 10 },
                        { header: 'Contato', key: 'contact', width: 22},
                        { header: 'Ativo', key: 'activeflag', width: 10}
                    ];                                        
                    for(i=0;i < count; i++){
                        var codfor = suppliers[i].supplier;
                        var desfor = suppliers[i].description;
                        var cdpais = suppliers[i].country;
                        var contac = suppliers[i].contact;
                        var ativo = suppliers[i].active;
                       
                        worksheet.addRow([codfor, desfor,cdpais,contac,ativo]).commit();
                    }                    
                    worksheet.commit();
                    workbook.commit();
                 } else {
                    req.flash('alert-danger', "Sem dados para exportar ao Excel."); 
                    res.redirect("/suppliers");
                 };  
                }); 
            });               
  }  

module.exports = customerController;