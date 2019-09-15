// Creates a "Book" model that matches up with DB

module.exports = function(sequelize, DataTypes)
{
  var Chart = sequelize.define("chart",
    {
      date: DataTypes.DATE,
      airfare: DataTypes.INTEGER,
      pages: DataTypes.INTEGER,
      destinationCity: DataTypes.STRING,
      originCity: DataTypes.STRING
    },
    {
      freezeTableName: true
    });

  return Chart;
};
