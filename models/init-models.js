var DataTypes = require("sequelize").DataTypes;
var _administrative_regions = require("./administrative_regions");
var _administrative_units = require("./administrative_units");
var _districts = require("./districts");
var _provinces = require("./provinces");
var _wards = require("./wards");

function initModels(sequelize) {
  var administrative_regions = _administrative_regions(sequelize, DataTypes);
  var administrative_units = _administrative_units(sequelize, DataTypes);
  var districts = _districts(sequelize, DataTypes);
  var provinces = _provinces(sequelize, DataTypes);
  var wards = _wards(sequelize, DataTypes);

  provinces.belongsTo(administrative_regions, { as: "administrative_region", foreignKey: "administrative_region_id"});
  administrative_regions.hasMany(provinces, { as: "provinces", foreignKey: "administrative_region_id"});
  districts.belongsTo(administrative_units, { as: "administrative_unit", foreignKey: "administrative_unit_id"});
  administrative_units.hasMany(districts, { as: "districts", foreignKey: "administrative_unit_id"});
  provinces.belongsTo(administrative_units, { as: "administrative_unit", foreignKey: "administrative_unit_id"});
  administrative_units.hasMany(provinces, { as: "provinces", foreignKey: "administrative_unit_id"});
  wards.belongsTo(administrative_units, { as: "administrative_unit", foreignKey: "administrative_unit_id"});
  administrative_units.hasMany(wards, { as: "wards", foreignKey: "administrative_unit_id"});
  wards.belongsTo(districts, { as: "district_code_district", foreignKey: "district_code"});
  districts.hasMany(wards, { as: "wards", foreignKey: "district_code"});
  districts.belongsTo(provinces, { as: "province_code_province", foreignKey: "province_code"});
  provinces.hasMany(districts, { as: "districts", foreignKey: "province_code"});

  return {
    administrative_regions,
    administrative_units,
    districts,
    provinces,
    wards,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
