const express = require('express');
const router = express.Router();
const proyectos = require('../../controllers/proyectos/proyectos');
const { check } = require('express-validator');
const auth = require('../../middleware/auth');


router.get('/', auth, proyectos.findAll);
router.get('/:id', auth, proyectos.findOne);

router.post('/', auth, [
    check('nombre', 'El nombre del proyecto es obligatorio').trim().not().isEmpty()
], proyectos.create);

router.get('/obtenerProyectos/usuario', auth, proyectos.obtenerProyectos);

router.put('/:id', auth, [
    check('nombre', 'El nombre del proyecto es obligatorio').trim().not().isEmpty()
], proyectos.update);


router.delete('/:id', auth, proyectos.delete);


module.exports = router;