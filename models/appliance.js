'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appliance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appliance.hasMany(models.ElectricUsage, { foreignKey: "applianceId" });
    }

  }
  Appliance.init({
    name: DataTypes.STRING,
    type: DataTypes.ENUM("hours_per_day", "times_per_week"),
    kwh: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Appliance',
  });
  return Appliance;
};