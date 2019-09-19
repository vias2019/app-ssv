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
      //$("#results").text(resultsJson[0].destination);
      //console.log(resultsJson);
      createList();
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
        value = temp[input].value;
        tempobj = { [name]: value };
        storage.push(tempobj);
    }
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
    var queryString = localStorage.getItem("queryString");
    var destination = $(this).data('city');
    queryString = queryString + "&destination=" + destination;
    console.log("DESTINATION");
    console.log(destination);
    console.log("CLIENT INPUT");
    console.log(queryString);

    $.post("/api/trends", queryString)
      .then(function (data)
      {
        if (data)
        {
          makeChart(destination, data);
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

  function createList(){
<<<<<<< HEAD
   
      
      var theme = JSON.parse(localStorage.getItem("clientInput"));
      $(".lead").html("These are our suggested destinations based on the activity-" + theme[0].activity + ", sorted by fare price.");
         
    // List the destination airports based on the chosen theme. If more than 5, just limit to 5. 
=======
      $(".lead").html("These are our suggested destinations based on the activity-" + localStorage.getItem("clientInput") + ", sorted by fare price.");

    // List the destination airports based on the chosen theme. If more than 5, just limit to 5.
>>>>>>> master
      var m;

      if(resultsJson.length <= 5){
         m=resultsJson.length;
        }else{
         m=5;
      }

      for(var i=0; i<m; i++){
        console.log(resultsJson[i].destinationCode);
         var listClass =$('<div class="row" style = "background-color:lightblue; margin-top:10px; padding: 5px; font-weight: bold; border: 1px solid white;border-radius:5px;" >');
         

         var buttonClass = $('<div class="col-4"><button data-target="#myModal" data-toggle="modal" type="button" class="btn btn-info chart" style = "font-weight: bold" data-city = "'+ resultsJson[i].destinationCode + '"> See Fare History </button></div>');

         var des = resultsJson[i].destination;

         var fare = resultsJson[i].fare;
<<<<<<< HEAD
         
         var desClass = $('<div class="col-4">' + des + '</div>');
=======

         var desClass = $('<p style="margin-left: 10px">' + des + '</p>');

         var fareClass = $('<p style="margin-left: 10px">$' + fare + '</p>');
>>>>>>> master

         var fareClass = $('<div class="col-4">$' + fare + '</div>');

         


         listClass.append(desClass);

         listClass.append(fareClass);
<<<<<<< HEAD
         
  
         
=======

         //listClass.append(listContent);

>>>>>>> master
         listClass.append(buttonClass);

         $("#des-row").append(listClass);
        
       }
     }

<<<<<<< HEAD
     
=======
     //'button' here is the buttons dynamically created on the destination.html
    //  $('button').on('click',function(){
    //   var airport = $(this).data('city');
    //   //call the airfare trend chart of the airport: //
    //   drawChart(airport);

    // });
>>>>>>> master

});

// ***************** SECTION 2 - FUNCTIONS TO SUPPORT CLIENT FILES ***************
function makeChart(destination, data)
{
    console.log("DATA FOR CHART");
          console.log(data);
          console.log(destination);
  localStorage.setItem("chartData", JSON.stringify(data));
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
}

function drawChart()
{
  var chartData = JSON.parse(localStorage.getItem("chartData"));
  console.log("CHART DATA");
  console.log(chartData);
  chartData = chartData.historical;
  var data = google.visualization.arrayToDataTable(chartData);

  var options =
    {
      title: "Airfare Trend for the last 2 weeks",
      curveType: "function",
      legend: { position: "bottom" },
      pointSize: 5,
      vAxis: {gridlines: {count: 10}},
      hAxis: {slantedText: true, slantedTextAngle: 50, format: 'long'}    
    };

  var chart = new google.visualization.LineChart(document.getElementById("curve_chart"));

  chart.draw(data, options);
}
