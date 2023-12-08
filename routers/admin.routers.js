const router = require("express").Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const AdminController = require('../controllers/adminController')

router.get('/get-confirming-tutor', isAuth, AdminController.getConfirmingTutor )
router.post('/update-tutor-status', isAuth, AdminController.updateTutorStatus )

module.exports = router;