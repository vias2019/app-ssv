
//See the trend button
//var mysql =require("../../env");


module.exports = function(app)
{
  app.get("/api/chart", function (req, res) {
    res.send(search); 
  });
};




var mysql = require('mysql');
   
  
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "project2"
});
connection.connect(function(err) {
  if (err) {throw err;}
  searchData();
});
  
  
var originalLocation = 'Seattle';
var destinationLocation ='Chicago';
var departureDate = '2019-10-15';
var returnDate = '2019-10-21';
  
var search=['Date', "Airfare"];
function searchData() {
  console.log("Selecting data..");
  connection.query("SELECT * from chart where date between '"+departureDate+"' and '"+ returnDate + "' and originCity ='"+originalLocation +"' and destinationCity ='"+destinationLocation + "';", function(err, res) {
    if (err) {throw err;}
    // Log all results of the SELECT statement
    console.log(res);
    for (var i=0; i<res.length; i++)
    {
      var tempArray=[];
      tempArray.push(res[i].date);
      tempArray.push(res[i].airfare);
      search.push(tempArray);
    }
   
    connection.end();
  });
}