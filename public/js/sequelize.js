
// Sequelize (capital) references the standard library
var Sequelize = require("sequelize");
// sequelize (lowercase) references my connection to the DB.
var sequelize = require("../../config/connection.js");

// Creates a "Book" model that matches up with DB
var Table = sequelize.define("chart", {
  id: Sequelize.INTEGER,
  months: Sequelize.STRING,
  airfare: Sequelize.INTEGER,
  pages: Sequelize.INTEGER,
  destinationCity: Sequelize.STRING,
  originCity: Sequelize.STRING
},{
    freezeTableName: true
});

// Syncs with DB
Table.sync();

// Makes the Book Model available for other files (will also create a table)
module.exports = Table;
