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
                airportCodes.push(allFares[fare].DestinationLocation);  // 'BOS'

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
                    }
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
};

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
    if (fare1.fare > fare2.fare) return 1;
    if (fare2.fare > fare1.fare) return -1;
    return 0;
}
