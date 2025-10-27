const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authToken = require('../controllers/middleware/authToken');
const authorizeRoles = require('../controllers/middleware/authRoles')

router.get('/', roleController.GetAllRoles);
router.get('/:id', roleController.GetRoleById);
router.post('/:id',roleController.AssignRoleToUser);
router.post('/admin/counsellors',authToken, authorizeRoles('admin'), roleController.AddCounsellor);

module.exports = router;