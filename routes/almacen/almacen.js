const express = require('express');
const router = express.Router();
const almacen = require('../../controllers/almacen/almacen');
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const { validarCampos } = require('../../middleware/validar-campos');


router.get('/', auth, almacen.findAll);
router.get('/:id', auth, almacen.findOne);
router.get('/getData/all', auth, almacen.getDataAll);

router.post('/', auth, [
    check('clave', 'La Clave del Almacén es obligatorio').trim().not().isEmpty(),
    check('nombre', 'El nombre del Almacén es obligatorio').trim().not().isEmpty(),
    validarCampos
], almacen.create);


router.put('/:id', auth, [
    check('clave', 'La Clave del Almacén es obligatorio').trim().not().isEmpty(),
    check('nombre', 'El nombre del Almacén es obligatorio').trim().not().isEmpty(),
    validarCampos
], almacen.update);


router.delete('/:id', auth, almacen.delete);


module.exports = router;