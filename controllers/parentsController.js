require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");
const { QueryTypes } = require('sequelize');

const requestClass = async(req, res, next) => {
    const { parentID, parentName, phone, studentGender, requiredGender, address, detailAddress, grade, subject, skill, studentCharacter, schedule, frequency, salary, otherRequirement, status } = req.body
    let subjectIds 
    try{
        const id = await db.Subject.findOne({where: {name: subject, grade: grade}})
        subjectIds = id.id
        const requestclass = await db.RequestClasses.create(
            {
                parentID, 
                parentName, 
                phone, 
                studentGender, 
                requiredGender, 
                address, 
                detailAddress,
                grade, 
                subject, 
                skill, 
                studentCharacter, 
                schedule, 
                frequency, 
                salary, 
                otherRequirement, 
                status,
                subjectIds
            }
        )
        return res.status(200).json({ message: 'Request class successfully' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getRequestClasses = async(req, res, next) => {
    try {
        const classes = await db.RequestClasses.findAll()
        res.json({
            classes
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getRequestClassesOfParents = async (req, res, next) => {
    const {parentID} = req.body
    try {
        const classes = await db.sequelize.query(`SELECT *, requestclasses.id as reqId
            FROM requestclasses 
            JOIN subjects ON requestclasses.subjectIds = subjects.id 
            WHERE parentID = ${parentID} AND requestclasses.status='confirming'`,
            {type: QueryTypes.SELECT}
        )
        console.log(classes)
        res.json({
            classes
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getClasssById = async (req, res, next) => {
    const {id} = req.body
    try {
        const classes = await db.Class.findAll({where: {parent_id: id}})
        res.json({
            classes
        })
    } catch{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}



module.exports = { requestClass, getRequestClasses, getRequestClassesOfParents, getClasssById }