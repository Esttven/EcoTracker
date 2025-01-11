'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Appliances', [
      {
        name: 'Refrigeradora',
        type: 'hours_per_day',
        kwh: 2.184,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aire acondicionado',
        type: 'hours_per_day',
        kwh: 3.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lavadora',
        type: 'times_per_week',
        kwh: 1.8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lava vajillas',
        type: 'times_per_week',
        kwh: 1.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Television',
        type: 'hours_per_day',
        kwh: 0.15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Horno electrico',
        type: 'hours_per_day',
        kwh: 2.3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Microondas',
        type: 'times_per_week',
        kwh: 0.945,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Computadora',
        type: 'hours_per_day',
        kwh: 0.45,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Calentador de agua',
        type: 'hours_per_day',
        kwh: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Secadora',
        type: 'times_per_week',
        kwh: 3.3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Appliances', null, {});
  }
};