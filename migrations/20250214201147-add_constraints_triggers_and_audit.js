'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add constraints
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users"
      ADD CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Appliances"
      ADD CONSTRAINT chk_kwh_positive CHECK (kwh >= 0);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "ElectricUsages"
      ADD CONSTRAINT chk_frequency_positive CHECK (frequency > 0);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Users"
      ADD CONSTRAINT unique_email UNIQUE (email);
    `);

    // Add trigger function and trigger for limiting user appliances
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION check_user_appliances_limit()
      RETURNS TRIGGER AS $$
      DECLARE appliance_count INTEGER;
      BEGIN
          SELECT COUNT(*) INTO appliance_count FROM "ElectricUsages" WHERE "userId" = NEW."userId";
          IF appliance_count >= 10 THEN
              RAISE EXCEPTION 'Un usuario no puede registrar más de 10 electrodomésticos';
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_limit_user_appliances
      BEFORE INSERT ON "ElectricUsages"
      FOR EACH ROW
      EXECUTE FUNCTION check_user_appliances_limit();
    `);

    // Create AuditLogs table
    await queryInterface.createTable('AuditLogs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      table_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      operation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      record_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      old_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      new_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      changed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Add audit trigger function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION audit_trigger_function() RETURNS TRIGGER AS $$
      BEGIN
          IF (TG_OP = 'DELETE') THEN
              INSERT INTO "AuditLogs" (table_name, operation, record_id, old_data)
              VALUES (TG_TABLE_NAME, TG_OP, OLD.id::text, row_to_json(OLD));
              RETURN OLD;
          ELSIF (TG_OP = 'UPDATE') THEN
              INSERT INTO "AuditLogs" (table_name, operation, record_id, old_data, new_data)
              VALUES (TG_TABLE_NAME, TG_OP, NEW.id::text, row_to_json(OLD), row_to_json(NEW));
              RETURN NEW;
          ELSIF (TG_OP = 'INSERT') THEN
              INSERT INTO "AuditLogs" (table_name, operation, record_id, new_data)
              VALUES (TG_TABLE_NAME, TG_OP, NEW.id::text, row_to_json(NEW));
              RETURN NEW;
          END IF;
          RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Add audit triggers for main tables
    await queryInterface.sequelize.query(`
      CREATE TRIGGER users_audit
      AFTER INSERT OR UPDATE OR DELETE ON "Users"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER electricusages_audit
      AFTER INSERT OR UPDATE OR DELETE ON "ElectricUsages"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER appliances_audit
      AFTER INSERT OR UPDATE OR DELETE ON "Appliances"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    // Create views
    await queryInterface.sequelize.query(`
      CREATE VIEW UserEnergyConsumption AS
      SELECT 
          u.id AS user_id,
          u.username,
          SUM(a.kwh * e.frequency) AS total_kwh_consumed
      FROM "Users" u
      JOIN "ElectricUsages" e ON u.id = e."userId" 
      JOIN "Appliances" a ON e."applianceId" = a.id 
      GROUP BY u.id, u.username;
    `);

    await queryInterface.sequelize.query(`
      CREATE VIEW RecentAuditLogs AS
      SELECT 
          table_name, 
          operation, 
          record_id, 
          old_data, 
          new_data, 
          changed_at
      FROM "AuditLogs"
      ORDER BY changed_at DESC
      LIMIT 20;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop views
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS UserEnergyConsumption;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS RecentAuditLogs;`);

    // Drop audit triggers
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS users_audit ON "Users";`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS electricusages_audit ON "ElectricUsages";`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS appliances_audit ON "Appliances";`);

    // Drop audit trigger function
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS audit_trigger_function;`);

    // Drop AuditLogs table
    await queryInterface.dropTable('AuditLogs');

    // Drop trigger for limiting user appliances
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS trg_limit_user_appliances ON "ElectricUsages";`);
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS check_user_appliances_limit;`);

    // Drop constraints
    await queryInterface.sequelize.query(`ALTER TABLE "Users" DROP CONSTRAINT IF EXISTS chk_email_format;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Appliances" DROP CONSTRAINT IF EXISTS chk_kwh_positive;`);
    await queryInterface.sequelize.query(`ALTER TABLE "ElectricUsages" DROP CONSTRAINT IF EXISTS chk_frequency_positive;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Users" DROP CONSTRAINT IF EXISTS unique_email;`);
  }
};