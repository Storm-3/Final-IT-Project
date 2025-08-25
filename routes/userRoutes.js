const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/', userController.createUser);
router.get('/', userController.GetAllUsers);
router.get('/', userController.GetUserById);
router.put('/',userController.UdpateUserById);

module.exports = router;
