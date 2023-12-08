const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create_payment_url', paymentController.createPaymentURL);
router.get('/vnpay_return', paymentController.vnpayReturn);
router.get('/vnpay_ipn', paymentController.vnpayIpn);

router.post('/webhook/handler-bank-transfer', paymentController.bankTransfer);

// Router này sẽ thực hiện tính năng đồng bộ giao dịch tức thì.
// Ví dụ: Khi người dùng chuyển khoản cho bạn và họ ấn nút tôi đã thanh toán thì nên xử lí gọi qua casso đề đồng bộ giao dịch vừa chuyển khoản
router.post('/users-paid', paymentController.userPaid);

module.exports = router;
