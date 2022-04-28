const express = require('express');
const router = express.Router();
const dashboard = require('../../controllers/dashboard/dashboard');
const auth = require('../../middleware/auth');


router.get('/', auth, dashboard.findAll);
//router.get('/:id', auth, dashboard.findOne);
router.get('/getInventario/:id', auth, dashboard.getInventario);


module.exports = router;