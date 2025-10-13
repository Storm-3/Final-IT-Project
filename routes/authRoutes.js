const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authToken = require('../controllers/middleware/authToken')

router.put('/:id', authToken,authController.ChangePassword);
router.post('/login', authController.LoginUser);
router.post('/register',authController.RegisterUser);

module.exports = router;