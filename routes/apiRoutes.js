var db = require("../models");
var moment = require("moment");
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

                if (allFares[fare].LowestFare.Fare)
                {
                    fareObj =
                    {
                        destination: airportRow.airport,
                        destinationCode: allFares[fare].DestinationLocation,
                        fare: allFares[fare].LowestFare.Fare,
                    }
                    clientOutput.push(fareObj);
                }
            }

            var promises = [];
            for (fareobj in clientOutput)
            {
              // get future data next
              var destination = clientOutput[fareobj].destinationCode;
              promises.push(getChartForecast(clientInput, destination));
            }

            Promise.all(promises)
            .then(function(results)
            {
                for (promise in results)
                {
                    if (!results[promise]) continue;
                    currentPromiseData = results[promise].data;
                    for (fareobj in clientOutput)
                    {
                        if (clientOutput[fareobj].destinationCode === currentPromiseData.DestinationLocation)
                        {
                            clientOutput[fareobj].forecast =
                            {
                                trend: currentPromiseData.Direction,
                                recommendation: currentPromiseData.Recommendation
                            };
                            continue;
                        }
                    }
                }

                clientOutput.sort(compare);
                res.json(clientOutput);
            })
            .catch(function(err)
            {
                console.log(err);
            })
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

    // get historical data
    getChartHistorical(clientInput, function(historicalResult)
    {
      var chartOutput = historicalResult;
      res.json(chartOutput);
    });
  });
};

function getChartForecast(clientInput, destination)
{
  requestStr = getTrendRequest(clientInput, destination, false);
  return axios
    .get(requestStr)
    .catch(function(err)
    {
      console.log(err);
    });
}

function getChartHistorical(clientInput, cb)
{
  var requestStr = getTrendRequest(clientInput, clientInput.destination, true);
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
            if (!wasCreated)
            {
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
                }));
            }
          }));
      }
      Promise.all(promises)
        .then(function()
        {
          db.Chart.findAll({
            where: {originCity: origin, destinationCity: destination},
            order:
                [
                  ['date', 'ASC'],
                ]})
            .then(function(allHistorical)
            {
              var historicalArray = [];
              // HEADER ROW
              var record = ["Date", "Price"];
              historicalArray.push(record);

              // DATA ROWS
              for (historicalRow in allHistorical)
              {
                var currentRow = allHistorical[historicalRow].dataValues;
                var rowDate = moment(currentRow.date).format('MM/DD');
                record = [rowDate, currentRow.airfare];
                historicalArray.push(record);
              }
              cb(historicalArray);
            });
        })
        .catch(function(err)
        {
          console.log(err);
          cb(err);
        });
    })
    .catch(function (err)
    {
      console.log(err);
      cb(err);
    });
}

function getTrendRequest(clientInput, destination, historical)
{

  var start = clientInput.from;
  var end = clientInput.to;
  var home = clientInput.departure;
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
