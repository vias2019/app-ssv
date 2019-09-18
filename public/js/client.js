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

    var options =
    {
        formatting:
        `<div class="$(unique-result)" data-index="$(i)">$(IATA) - $(name)</div>`
    };
    AirportInput("departure", options);

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

    clientInput = $("#clientInput").serialize();
    localStorage.setItem("clientInput", clientInput);
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
    var destination = $(this).data('city');
    var clientInput = localStorage.getItem("clientInput");
    var destination = $(this).data('city');

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
  // var chart=$(`<div id="curve_chart" style="width: 1000px; height: 30px">${drawChart()}</div>`);
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart()
  {
    var data = google.visualization.arrayToDataTable(data);

    var options =
    {
      title: "Airfare Trend for the next 2 months",
      curveType: "function",
      legend: { position: "bottom" }
    };

    var chart = new google.visualization.LineChart(document.getElementById("curve_chart"));

    chart.draw(data, options);
  }
}

  


  
/* OLD CHART.JS

$("#button1").click(function () {

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  // Send the GET request.
  $.get("/api/chart", function (search) {
    console.log("Got search:", search);

    var data = google.visualization.arrayToDataTable(search);

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
*/
