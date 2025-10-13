const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const authToken = require('../middleware/authToken')

router.get('/', userController.GetAllUsers);
router.get('/:id', userController.GetUserById);
router.put('/:id', userController.UpdateUserById);
router.delete('/:id', userController.DeleteUserById);


module.exports = router;
