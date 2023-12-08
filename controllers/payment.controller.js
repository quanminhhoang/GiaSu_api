const VietQR = require('vietqr');
//Vnpay
const querystring = require('qs');
const crypto = require('crypto');
const dateFormat = require('dateformat');
const db = require('../models/index');
const { QueryTypes } = require('sequelize');

//Casso config
let webhookUtil = require('../utils/webhook.util');
let getTokenUtil = require('../utils/get_token.util');
let syncUtil = require('../utils/sync.util');
let userUtil = require('../utils/get_user_info.util');
const transaction_prefix = 'CASSO';
const case_insensitive = false;
const expiration_date = 3;
const api_key =
	'AK_CS.44745d8092a511eeb0e9ffbe90bcf95f.eQ40cuFifQQ1ObiKq7kjKA2hiyiUj8IM83ojUpK3l0DcrwXGB3RiFd9o3AsQAbrA3WPlEWJu';
const secure_token = 'R5G4cbnN7uSAwfTd';

const createPaymentURL = async (req, res, next) => {
	const ipAddr = '0.0.0.0';

	const tmnCode = 'XUX312T2';
	const secretKey = 'ICNHBRDRYHXCHYTIMSHLOWIYENTNNZMY';
	const returnUrl = 'http://localhost:3000/api/payment/vnpay_return';
	var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

	const date = new Date();
	const createDate = dateFormat(date, 'yyyymmddHHmmss');
	const expireDate = '20231210101206';

	const amount = req.body.amount;
	const bankCode = 'NCB';
	const orderId = dateFormat(date, 'HHmmss');
	const orderInfo = req.body.orderInfo; // userId + classId
	const orderType = '190000';
	const locale = 'vn';
	const currCode = 'VND';

	var vnp_Params = {};
	vnp_Params['vnp_Version'] = '2.1.0';
	vnp_Params['vnp_Command'] = 'pay';
	vnp_Params['vnp_TmnCode'] = tmnCode;
	vnp_Params['vnp_Locale'] = locale;
	vnp_Params['vnp_CurrCode'] = currCode;
	vnp_Params['vnp_TxnRef'] = orderId;
	vnp_Params['vnp_OrderInfo'] = orderInfo;
	vnp_Params['vnp_OrderType'] = orderType;
	vnp_Params['vnp_Amount'] = amount * 100;
	vnp_Params['vnp_ReturnUrl'] = returnUrl;
	vnp_Params['vnp_IpAddr'] = ipAddr;
	vnp_Params['vnp_CreateDate'] = createDate;
	vnp_Params['vnp_BankCode'] = bankCode;
	vnp_Params['vnp_ExpireDate'] = expireDate;

	vnp_Params = sortObject(vnp_Params);

	const signData = querystring.stringify(vnp_Params, { encode: false });

	const hmac = crypto.createHmac('sha512', secretKey);
	const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
	vnp_Params['vnp_SecureHash'] = signed;
	vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

	res.redirect(vnpUrl);
};

