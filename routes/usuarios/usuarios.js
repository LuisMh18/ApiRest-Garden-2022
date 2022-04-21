const express = require('express');
const router = express.Router();
const usuarios = require('../../controllers/usuarios/usuarios');
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../../middleware/validar-campos');


router.get('/', auth, usuarios.findAll);
router.get('/:id', auth, usuarios.findOne);

router.post('/', auth, [
    check('rol_id', 'El rol es obligatorio').trim().not().isEmpty(),
    check('usuario', 'El nombre de usuario es obligatorio').trim().not().isEmpty(),
    check('password', 'El password debe ser minimo de 6 caracteres').trim().isLength({min:6}),
    check('password_confirm', 'El password de confirmación debe ser minimo de 6 caracteres').trim().isLength({min:6}),
    check('email', 'Agrega un email válido').isEmail(),
    validarCampos
], usuarios.create);


router.put('/:id', auth, [
    check('rol_id', 'El Rol es obligatorio').trim().not().isEmpty(),
    check('usuario', 'El nombre de usuario es obligatorio').trim().not().isEmpty(),
    check('old_password', 'El password anterior debe ser minimo de 6 caracteres').trim().isLength({min:6}),
    check('new_password', 'El password nuevo debe ser minimo de 6 caracteres').trim().isLength({min:6}),
    check('new_password_confirm', 'El password de confirmación debe ser minimo de 6 caracteres').trim().isLength({min:6}),
    check('email', 'Agrega un email válido').isEmail(),
    validarCampos
], usuarios.update);

router.delete('/:id', auth, usuarios.delete);

router.get('/getData/all', auth, usuarios.getDataAll);

module.exports = router;