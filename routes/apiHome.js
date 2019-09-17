

module.exports = function(app)
{
  app.get("/api/alldestinations", function (req, res) {
    res.send(cities);
  });
};

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "cat123",
  database: "project2"
});
connection.connect(function (err) {
  if (err) {throw err;}
  searchData();
});

var cities=[];
function searchData() {
  console.log("Selecting data..");
  connection.query("SELECT airport, code from airports;", function (err, res) {
    if (err) {throw err;}
    // Log all results of the SELECT statement
    console.log(res);
    for (var i = 0; i < res.length; i++) {
      var tempArray = [];
      tempArray.push(res[i].airport);
      tempArray.push(res[i].code);
      cities.push(tempArray);
    }

    connection.end();
    // connection.query end
  });
  return cities;
}
