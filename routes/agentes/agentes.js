const express = require('express');
const router = express.Router();
const agentes = require('../../controllers/agentes/agentes');
const auth = require('../../middleware/auth');

router.get('/', auth, agentes.findAll);
//router.get('/getData/all', auth, inventario.getDataAll);

module.exports = router;