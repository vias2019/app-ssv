$(document).ready(function() {
  $("#clientInput").submit(function() {
    event.preventDefault();
    console.log("Handler for .click() called.");
    // var clientInput = {
    //   activity: $("#theme").val(),
    //   dateFrom: $("from").val(),
    //   dateTo: $("to").val(),
    //   departureCity: $("#departure").val()
    // };

    clientInput = $("#clientInput").serialize();

    $.post("/api/itinerary", $("#clientInput").serialize()).then(function(
      data
    ) {
      if (data) {
        console.log(data);
        //window.location.href = "http://localhost:8080/public/page2.html";
      }
    });
  });

  $.get("/activities", function(data) {
    if (data) {
      var activities = data.Themes;
      var activityDropdown = $("#activity");

      for (activity in activities) {
        var option = $("<option>");
        var activityVal = activities[activity].Theme.toLowerCase();
        var activityStr = activityVal;

        option.text(titleCase(activityStr.replace("-", " ")));
        option.attr("value", activityVal);
        activityDropdown.append(option);
      }
    }
  });

  function titleCase(str) {
    return str.toLowerCase().replace(/(^|\s)\S/g, function(t) {
      return t.toUpperCase();
    });
  }
});
