//var db = require("../models");

// Axios
var axios = require("axios");
axios.defaults.headers.common.Authorization = process.env.SABRE_TOKEN;

module.exports = function(app) {
  app.post("/api/itinerary", function(req, res) {
    var clientInput = req.body;

    // first get cities that have the selected activity
    console.log("calling for city list");
    var requestURL =
      "https://api-crt.cert.havail.sabre.com/v1/lists/supported/shop/themes/" +
      clientInput.activity;
    axios
      .get(requestURL)
      .then(function(result) {
        if (result) {
          requestURL = "https://api-crt.cert.havail.sabre.com/v1/offers/shop";
          var cities = result.data.Destinations;

          // now for each city, get fare data
          //for (city in cities)
          //{
          clientInput.destination = cities[0].Destination;
          var requestObj = getFareRequest(clientInput);
          console.log("calling for fares for: " + cities[0].Destination);
          console.log("requestObj: ");
          console.log(requestObj.OTA_AirLowFareSearchRQ);
          axios
            .post(requestURL, requestObj)
            .then(function(result) {
              console.log(
                "==========================================================="
              );
              console.log("fares: ");
              console.log(result.data);
              res.send(result.data);
            })
            .catch(function(err) {
              console.log(
                "*************************************************************"
              );
              console.log(err);
            });
          //}
        } else {
          res.send("error");
        }
      })
      .catch(function(err) {
        console.log();
        console.log(err);
      });
  });
};

function getFareRequest(clientInput) {
  var start = new Date(clientInput.from).toISOString().replace("Z", "");
  var end = new Date(clientInput.to).toISOString().replace("Z", "");
  var home = clientInput.departure;
  var destination = clientInput.destination;

  var requestObj = {
    OTA_AirLowFareSearchRQ: {
      OriginDestinationInformation: [
        {
          DepartureDateTime: start,
          DestinationLocation: {
            LocationCode: destination
          },
          OriginLocation: {
            LocationCode: home
          },
          RPH: "0"
        },
        {
          DepartureDateTime: end,
          DestinationLocation: {
            LocationCode: home
          },
          OriginLocation: {
            LocationCode: destination
          },
          RPH: "1"
        }
      ],
      Version: "1"
    }
  };
  return requestObj;
}
