const router = require("express").Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const parentsController = require('../controllers/parentsController')

router.post('/requestClass', isAuth, parentsController.requestClass )
router.post('/get-requestClass-of-parents', isAuth, parentsController.getRequestClassesOfParents )
router.post('/get-class-by-id', isAuth, parentsController.getClasssById)

module.exports = router;