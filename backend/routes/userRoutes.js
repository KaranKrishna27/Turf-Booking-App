const express = require('express');
const { registerUser, authUser, getAllUsers } = require('../controllers/userController');

const router = express.Router()

router.route('/signup').post(registerUser)
router.route('/signin').post(authUser)
router.get('/', getAllUsers);


module.exports = router;