$(document).ready(function() {

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
    $.get("/activities", function(data)
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
      .catch(function(err)
      {
        console.log(err);
      });
  }

  $("#clientInput").submit(function() {
    event.preventDefault();

    clientInput = $("#clientInput").serialize();
    localStorage.setItem("clientInput", clientInput);
    $.post("/api/destination", clientInput).then(function(data)
    {
      if (data)
      {
        localStorage.setItem("fareResults", JSON.stringify(data));
        location.assign("destination.html");
      }
    })
      .catch(function(err)
      {
        console.log(err);
      });
  });

  $(".chart").click(function()
  {
    var clientInput = localStorage.getItem("clientInput");
    $.post("/api/trends", clientInput).then(function(data)
    {
      if (data)
      {
        localStorage.setItem("fareResults", JSON.stringify(data));
        location.assign("destination.html");
      }
    })
      .catch(function(err)
      {
        console.log(err);
      });
  });

  function titleCase(str) {
    return str.toLowerCase().replace(/(^|\s)\S/g, function(t) {
      return t.toUpperCase();
    });
  }
});
