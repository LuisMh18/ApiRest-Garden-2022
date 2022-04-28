const express = require('express');
const router = express.Router();
const clientes = require('../../controllers/tienda/clientes');
const auth = require('../../middleware/auth');

router.get('/', auth, clientes.findAll);
//router.get('/getData/all', auth, inventario.getDataAll);

module.exports = router;