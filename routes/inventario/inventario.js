const express = require('express');
const router = express.Router();
const inventario = require('../../controllers/inventario/inventario');
const auth = require('../../middleware/auth');

router.get('/', auth, inventario.findAll);
router.get('/getData/all', auth, inventario.getDataAll);

module.exports = router;