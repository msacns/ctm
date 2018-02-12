$(function() {
    $("#output").pivotUI(
        $.pivotUtilities.tipsData, {
          rows:  function() {
                return $.ajax({
                    type: "GET",
                    url: "/report/pivot/customers"
                  });
          },
          cols: function() {
            return $.ajax({
                type: "GET",
                url: "/report/pivot/status"
              });
          },
          vals: function() {
            return $.ajax({
                type: "GET",
                url: "/report/pivot/operations"
              });
          },
          aggregatorName: "Sum over Sum",
          rendererName: "Heatmap"
        });
  });