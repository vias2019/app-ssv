$(document).ready(function () {
    // Send the GET request.
    $.get("/api/alldestinations", function (cities) {
        console.log("Got cities:", cities);
        cities.sort();
        for (var i = 0; i < cities.length; i++) {
            var addCity = $("<option>");
            addCity.text(cities[i]);
            $("#destination").append(addCity);
        }
    });
});