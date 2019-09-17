//See the trend button
//var mysql =require("../../env");


$("#button1").click(function (){

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  
   // Send the GET request.
   $.get("/api/chart", function (search) {
    console.log("Got search:", search);
    
  var data = google.visualization.arrayToDataTable(search);
    // var data = google.visualization.arrayToDataTable([
    //   //mysql
    //   ["Year", "Sales"],
    //   ["2004", 1000],
    //   ["2005", 1170],
    //   ["2006", 660],
    //   ["2007", 1030]
    // ]);
  
    var options = {
      title: "Airfare Trend for last 12 months",
      curveType: "function",
      legend: { position: "bottom" }
    };
  
    var chart = new google.visualization.LineChart(
      document.getElementById("curve_chart")
    );
  
    chart.draw(data, options);
  });
  });