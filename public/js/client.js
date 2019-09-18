// SECTIONS:
// 1. DOCUMENT.READY() - THIS IS EVERYTHING THAT NEEDS TO LOAD AFTER THE DOCUMENT IS LOADED.
// 2. FUNCTIONS TO SUPPORT ALL CLIENT FILES

// ***************** SECTION 1 - DOCUMENT.READY() ***********************
$(document).ready(function ()
{
  var fileName = location.pathname.split("/").slice(-1).toString();

  if (fileName === "destination.html")
  {
    if (localStorage.getItem("fareResults"))
    {
      // *************** SARAH - THIS IS FOR YOU  ************** //

      var resultsJson = JSON.parse(localStorage.getItem("fareResults"));
      $("#results").text(resultsJson[0].destination);
      console.log(resultsJson);
    }
  }
  else
  {
    var today = moment().format('YYYY-MM-DD');
    $("#from").val(today);
    $("#to").val(today);

    $.get("/activities", function (data)
    {
      if (data)
      {
        var activities = data.Themes;
        var activityDropdown = $("#activity");

        for (activity in activities)
        {
          var option = $("<option>");
          var activityVal = activities[activity].Theme.toLowerCase();
          var activityStr = activityVal;

          option.text(titleCase(activityStr.replace("-", " ")));
          option.attr("value", activityVal);
          activityDropdown.append(option);
        }
      }
    })
      .catch(function (err)
      {
        console.log(err);
      });
  }

  $("#clientInput").submit(function ()
  {
    event.preventDefault();

    var temp = $("#clientInput").serializeArray();
    var storage = [];
    var tempobj = {};
    var name = "";
    for (input in temp)
    {
        name = temp[input].name;
        tempobj = { [name]:  temp[input].value };
        storage.push(tempobj);
    }
    localStorage.setItem("clientInput", JSON.stringify(storage));

    $.post("/api/destination", $("#clientInput").serialize())
      .then(function (data)
      {
        if (data)
        {
          localStorage.setItem("fareResults", JSON.stringify(data));
          location.assign("destination.html");
        }
      })
      .catch(function (err)
      {
        console.log(err);
      });
  });

  // GET CHART DATA FOR THE MODAL
  $(".chart").click(function ()
  {

    var clientInput = localStorage.getItem("clientInput");
    var destination = $(this).data('city');
    console.log(destination);
    $.post("/api/trends", clientInput)
      .then(function (data)
      {
        if (data)
        {
          console.log("VIKTORIYA'S DATA");
          console.log(data); // VICTORIA - THIS IS WHAT YOU NEED (data object)
          makeChart(data);
        }
      })
      .catch(function (err)
      {
        console.log(err);
      });
  });

  function titleCase(str)
  {
    return str.toLowerCase().replace(/(^|\s)\S/g, function (t)
    {
      return t.toUpperCase();
    });
  }
});

// ***************** SECTION 2 - FUNCTIONS TO SUPPORT CLIENT FILES ***************
function makeChart(data)
{
  localStorage.setItem("chartData", JSON.stringify(data));
  // var chart=$(`<div id="curve_chart" style="width: 1000px; height: 30px">${drawChart()}</div>`);
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
}

function drawChart()
{
  var chartData = JSON.parse(localStorage.getItem("chartData"));
  chartData = chartData.historical;
  console.log("FOR GOOGLE");
  console.log(chartData.historical);
  var data = google.visualization.arrayToDataTable(chartData);

  var options =
    {
      title: "Airfare Trend for the next 2 months",
      curveType: "function",
      legend: { position: "bottom" }
    };

  var chart = new google.visualization.LineChart(document.getElementById("curve_chart"));

  chart.draw(data, options);
}
