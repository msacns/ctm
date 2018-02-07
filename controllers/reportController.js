var mongoose        = require('mongoose');
var passport        = require('passport');
var Operation       = require('../models/Operations');
var Customer        = require('../models/Customers');
var Supplier        = require('../models/Suppliers');
var Status          = require('../models/Status');
/*
ExcelJS
*/
var Excel           = require('exceljs');
/******************************************************** */
/* GridJS Datastore */
var Datastore       = require('nedb');
var db              = new Datastore();

var getOperationFilter = function(query) {
    // var result = {
    //     dtsalesorder: new RegExp(query.dtsalesorder, "i"),
    //     description: new RegExp(query.description, "i"),
    //     invoice: new RegExp(query.invoice, "i"),
    //     cntr: new RegExp(query.cntr, "i"),
    //     dtinvoice: new RegExp(query.dtinvoice, "i"),
    //     dtdeparture: new RegExp(query.dtdeparture, "i"),
    //     dtarrival: new RegExp(query.dtarrival, "i"),
    //     dtdemurrage: new RegExp(query.dtdemurrage, "i"),
    //     supplier: new RegExp(query.supplier, "i"),
    //     customer: new RegExp(query.customer, "i"),
    //     status: new RegExp(query.status, "i")
    // };

    // if(query.Married) {
    //     result.Married = query.Married === 'true' ? true : false;
    // }

    // if(query.Country && query.Country !== '0') {
    //     result.Country = parseInt(query.Country, 10);
    // }

    return result;
};

var reportController = {}

reportController.operationsshow = function(req, res) {        
    res.render('operations/report',  { title: 'CTM [v1.0.0] - Operações'});
  };

reportController.operationslist = function(req, res){       
    Operation.find({}, function(err, items) {
        if(err){
            console.log('Erro on load grid:' + err);
        } else {
            // console.log(JSON.stringify(items));
            res.json(items);
        };
    });
  }; 
 
reportController.show = function(req, res){ 
  if (req.params.id != null || req.params.id != undefined) {      
    Operation.findOne({_id: req.params.id}) 
    .populate({
        path:'supplier', 
        select:'description',            
        match:{ active: true },
        options: { sort: { $natural: -1 }}
      })            
    .populate({
        path:'customer', 
        select:'description',
        match:{ active: true },
        options: { sort: { $natural: -1 }}
      })  
    .populate({
        path:'status', 
        select:'description',
        match:{ active: true },
        options: { sort: { $natural: -1 }}
      })    
    .exec(function (err, opers) {            
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
                    res.render('operations/show', {operations: opers});
                }
            });
    } else {    
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
    }
  }    

 reportController.edit = function(req, res){    
  Operation.findOne({_id: req.params.id}).exec(function (err, opers) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de Operações.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {  
            Supplier
            .find({active:true})
            .exec(function(err, suppl){
                if (err) {
                    req.flash('alert-danger', "Erro ao listar fornecedores :"+ err);  
                }else{
                    Customer
                    .find({active:true})
                        .exec(function(err, custm){
                            if (err) {
                                req.flash('alert-danger', "Erro ao listar clientes:"+ err);  
                            }else{
                                Status  
                                    .find({active:true})
                                    .exec(function(err, sts){
                                        if (err) {
                                            req.flash('alert-danger', "Erro ao listar clientes:"+ err);  
                                        }else{ 
                                            res.render('operations/edit', { title: 'CTM [v1.0.0]', suppliers: suppl, customers:custm, statuss:sts, operations: opers });                                                          
                                        }
                                    });   
                            }
                        }); 
                }
            });                             
        };
      });
  }

 reportController.update = function(req, res){   
    var moduser;
    if (req.user){
        moduser = req.user.username;
    }

    Operation.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                operation: req.body.operation, 
                description: req.body.description, 
                invoice: req.body.invoice,
                cntr: req.body.cntr,
                dtinvoice: req.body.dtinvoice,
                dtdeparture: req.body.dtdeparture,
                dtarrival: req.body.dtarrival,
                dtdemurrage: req.body.dtdemurrage,
                dtsalesorder: req.body.dtsalesorder,
                supplier: req.body.supplier,
                customer: req.body.customer,
                status: req.body.status,
                importdeclation: req.body.importdeclation,
                active: req.body.active
              }
          }, 
          { new: true }, 
   function (err, operations) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de Operações.');    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err);  
                 break;
          }   
          Supplier
          .find({active:true})
          .exec(function(err, suppl){
              if (err) {
                  req.flash('alert-danger', "Erro ao listar fornecedores :"+ err);  
              }else{
                  Customer
                  .find({active:true})
                      .exec(function(err, custm){
                          if (err) {
                              req.flash('alert-danger', "Erro ao listar clientes:"+ err);  
                          }else{
                              Status  
                                  .find({active:true})
                                  .exec(function(err, sts){
                                      if (err) {
                                          req.flash('alert-danger', "Erro ao listar clientes:"+ err);  
                                      }else{ 
                                          res.render('operations/edit', { title: 'CTM [v1.0.0]', suppliers: suppl, customers:custm, statuss:sts, operations: req.body });                                                          
                                      }
                                  });   
                          }
                      }); 
              }
          }); 
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!');         
          res.redirect("/operations/show/"+operations._id);
        }
      })
  }  

 reportController.save  =   function(req, res){    
    var payload = req.body;    
    if(req.user) {                 
      payload.modifiedBy = req.user.username;
    }  
    
    var operats = new Operation(payload);     
    operats.save(function(err) {
      if(err) {            
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de operações.');    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err); 
               break;
        }      
        res.redirect('/operations/show/'+operats._id);  
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!'); 
        res.redirect('/operations/show/'+operats._id);
      }
    });
  };

 reportController.delete = function(req, res){        
    Operation.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de operações.');   
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/operations");
        }
      });
  };

