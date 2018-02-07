$(function() {
    jsGrid.locale("pt-BR");
    $("#jsGrid").jsGrid({
        height: "70%",
        width: "100%",
        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 10,
        pageButtonCount: 5,
        deleteConfirm: "Realmente deseja deletar esta operação?",
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: "/report/operations",
                    data: filter
                  }).then(function(result) {
                      return result.data;
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
            { name: "dtsalesorder", title: "Mês. Pedido", type: "text", width: 75 },
            { name: "description",title: "Medidas", type: "text", width: 250 },
            { name: "invoice",title: "Invoice", type: "text", width: 75 },
            { name: "cntr",title: "Conteiner", type: "text", width: 100 },
            { name: "dtinvoice",title: "Data", type: "text", width: 75 },
            { name: "dtdeparture",title: "Saída ", type: "text", width: 75 },
            { name: "dtarrival",title: "Chegada", type: "text", width: 75 },
            { name: "dtdemurrage",title: "Demurrage", type: "text", width: 75 },
            { name: "supplier",title: "EXPORT", type: "text", width: 75 },
            { name: "customer",title: "Cliente", type: "text", width: 75 },
            { name: "status",title: "Status", type: "text", width: 100 },            
            { type: "control" }
        ]
    }); 
  });