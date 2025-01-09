'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ElectricUsage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ElectricUsage.belongsTo(models.User, { foreignKey: "userId" });
      ElectricUsage.belongsTo(models.Appliance, { foreignKey: "applianceId" });
    }
  }
  ElectricUsage.init({
    frequency: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ElectricUsage',
  });
  return ElectricUsage;
};