const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authToken = require('../controllers/middleware/authToken');

router.post('/', userController.CreateAvgUser)
router.get('/', userController.GetAllUsers);
router.get('/:id', authToken, userController.GetUserById);
router.put('/:id', authToken, userController.UpdateUserById);
router.delete('/:id',authToken, userController.DeleteUserById);

module.exports = router;
