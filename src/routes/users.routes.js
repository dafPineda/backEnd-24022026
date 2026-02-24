const express = require('express');
const router = express.Router()
const controller = require('../controllers/users.controller.js');
const {authMiddleware, requireRole} = require('../auth.js')

router.post('/login',controller.logInUser)
router.post('/create', controller.create)

module.exports = { router };