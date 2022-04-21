const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth');
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../../middleware/validar-campos');



router.post('/', [
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').trim().isLength({min:6}),
    validarCampos
], authController.autenticarUsuario);


router.get('/usuarioLogueado', auth, authController.usuarioLogueado);

router.get('/renovarToken', auth, authController.renovarToken);

module.exports = router;
