const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authToken = require('../controllers/middleware/authToken');
const authRoles = require('../controllers/middleware/authRoles')

router.get('/', authToken, authRoles('admin'), roleController.GetAllRoles);
router.post('/admin',authToken, authRoles('admin'), roleController.AddUserWithRole);
router.get('/:id', roleController.GetRoleById);
router.post('/:id',authToken, authRoles('admin'),roleController.AssignRoleToUser);

module.exports = router;