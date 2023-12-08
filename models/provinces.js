const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('provinces', {
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
      allowNull: false
    },
    full_name_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    administrative_unit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'administrative_units',
        key: 'id'
      }
    },
    administrative_region_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'administrative_regions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'provinces',
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
        name: "idx_provinces_region",
        using: "BTREE",
        fields: [
          { name: "administrative_region_id" },
        ]
      },
      {
        name: "idx_provinces_unit",
        using: "BTREE",
        fields: [
          { name: "administrative_unit_id" },
        ]
      },
    ]
  });
};
