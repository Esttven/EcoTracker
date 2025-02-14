'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AuditLog extends Model {
        static associate(models) {
        }
    }
    AuditLog.init({
        table_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        operation: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        record_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        old_data: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        new_data: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        changed_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'AuditLog',
    });
    return AuditLog;
};