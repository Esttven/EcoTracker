'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ElectricUsage extends Model {
    static associate(models) {
      ElectricUsage.belongsTo(models.User, { foreignKey: "userId" });
      ElectricUsage.belongsTo(models.Appliance, { foreignKey: "applianceId" });
    }
  }
  ElectricUsage.init({
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    applianceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Appliances',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'ElectricUsage',
  });
  return ElectricUsage;
};