reportController.export2excel = function(req, res) {     
    
    Operation
        .find()    
        .populate({
            path:'supplier', 
            select:'description',            
            match:{ active: true },
            options: { sort: { $natural: -1 }}
          })            
        .populate({
            path:'customer', 
            select:'description',
            match:{ active: true },
            options: { sort: { $natural: -1 }}
          })  
        .populate({
            path:'status', 
            select:'description',
            match:{ active: true },
            options: { sort: { $natural: -1 }}
          })   
        .exec(function(err, Operations){     
            Operation.count().exec(function(err, count){                    
                if(count)    {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment; filename="operações.xlsx"',
                        'Transfer-Encoding': 'chunked',
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      });
                    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
                    var worksheet = workbook.addWorksheet('lista');
                    worksheet.columns = [
                        { header: 'Código', key: 'id', width: 10 },
                        { header: 'Operação', key: 'description', width: 32 },
                        { header: 'Invoice', key: 'invoice', width: 15 },
                        { header: 'Container', key: 'cntr', width: 15 },
                        { header: 'Dt. invoice', key: 'dtinvoice', width: 22 },
                        { header: 'Dt. Saída', key: 'dtdeparture', width: 22},
                        { header: 'Dt. Chegada', key: 'dtarrival', width: 22},
                        { header: 'Dt. Demurrage', key: 'dtdemurrage', width: 22},
                        { header: 'Dt. PV', key: 'dtsalesorder', width: 22},
                        { header: 'Fornecedor', key: 'supplier', width: 22},
                        { header: 'Cliente', key: 'customer', width: 22},
                        { header: 'Status', key: 'status', width: 22},
                        { header: 'DI', key: 'importdeclation', width: 22},
                        { header: 'Ativo', key: 'active', width: 10}
                    ];                                        
                    for(i=0;i < count; i++){
                        var c1      = Operations[i].operation;
                        var c2      = Operations[i].description;
                        var c3      = Operations[i].invoice;
                        var c4      = Operations[i].cntr;
                        var c5      = Operations[i].dtinvoice;
                        var c6      = Operations[i].dtdeparture;
                        var c7      = Operations[i].dtarrival;
                        var c8      = Operations[i].dtdemurrage;
                        var c9      = Operations[i].dtsalesorder;
                        var c10     = Operations[i].supplier.description;
                        var c11     = Operations[i].customer.description;
                        var c12     = Operations[i].status.description;
                        var c13     = Operations[i].importdeclation;
                        var c14     = Operations[i].active;                        

                        worksheet.addRow([c1, c2, c3,c4, c5, c6,c7, c8, c9,c10, c11, c12,c13, c14]).commit();
                    }                    
                    worksheet.commit();
                    workbook.commit();
                 } else {
                    req.flash('alert-danger', "Sem dados para exportar ao Excel."); 
                    res.redirect("/operations");
                 };  
                }); 
            });               
  }  

module.exports = reportController;