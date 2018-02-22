$(function() {    
      $.ajax({
        type: "GET",
        url: "/dashboard/timeline",
        dataType: "json",
        contentType: "application/json; charset=UTF-8" 
      }).done(function ( data ) {  
        console.log(data);
        // hide the "loading..." message
        document.getElementById('loading').style.display = 'none';
      
        // DOM element where the Timeline will be attached
        var container = document.getElementById('visualization');

        // Create a DataSet (allows two way data-binding)
        var items = new vis.DataSet(data);

        // Configuration for the Timeline
        var options = {
            locales:{
                ctmlocale:{
                    January:'Janeiro',
                    February:'Fevereiro',
                    March: 'Março',
                    April: 'Abril',
                    May:'Maio',
                    June:'Junho',
                    July:'Julho',
                    August:'Agosto',
                    September:'Setembro',
                    October:'Outubro',
                    November:'Novembro',
                    December:'Dezembro',
                    current:'atual',
                    time:'hora'
                }
            },
            locale: 'ctmlocale'
        };

        var groups = [
            {
                id: 'TCU099807896',
                content: 'TCU099807896'
            },
            {
                id: 'TCU099807897',
                content: 'TCU099807897'
            },
            {
                id: 'TCU099807899',
                content: 'TCU099807899'
            }
        ];

        // Create a Timeline
        var timeline = new vis.Timeline(container, items, groups, options);  
      });    
});