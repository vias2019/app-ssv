//See the trend button



google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    //mysql
    ["Year", "Sales", "Expenses"],
    ["2004", 1000, 400],
    ["2005", 1170, 460],
    ["2006", 660, 1120],
    ["2007", 1030, 540]
  ]);

  var options = {
    title: "Airfare Trend for last 12 months",
    curveType: "function",
    legend: { position: "bottom" }
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("curve_chart")
  );

  chart.draw(data, options);
}
<<<<<<< HEAD

module.exports = chart;

=======
>>>>>>> 089b225... latest version of apis
