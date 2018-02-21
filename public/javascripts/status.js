$(function() {

  $.ajax({
    type: "GET",
    url: "/report/pivot/customers",
    dataType: "json",
    contentType: "application/json; charset=UTF-8" 
  }).done(function ( operdata ) {  
    $("#output").pivotUI(operdata, {
      rows: ["Province"],
      cols: ["Party"],
      aggregatorName: "Integer Sum",
      vals: ["Age"],
      rendererName: "Heatmap",
      rendererOptions: {
          table: {
              clickCallback: function(e, value, filters, pivotData){
                  var names = [];
                  pivotData.forEachMatchingRecord(filters,
                      function(record){ names.push(record.Name); });
                  alert(names.join("\n"));
              }
          }
      }
    });   
  });
  
   
 });