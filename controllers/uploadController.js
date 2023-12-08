require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary").v2;
const db = require("../models/index");

const Multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

async function handleUpload(file, id) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      public_id: `tutor/tutor_${id}`
    });
    return res;
}

const uploadImage = async (req, res, next) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI, req.body.userID);
        const userId = Number(req.body.userID)
        const tutor = await db.Tutor.findOne({where: {userID: userId}})
        tutor.update({avatar: cldRes.url})
        res.json({
            cldRes
        });
    } catch (error) {
        console.log(error);
        res.send({
            message: error.message,
        });
    }
}

module.exports = { uploadImage }
