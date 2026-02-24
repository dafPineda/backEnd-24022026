const express = require('express');
const router = express.Router()
const controller = require('../controllers/productos.controller');
const { authMiddleware } = require('../auth');


router.get('/',controller.getAll)
router.get('/actives', controller.getAllActive)
router.get('/search', controller.search)
router.get('/:id',controller.getById)

router.post('/', authMiddleware, controller.create)
router.put('/:id',controller.update)
router.delete('/:id', controller.remove)

module.exports = { router };