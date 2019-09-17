//See the trend button
//var mysql =require("../../env");
$(document).ready(){
  // GET CHART DATA FOR THE MODAL
  $(".chart").click(function ()
  {
    var clientInput = localStorage.getItem("clientInput");
    $.post("/api/trends", clientInput)
      .then(function (data)
      {
        if (data)
        {
          console.log(data); // VICTORIA - THIS IS WHAT YOU NEED (data object)

          var result = ['Date', 'Airfare'];

          for(var i in data.historical)
              result.push([i, data.historical[i]]);
console.log("CHART DATA FOR VIK");
              console.log(result);

          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Topping');
          data.addColumn('number', 'Slices');
          data.addRows(result);
        }
      })
      .catch(function (err)
      {
        console.log(err);
      });
  });
}


$("#button1").click(function () {

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  // Send the GET request.
 // $.get("/api/chart", function (search) {
 //   console.log("Got search:", search);
 var search=['Date', "Airfare"];
function searchData() {
  console.log("Selecting data..");
  connection.query("SELECT * from chart where date between '"+departureDate+"' and '"+ returnDate + "' and originCity ='"+originalLocation +"' and destinationCity ='"+destinationLocation + "';", function(err, res) {
    if (err) {throw err;}
    // Log all results of the SELECT statement
    console.log(res);
    for (var i=0; i<res.length; i++)
    {
      var tempArray=[];
      tempArray.push(res[i].date);
      tempArray.push(res[i].airfare);
      search.push(tempArray);
    }

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