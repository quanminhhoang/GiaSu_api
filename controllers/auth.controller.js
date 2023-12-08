require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");

const generateAccessToken = async (payload) => {
  console.log("generating access token");
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  });
};

const generateRefreshToken = async (user_id) => {
  console.log("Generating refresh token");
  try {
    const user = await db.User.findByPk(user_id);
    if (!user) {
      throw new Error();
    }

    const issuedAt = toLocalDateTime(new Date());
    const expiredAt = new Date();
    expiredAt.setDate(issuedAt.getDate() + 7);

    const refreshTokenRecord = await db.RefreshToken.create({
      user_id: user.id,
      live_time: 7,
      issuedAt,
      expiredAt,
    });

    const numericIssuedAt = Math.floor(issuedAt.getTime() / 1000);
    const refreshTokenPayload = {
      jti: refreshTokenRecord.id,
      sub: user.id,
      iat: numericIssuedAt,
    };

    const refreshToken = await jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXP,
      }
    );

    return refreshToken;
  } catch (err) {
    err.statusCode = 500;
    err.errors = ["Failed to generate refresh token"];
    throw err;
  }
};

module.exports = {
  login: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await db.User.findOne({ where: { email: email } });
      if (!user) {
        const err = new Error(
          "Authentication credentials were missing or incorrect"
        );
        err.statusCode = 401;
        err.errors = ["Invalid email"];
        next(err);
      }        

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const err = new Error(
          "Authenticaiton credentails were missing or incorrect"
        );
        err.statusCode = 401;
        err.errors = ["Wrong password"];
        next(err);
      }

      const accessToken = await generateAccessToken({ sub: user.id });

      const refreshToken = await generateRefreshToken(user.id);

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: ["api/auth/refresh_token", "api/auth/revoke_refresh_token"],
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phone_number,
          role: user.role,
          gender: user.gender,
          birth: user.birth
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  register: async (req, res, next) => {
    const {
      name,
      email,
      password,
      role,
      gender,
      birth,
      phone,
      address,
    } = req.body;

    console.log({
      name,
      email,
      password,
      role,
      gender,
      birth,
      phone,
      address,
    })

    try {
      const hashPw = await bcrypt.hash(password, 12);
      const user = await db.User.create({
        name,
        email,
        password: hashPw,
        role,
        gender,
        birth,
        phone_number: phone,
        address,
      });

      switch (role) {
        case "tutor":
          try {
            await db.Tutor.create({ userID: user.id });
          } catch (err) {
            err.errors = "Error occurs when try to create new tutor";
            throw err;
          }
          break;
        case "parent":
          await db.Parent.create({ user_id: user.id });
          break;
        case "admin":
          await db.Admin.create({ user_id: user.id });
          break;
      }

      const accessToken = await generateAccessToken({ sub: user.id });
      console.log("access token generated");
      const refreshToken = await generateRefreshToken(user.id);
      console.log("refresh token generated");
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: ["api/auth/refresh_token", "api/auth/revoke_refresh_token"],
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phone_number,
          role: user.role,
          gender: user.gender,
          birth: user.birth
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshtoken");
      return res.status(204);
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshtoken;
      let userId;
      try {
        if (!refreshToken) {
          throw new Error();
        }

        const payload = await jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const refreshTokenId = payload.jti;
        const refreshTokenRecord = await db.RefreshToken.findByPk(
          refreshTokenId
        );
        if (!refreshTokenRecord || refreshTokenRecord.revoked)
          throw new Error();
        userId = payload.sub;
      } catch (err) {
        err.message = "Refresh token is missing or revoked";
        err.statusCode = 400;
        throw err;
      }

      const accessToken = await this.generateAccessToken({ sub: userId });

      return res.json({
        access_token: accessToken,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    }
  },

  revokeRefreshToken: async (req, res, next) => {
    try {
      let refreshTokenRecord;
      try {
        const refreshToken = req.cookies.refreshtoken;
        if (!refreshToken) throw new Error();

        const payload = await jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const refreshTokenId = payload.jti;
        const dbRecord = await db.RefreshToken.findByPk(refreshTokenId);
        if (!dbRecord || dbRecord.revoked) throw new Error();
        refreshTokenRecord = dbRecord;
      } catch (err) {
        err.message = "Refresh token is missing or revoked";
        err.status = 400;
        throw err;
      }

      refreshTokenRecord.revoked = true;
      await refreshTokenRecord.save();
      return res.status(204);
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
};
