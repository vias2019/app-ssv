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
    var chartOutput = {historical: [], forecast: {}};

    // get historical data
    getChartHistorical(clientInput, function(historicalResult)
    {
      chartOutput.historical = historicalResult;
      console.log(" CHART OUTPUT - HISTORICAL ");

      // get future data next
      getChartForecast(clientInput, function(forecastResult)
      {
        chartOutput.forecast = forecastResult;
        console.log(" CHART OUTPUT - FORECAST ");
        res.json(chartOutput);
      });
    });
  });
};

function getChartHistorical(clientInput, cb)
{
  var requestStr = getTrendRequest(clientInput, true);
  axios
    .get(requestStr)
    .then(function(historicalResult)
    {
      var promises = [];
      var historicalData = historicalResult.data;
      var origin = historicalData.OriginLocation;
      var destination = historicalData.DestinationLocation;
      var historicalFares = historicalData.FareInfo;
      for (var row=0; row<historicalFares.length; row++)
      {
        var airfare = historicalFares[row].LowestFare;
        var date = historicalFares[row].ShopDateTime;

        promises.push(db.Chart.findOrCreate(
          {
            defaults:
                {
                  date: date,
                  originCity: origin,
                  destinationCity: destination,
                  airfare: airfare
                },
            where:
                {
                  date: date,
                  originCity: origin,
                  destinationCity: destination
                }
          })
          .then(function(historicalRow, wasCreated)
          {
            if (wasCreated)
            {
              console.log("NEW RECORD: ");
              console.log(historicalRow);
            }
            else
            {
              console.log("ROW ALREADY EXISTED: ");
              console.log(historicalRow);
              promises.push(db.Chart.update(
                {
                  airfare: airfare,
                },
                {
                  where:
                        {
                          date: date, // this is the date that the historical data was "shopped"
                          originCity: origin,
                          destinationCity: destination
                        }
                })
                .then(function(rowsUpdated)
                {
                  console.log(rowsUpdated + " ROWS UPDATED");
                }));
            }
          }));
      }
      Promise.all(promises)
        .then(function()
        {
          db.Chart.findAll({where: {originCity: origin, destinationCity: destination}})
            .then(function(allHistorical)
            {
              var historicalArray = [];
              for (historicalRow in allHistorical)
              {
                var currentRow = allHistorical[historicalRow].dataValues;
                console.log(" HISTORICAL DATA ROW ");
                console.log(currentRow);
                historicalArray.push(
                  {
                    origin: currentRow.originCity,
                    destination: currentRow.destinationCity,
                    date: currentRow.date,
                    airfare: currentRow.airfare
                  });
              }
              cb(historicalArray);
            });
        })
        .catch(function(err)
        {
          console.log(err);
          res.send(err);
        });
    })
    .catch(function (err)
    {
      console.log(err);
      res.send(err);
    });
}

function getChartForecast(clientInput, cb)
{
  requestStr = getTrendRequest(clientInput, false);
  axios
    .get(requestStr)
    .then(function(forecastResult)
    {
      var forecastData = forecastResult.data;
      console.log("*************** FORECAST DATA *********************");
      //console.log(forecastData);

      var forecastOutput =
        {
          origin: forecastData.OriginLocation,
          destination: forecastData.DestinationLocation,
          start: forecastData.DepartureDateTime,
          end: forecastData.ReturnDateTime,
          recommendation: forecastData.Recommendation,
          fare: forecastData.LowestFare,
          trend: forecastData.Direction
        };
      console.log(forecastOutput);
      cb(forecastOutput);
    })
    .catch(function(err)
    {
      console.log(err);
    });
}

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
