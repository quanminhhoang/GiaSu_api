const router = require("express").Router();

const AddressController = require('../controllers/addressController')

router.get('/get-provinces', AddressController.getProvinces )
router.post('/get-districts', AddressController.getDistricts )
router.post('/get-wards', AddressController.getWards )
router.post('/get-full-address', AddressController.getFullAddress )

module.exports = router;