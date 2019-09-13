module.exports = function(sequelize, DataTypes)
{
    var Airport = sequelize.define("Airport",
    {
        airport:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        code:
        {
            type: DataTypes.STRING(4),
            allowNull: false
        }
    });

    return Airport;
};
