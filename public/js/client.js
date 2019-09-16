$(document).ready(function ()
{

  var fileName = location.pathname.split("/").slice(-1).toString();

  if (fileName === "destination.html")
  {
    if (localStorage.getItem("fareResults"))
    {
      // *************** SARAH - THIS IS FOR YOU  ************** //
      $("#results").text(localStorage.getItem("fareResults"));
      var resultsJson = JSON.parse(localStorage.getItem("fareResults"));
      console.log(resultsJson);
    }
  }
  else
  {
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

  $(".chart").click(function ()
  {
    var clientInput = localStorage.getItem("clientInput");
    $.post("/api/trends", clientInput)
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

    $.post("/api/trends", clientInput).then(function (data)
    {
      if (data)
      {
        //store results to DB, updating where necessary
        console.log("data");
      }
    });
  });

  $("#button1").click(function ()
  {
    // var chart=$(`<div id="curve_chart" style="width: 1000px; height: 30px">${drawChart()}</div>`);
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
    //ajax call
    function drawChart()
    {
      var data = google.visualization.arrayToDataTable([
        //mysql
        ["Days", "Price"],
        ["2004", 1000],
        ["2005", 1170],
        ["2006", 660],
        ["2007", 1030]
      ]);

      var options =
            {
              title: "Airfare Trend for the next 2 months",
              curveType: "function",
              legend: { position: "bottom" }
            };

      var chart = new google.visualization.LineChart(document.getElementById("curve_chart"));

      chart.draw(data, options);
    }
  });

  function titleCase(str)
  {
    return str.toLowerCase().replace(/(^|\s)\S/g, function (t)
    {
      return t.toUpperCase();
    });
  }
});

$("#button1").click(function() {
  // var chart=$(`<div id="curve_chart" style="width: 1000px; height: 30px">${drawChart()}</div>`);
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  //ajax call
  function drawChart() {
    var data = google.visualization.arrayToDataTable([
    //mysql
      ["Days", "Price"],
      ["2004", 1000],
      ["2005", 1170],
      ["2006", 660],
      ["2007", 1030]
    ]);

    var options = {
      title: "Airfare Trend for the next 2 months",
      curveType: "function",
      legend: { position: "bottom" }
    };

    var chart = new google.visualization.LineChart(
      document.getElementById("curve_chart")
    );

    chart.draw(data, options);
  }
  
});

  