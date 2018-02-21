$(function() {
    $('#page2xls').hide();
    // var DateField = function(config) {
    //     jsGrid.Field.call(this, config);
    // };
    
    // DateField.prototype = new jsGrid.Field({
    //     sorter: function(date1, date2) {
    //         return new Date(date1) - new Date(date2);
    //     },    
    
    //     itemTemplate: function(value) {
    //         return new Date(value).toDateString();
    //     },
    
    //     filterTemplate: function() {
    //         var now = new Date();
    //         this._fromPicker = $("<input>").datepicker({ defaultDate: now.setFullYear(now.getFullYear() - 1) });
    //         this._toPicker = $("<input>").datepicker({ defaultDate: now.setFullYear(now.getFullYear() + 1) });
    //         return $("<div>").append(this._fromPicker).append(this._toPicker);
    //     },
    
    //     insertTemplate: function(value) {
    //         return this._insertPicker = $("<input>").datepicker({ defaultDate: new Date() });
    //     },
    
    //     editTemplate: function(value) {
    //         return this._editPicker = $("<input>").datepicker().datepicker("setDate", new Date(value));
    //     },
    
    //     insertValue: function() {
    //         return this._insertPicker.datepicker("getDate").toISOString();
    //     },
    
    //     editValue: function() {
    //         return this._editPicker.datepicker("getDate").toISOString();
    //     },
    
    //     filterValue: function() {
    //         return {
    //             from: this._fromPicker.datepicker("getDate"),
    //             to: this._toPicker.datepicker("getDate")
    //         };
    //     }
    // });
    
    // jsGrid.fields.date = DateField;


    $("#jsGrid").jsGrid({
        height: "400px",
        width: "100%",
        filtering: true,
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 7,
        pageButtonCount: 5,
        loadIndication: true,
        loadIndicationDelay: 500,
        loadMessage: "Por favor, aguarde...",
        loadShading: true,
        noDataContent: "Sem registros",
        deleteConfirm: "Realmente deseja deletar esta operação?",
        pagerFormat: "Páginas: {first} {prev} {pages} {next} {last}    {pageIndex} de {pageCount}",
        pagePrevText: "Anterior",
        pageNextText: "Próxima",
        pageFirstText: "Primeira",
        pageLastText: "Útima",
        pageNavigatorNextText: "...",
        pageNavigatorPrevText: "...",
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: "/report/operations",
                    data: filter
                  });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: "PUT",
                    url: "/report/operations",
                    data: item
                });
            },
            deleteItem: function(item) {
                return $.ajax({
                    type: "DELETE",
                    url: "/report/operations",
                    data: item
                });
            }
        },
        fields: [
            { name: "dtso", title: "Mês. Pedido", type: "text", width: 75 },
            { name: "description",title: "Medidas", type: "text", width: 150 },
            { name: "invoice",title: "Invoice", type: "text", width: 100 },
            { name: "cntr",title: "Conteiner", type: "text", width: 100 },
            { name: "dtinvoice",title: "Data", type: "text", width: 75 },
            { name: "dtdeparture",title: "Saída ", type: "text", width: 75 },
            { name: "dtarrival",title: "Chegada", type: "text", width: 75 },
            { name: "dtdemurrage",title: "Demurrage", type: "text", width: 95 },
            { name: "suppliername",title: "EXPORT", type: "text", width: 200 },
            { name: "customername",title: "Cliente", type: "text", width: 200 },
            { name: "statusname",title: "Status", type: "text", width: 225 },
            { 
                type: "control",
                editButton: false,
                deleteButton: false,
                headerTemplate: function() {
                    return $("<a>").attr("type", "button").text("Excel").addClass("btn btn-success btn-sm").attr('href','/report/exportxls');                       
                }
            }
        ]
    }); 

    $("#jsGrid").jsGrid("option", "height", 600);
  });