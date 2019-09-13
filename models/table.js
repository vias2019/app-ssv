// Creates a "Book" model that matches up with DB

module.exports = function(sequelize, DataTypes)
{
  var Table = sequelize.define("chart",
    {
      months: DataTypes.STRING,
      airfare: DataTypes.INTEGER,
      pages: DataTypes.INTEGER,
      destinationCity: DataTypes.STRING,
      originCity: DataTypes.STRING
    },
    {
      freezeTableName: true
    });

  return Table;
};
