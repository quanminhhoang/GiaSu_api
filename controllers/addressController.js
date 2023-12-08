require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");
const { QueryTypes } = require("sequelize");

const getProvinces = async (req, res, next) => {
  try {
    const provinces = await db.sequelize.query(
      "SELECT p.code, p.name , p.full_name , p.full_name_en ,au.full_name as administrative_unit_name FROM provinces p INNER JOIN administrative_units au ON p.administrative_unit_id = au.id ORDER BY code;",
      { type: QueryTypes.SELECT }
    );
    res.json({
      provinces,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 501;
    }
    next(err);
  }
};

const getDistricts = async (req, res, next) => {
  const { provinceCode } = req.body;
  try {
    const districts = await db.sequelize.query(
      `SELECT d.code, d.name , d.full_name , d.full_name_en ,au.full_name 
        as administrative_unit_name
        FROM districts d 
        INNER JOIN administrative_units au 
        ON d.administrative_unit_id = au.id
        WHERE d.province_code = ${provinceCode} 
        ORDER BY d.code;`,
      { type: QueryTypes.SELECT }
    );
    res.json({
      districts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 501;
    }
    next(err);
  }
};
const getWards = async (req, res, next) => {
  const { districtCode } = req.body;
  try {
    const wards = await db.sequelize.query(
      `SELECT w.code, w.name , w.full_name , w.full_name_en ,au.full_name 
        as administrative_unit_name
        FROM wards w 
        INNER JOIN administrative_units au 
        ON w.administrative_unit_id = au.id
        WHERE w.district_code = ${districtCode} 
        ORDER BY w.code;`,
      { type: QueryTypes.SELECT }
    );
    res.json({
      wards,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 501;
    }
    next(err);
  }
};
const getFullAddress = async (req, res, next) => {
  const { wardCode } = req.body;
  try {
    const address = await db.sequelize.query(
      `
        SELECT w.full_name AS w_name, d.full_name AS d_name, p.full_name AS p_name FROM wards w
        JOIN districts d ON w.district_code = d.code
        JOIN provinces p ON d.province_code = p.code
        WHERE w.code = ${wardCode}`,
      { type: QueryTypes.SELECT }
    );
    res.json({
      address,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 501;
    }
    next(err);
  }
};

module.exports = { getProvinces, getDistricts, getWards, getFullAddress };
