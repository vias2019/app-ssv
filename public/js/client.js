$(document).ready(function ()
{
  // var today = new Date();
  // document.getElementById("from").value=today.toLocaleDateString('en-CA');


  var fileName = location.pathname.split("/").slice(-1).toString();

  if (fileName === "destination.html")
  {
    if (localStorage.getItem("fareResults"))
    {
      // *************** SARAH - THIS IS FOR YOU  ************** //
      $("#results").text(localStorage.getItem("fareResults"));
      var resultsJson = JSON.parse(localStorage.getItem("fareResults"));
      console.log(resultsJson);

      //Below is Sarah's code: //

      // the function creatList() should be called when the submit button on the homepage is clicked 
      
      function createList(){
          
           // List the destination airports based on the chosen theme. If more than 5, just limit to 5. 
             var m;

             if(resultsJson.length <= 5){
                m=resultsJson.length;
               }else{
                m=5;
             }
  
             for(var i=0; i<m; i++){
                var listClass =$("<li class='list-group-item'>");
  
                var buttonClass = $('<button data-target="#myModal" data-toggle="modal" type="button" class="btn btn-info chart" data-city = '+ resultsJson[i].destination + "'>");

                var listContent = resultsJson[i].destination + resultsJson[i].airfare;
                
                listClass.append(listContent);
                
                listClass.append(buttonClass);
  
                $(".list-group").append(listClass);
              }
            }

          
      //'button' here is the buttons dynamically created on the destination.html 
          $('button').on('click',function(){
            var airport = $(this).data('city');
            //call the airfare trend chart of the airport: //
            drawChart(airport);
        
          });
    
      // Above is Sarah's code//
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


