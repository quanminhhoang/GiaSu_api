require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");

const getConfirmingTutor = async(req, res, next) => {
    try {
        const tutors = await db.Tutor.findAll({ where: {status: 'confirming'} })
        res.json({
            tutors
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

const updateTutorStatus = async (req, res, next) => {
    const { userID, status} = req.body
    try {
        const tutor = await db.Tutor.findOne({where: {userID: userID}})
        await tutor.update({status})
        res.json({
            message: 'update tutor status successfully'
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports = { getConfirmingTutor, updateTutorStatus }