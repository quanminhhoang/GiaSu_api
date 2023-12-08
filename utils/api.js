// api/axiosClient.js
const axios = require('axios');
const queryString = require('query-string');
const axiosClient = axios.create({
	baseURL: 'https://oauth.casso.vn/v1',
	headers: {
		'content-type': 'application/json',
		Authorization:
			'Apikey AK_CS.44745d8092a511eeb0e9ffbe90bcf95f.eQ40cuFifQQ1ObiKq7kjKA2hiyiUj8IM83ojUpK3l0DcrwXGB3RiFd9o3AsQAbrA3WPlEWJu',
	},
	paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
	// Handle token here ...
	return config;
});

axiosClient.interceptors.response.use(
	(response) => {
		if (response && response.data) {
			return response.data;
		}
		return response;
	},
	(error) => {
		// Handle errors
		throw error;
	}
);

module.exports = axiosClient;
