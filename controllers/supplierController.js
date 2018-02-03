// 'use strict';
var mongoose        = require('mongoose');
var passport        = require('passport');
var Supplier         = require('../models/Suppliers');

var supplierController = {}

/**
 * CRUD
 */ 
 supplierController.list = function(req, res) {   
    // var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Supplier
        .find()       
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, suppliers){     
            Supplier.count().exec(function(err, count){   
                    res.render('suppliers/index',
                    { title: 'CTM [v1.0.0] - Fornecedores', 
                        list: suppliers,
                        user_info: req.user,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                }); 
            });               
  }

 supplierController.create = function(req, res){         
    // var baseurl = req.protocol + "://" + req.get('host') + "/"     
    
    Supplier
    .find({active: true}).exec(function(err, suppliers){
      if (err) {
        switch (err.code)
        {
          case 11000: 
              req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
              break;        
          default: 
              req.flash('alert-danger', "Erro ao carregar os fornecedores:"+ err)  
              break;
        }   
      }else{                                           
            res.render('suppliers/new', { title: 'CTM [v1.0.0] | Novo Fornecedor' });              
      }
    }); 


  } 
 
supplierController.show = function(req, res){ 
//   var baseurl = req.protocol + "://" + req.get('host') + "/" 
  if (req.params.id != null || req.params.id != undefined) {      
    Supplier.findOne({_id: req.params.id})  
        .exec(function (err, suppliers) {            
                if (err) {
                    switch (err.code)
                    {
                        case 11000: 
                            req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
                            break;        
                        default: 
                            req.flash('alert-danger', "Erro ao exibir:"+ err)  
                            break;
                    }   
                } else {                         
                    req.flash('alert-info', 'Dados salvos com sucesso!')  
                    res.render('suppliers/show', {suppl: suppliers});
                }
            });
    } else {    
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
    }
  }    

 supplierController.edit = function(req, res){ 
//   var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Supplier.findOne({_id: req.params.id}).exec(function (err, suppl) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {          
          res.render('suppliers/edit', {suppliers: suppl});
        }
      })
  }

 supplierController.update = function(req, res){  
    // var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var moduser;
    if (req.user){
        moduser = req.user.username;
    }

    Supplier.findByIdAndUpdate(
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
   function (err, suppl) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.');    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err);  
                 break;
          }   
          res.render("suppliers/edit", {vehicles: req.body, baseuri:baseurl});
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!');         
          res.redirect("/suppliers/show/"+suppl._id);
        }
      })
  }  

 supplierController.save  =   function(req, res){
    // var baseurl = req.protocol + "://" + req.get('host') + "/";
    var payload = req.body;    
    if(req.user) {                 
      payload.modifiedBy = req.user.username;
    }  
    
    var supplier = new Supplier(payload);     
    supplier.save(function(err) {
      if(err) {            
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err)  
               break;
        }        
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/suppliers/show/'+supplier._id)
      }
    });
  };

 supplierController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Supplier.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/suppliers");
        }
      });
  };


module.exports = supplierController;