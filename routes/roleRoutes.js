const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
//const authToken = require('../middleware/authToken')

router.get('/', roleController.GetAllRoles);
router.get('/:id', roleController.GetRoleById);
router.post('/:id',roleController.AssignRoleToUser)

module.exports = router;