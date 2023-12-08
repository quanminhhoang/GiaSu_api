const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wards', {
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    full_name_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    district_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'districts',
        key: 'code'
      }
    },
    administrative_unit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'administrative_units',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'wards',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
        ]
      },
      {
        name: "idx_wards_district",
        using: "BTREE",
        fields: [
          { name: "district_code" },
        ]
      },
      {
        name: "idx_wards_unit",
        using: "BTREE",
        fields: [
          { name: "administrative_unit_id" },
        ]
      },
    ]
  });
};
