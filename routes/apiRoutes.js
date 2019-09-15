var db = require("../models");

// Axios
var axios = require("axios");
axios.defaults.headers.common.Authorization = process.env.SABRE_TOKEN;

module.exports = function(app)
{
  app.post("/api/destination", function(req, res)
  {
    var clientInput = req.body;
    var clientOutput = [];
    var fareObj = {};
    requestStr = getFareRequest(clientInput);

    axios
      .get(requestStr)
      .then(function(result)
      {
        var allFares = result.data.FareInfo; // from API

        var airportCodes = [];
        for (fare in allFares)
        {airportCodes.push(allFares[fare].DestinationLocation);} // 'BOS'

        db.Airport.findAll(
          {
            attributes: ['airport', 'code'],
            where: {code: airportCodes}
          })
          .then(function(dbAirports)
          {
            for (fare in allFares) // for all fares from API
            {
              var curDestination = allFares[fare].DestinationLocation;
              var airportRow = dbAirports.find(function(airportItem)
              {
                return airportItem.dataValues.code === curDestination;
              });
              fareObj =
                    {
                      destination: airportRow.airport,
                      destinationCode: allFares[fare].DestinationLocation,
                      fare: allFares[fare].LowestFare.Fare
                    };
              clientOutput.push(fareObj);
            }

            clientOutput.sort(compare);
            res.json(clientOutput);
          });
      })
      .catch(function(err) {
        console.log("*************************************************************");
        console.log(err);
      });
  });

  app.post("/api/trends", function(req, res)
  {
    var clientInput = req.body;
    // get historical data first:
    var historical = true;
    var requestStr = getTrendRequest(clientInput, historical);
    axios
      .get(requestStr)
      .then(function(historicalResult)
      {
        // get future data next
        requestStr = getTrendRequest(clientInput, !historical);
        axios
          .get(requestStr)
          .then(function(forecastResult)
          {
            var historicalData = historicalResult.data;
            var forecastData = forecastResult.data;
            console.log("*************************  HISTORICAL ************************");
            console.log(historicalData);
            console.log("*************************  FORECAST ************************");
            console.log(forecastData);

            var origin = historicalData.OriginLocation;
            var destination = historicalData.OriginLocation;

            for (row in historicalData.FareInfo)
            {
              console.log("*************************  FARE DATA ROW ************************");
              console.log(historicalData.FareInfo[row]);

              var airfare = historicalData.FareInfo[row].LowestFare;
              var date = historicalData.FareInfo[row].ShopDateTime;

              db.Chart.upsert(
                {
                  airfare: airfare
                },
                {
                  where:
                        {
                          date: date,
                          origin: origin,
                          destination: destination
                        }
                });
            }
            res.send("ok");
            //res.json([historicalData, forecastData]);
          })
          .catch(function(err)
          {
            console.log(err);
          });
      })
      .catch(function (err)
      {
        console.log(err);
        res.send("ok");
      });
  });
};

function getTrendRequest(clientInput, historical)
{

  var start = clientInput.from;
  var end = clientInput.to;
  var home = clientInput.departure;
  var destination = clientInput.destination || "LAS";
  var url = "https://api-crt.cert.havail.sabre.com";
  var endpoint = "";

  if (historical)
  {
    endpoint = "/v1/historical/shop/flights/fares?";
  }
  else
  {
    endpoint = "/v2/forecast/flights/fares?";
  }

  var requestStr =
    url + endpoint +
    "origin=" + home +
    "&destination=" + destination +
    "&departuredate=" + start +
    "&returndate=" + end;

  return requestStr;
}

function getFareRequest(clientInput)
{
  var start = clientInput.from;
  var end = clientInput.to;
  var home = clientInput.departure;
  var theme = clientInput.activity;

  var requestStr =
    "https://api-crt.cert.havail.sabre.com/v2/shop/flights/fares?" +
    "origin=" + home +
    "&departuredate=" + start +
    "&returndate=" + end +
    "&theme=" + theme;

  return requestStr;
}

function compare(fare1, fare2)
{
  if (fare1.fare > fare2.fare) {return 1;}
  if (fare2.fare > fare1.fare) {return -1;}
  return 0;
}
