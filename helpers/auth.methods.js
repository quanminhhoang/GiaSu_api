const jwt = require("jsonwebtoken");

exports.verifyToken = async (token, secretKey) => {
	try {
		return await jwt.verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		return null;
	}
};