//CHECKSUM
const vnpayReturn = async (req, res) => {
	try {
		var vnp_Params = req.query;
		const secureHash = vnp_Params['vnp_SecureHash'];

		delete vnp_Params['vnp_SecureHash'];
		delete vnp_Params['vnp_SecureHashType'];

		vnp_Params = sortObject(vnp_Params);

		const secretKey = 'ICNHBRDRYHXCHYTIMSHLOWIYENTNNZMY';

		const signData = querystring.stringify(vnp_Params, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

		if (secureHash === signed) {
			//Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

			const params = vnp_Params['vnp_OrderInfo'];
			const values = params.split(' ');
			const userId = values[0];
			const classId = values[1];

			const payment = await db.Post.create({
				amount: vnp_Params['vnp_Amount'],
				state: '0',
				user_id: userId,
				class_id: classId,
			});
			res.status(200).json(signed);
		} else {
			res.status(500);
		}
	} catch (err) {
		console.error(err);
	}
};

const vnpayIpn = async (req, res, next) => {
	let vnp_Params = req.query;
	let secureHash = vnp_Params['vnp_SecureHash'];

	const orderId = vnp_Params['vnp_TxnRef'];
	const rspCode = vnp_Params['vnp_ResponseCode'];

	delete vnp_Params['vnp_SecureHash'];
	delete vnp_Params['vnp_SecureHashType'];

	vnp_Params = sortObject(vnp_Params);

	const secretKey = 'ICNHBRDRYHXCHYTIMSHLOWIYENTNNZMY';

	const signData = querystring.stringify(vnp_Params, { encode: false });
	const hmac = crypto.createHmac('sha512', secretKey);
	const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

	//kiểm tra checksum
	if (secureHash === signed) {
		await db.Payment.findOne({
			where: {
				orderId,
			},
		}).then((payment) => {
			if (payment) {
				if (checkAmount == payment.amount) {
					if (payment.state == '0') {
						//kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
						if (rspCode == '00') {
							// Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
							db.Payment.update(
								{
									state: 'success',
								},
								{
									where: { orderId },
								}
							);
							res.status(200).json({ RspCode: '00', Message: 'Success' });
						} else {
							// Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
							db.Payment.update(
								{
									state: 'failure',
								},
								{
									where: { orderId },
								}
							);
							res.status(200).json({ RspCode: '00', Message: 'Failure' });
						}
					} else {
						res.status(200).json({
							RspCode: '02',
							Message: 'This order has been updated to the payment status',
						});
					}
				} else {
					res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
				}
			} else {
				res.status(200).json({ RspCode: '01', Message: 'Order not found' });
			}
		});
	} else {
		res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
	}
};

const createPaymentQR = async (req, res) => {
	const { amount, memo } = req.body;

	const vietQR = new VietQR.VietQR({
		clientID: 'de8a0804-a76d-41e5-8ad6-31503ce7d5f4',
		apiKey: '17c29f09-4ea2-4417-b9c2-7f020d35de42',
	});

	const link = vietQR.genQuickLink({
		bank: '970415',
		accountName: '',
		accountNumber: '123456789',
		amount: amount,
		memo: memo,
		template: 'compact',
		media: '.jpg',
	});
	console.log(link);
	res.status(200).json(link);
};

const userPaid = async (req, res, next) => {
	try {
		console.log(req.body);
		// Để thực hiện tính năng đồng bộ cần có Số tài khoản, Bạn có thể validate bằng schema ở middlewares
		// Hoặc có thể kiểm tra trong đây luôn
		if (!req.body.accountNumber) {
			return res.status(404).json({
				code: 404,
				message: 'Not foung Account number',
			});
		}
		//Lấy token bằng hàm lấy token. Token có hạn 6h nên bạn có thể lưu lại khi nào hết thì gọi hàm lấy token lại
		let resToken = await getTokenUtil.getTokenByAPIKey(api_key);
		console.log(resToken);
		let accessToken = resToken.access_token;
		//Tiến hành gọi hàm đồng bộ qua casso
		await syncUtil.syncTransaction(req.body.accountNumber, accessToken);
		return res.status(200).json({
			code: 200,
			message: 'success',
			data: null,
		});
	} catch (error) {
		next(error);
	}
};

const bankTransfer = async (req, res, next) => {
	try {
		if (
			!req.header('secure-token') ||
			req.header('secure-token') != secure_token
		) {
			return res.status(401).json({
				code: 401,
				message: 'Missing secure-token or wrong secure-token',
			});
		}
		// B2: Thực hiện lấy thông tin giao dịch
		for (let item of req.body.data) {
			// Lấy thông orderId từ nội dung giao dịch
			let orderId = webhookUtil.parseOrderId(
				case_insensitive,
				transaction_prefix,
				item.description
			);
			// Nếu không có orderId phù hợp từ nội dung ra next giao dịch tiếp theo
			if (!orderId) continue;
			// Kiểm tra giao dịch còn hạn hay không? Nếu không qua giao dịch tiếp theo
			if (
				(new Date().getTime() - new Date(item.when).getTime()) / 86400000 >=
				expiration_date
			)
				continue;

			console.log(orderId);
			// Bước quan trọng đây.
			// Sau khi có orderId Thì thực hiện thay đổi các trang thái giao dịch
			// Ví dụ như kiểm tra orderId có tồn tại trong danh sách các đơn hàng của bạn?
			// Sau đó cập nhật trạng thái theo orderId và amount nhận được: đủ hay thiếu tiền...
			// Và một số chức năng khác có thể tùy biến
		}
		return res.status(200).json({
			code: 200,
			message: 'success',
			data: null,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
	}
	return sorted;
}

module.exports = {
	createPaymentURL,
	vnpayIpn,
	vnpayReturn,
	bankTransfer,
	userPaid,
};
