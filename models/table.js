module.exports = function(sequelize, DataTypes)
{
  var Chart = sequelize.define("Chart",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      date: DataTypes.DATE,
      airfare: DataTypes.INTEGER,
      destinationCity: DataTypes.STRING,
      originCity: DataTypes.STRING
    },
    {
      freezeTableName: true,
      tableName: 'chart'
    });

  return Chart;
};
