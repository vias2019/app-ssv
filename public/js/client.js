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

      var fareResults = JSON.parse(localStorage.getItem("fareResults"));
      createList(fareResults);
    }
  }
  else
  {
    var fromDate = moment().add(1, 'day');
    $("#from").val(fromDate.format('YYYY-MM-DD'));

    var toDate = moment().add(5, 'day');
    $("#to").val(toDate.format('YYYY-MM-DD'));

    $("#autocomplete").val("SEA");

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

    var storage = [];
    storage.push({activity: $("#activity :selected").val()});
    storage.push({from: $("#from").val()});
    storage.push({to: $("#to").val()});
    storage.push({departure: $("#autocomplete").val()});

    localStorage.setItem("clientInput", JSON.stringify(storage));

    var clientInput = $("#clientInput").serialize();
    localStorage.setItem("queryString", clientInput);
    $.post("/api/destination", clientInput)
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
    var origin = JSON.parse(localStorage.getItem("clientInput"))[3].departure;
    var destination = $(this).data('city');
    var queryString = localStorage.getItem("queryString");
    queryString = queryString + "&destination=" + destination;

    $(".modal-title").text(origin + "-" + destination + " Airfare Trend for the Past 2 Weeks");

    $.post("/api/trends", queryString)
      .then(function (data)
      {
        if (data)
        {
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

  function createList(fareResults){

    var theme = JSON.parse(localStorage.getItem("clientInput"));
    $(".lead").html("Suggested destinations based on the activity - " + titleCase(theme[0].activity) + ":");

console.log(fareResults);
    // List the destination airports based on the chosen theme. If more than 5, just limit to 5.
    var m = 5;
    if(fareResults.length <= 5){
      m=fareResults.length;
    }

    for(var i=0; i<m; i++){
      var des = fareResults[i].destination;
      var fare = parseInt(fareResults[i].fare);
      var recommendation = "Unknown";
      var trend = "";
      if (fareResults[i].forecast)
      {
        trend = fareResults[i].forecast.trend;
        recommendation = fareResults[i].forecast.recommendation;
      }
      var trendImg = "";
      switch(trend)
      {
          case "Increase":
              trendImg = "/images/increasing.png";
              break;
          case "Decrease":
              trendImg = "/images/decreasing.png";
              break;
          case "Stay":
              trendImg = "/images/right.png";
              break;
          default:
              trendImg = "/images/question.png";
      }

      var listClass =$('<div class="row justify-content-center mt-2 p-1 font-weight-bold border border-white rounded" style = "background-color:lightblue;" >');

      var desClass = $('<div class="col-5 my-auto">' + des + '</div>');

      var fareClass = $('<div class="col-1 my-auto">$' + fare + '</div>');

      var forecastClass = $('<div class="col-2 my-auto p-0">' + recommendation + '&nbsp;<img class="img-fluid" src="' + trendImg + '" style="width: 30%"></div>');

      var buttonClass = $('<div class="col-3 my-auto"><button data-target="#myModal" data-toggle="modal" type="button" class="btn btn-info chart font-weight-bold" data-city = "'+ fareResults[i].destinationCode + '">See Fare History</button></div>');

      listClass.append(desClass);
      listClass.append(fareClass);
      listClass.append(forecastClass);
      listClass.append(buttonClass);

      $("#des-row").append(listClass);

    }
  }
});

// ***************** SECTION 2 - FUNCTIONS TO SUPPORT CLIENT FILES ***************
function makeChart(data)
{
  localStorage.setItem("chartData", JSON.stringify(data));
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
}

function drawChart()
{
  var chartData = JSON.parse(localStorage.getItem("chartData"));
  var data = google.visualization.arrayToDataTable(chartData);

  var options =
    {
      curveType: "function",
      pointSize: 5,
      legend: {position: "top"},
      vAxis: {gridlines: {count: 10}},
      hAxis: {title: "Date", slantedText: true, slantedTextAngle: 50, format: 'long'}
    };

  var chart = new google.visualization.LineChart(document.getElementById("curve_chart"));

  chart.draw(data, options);
}
