const express = require('express');
const router = express.Router();
const dashboard = require('../../controllers/dashboard/dashboard');
const auth = require('../../middleware/auth');


router.get('/', auth, dashboard.findAll);
//router.get('/:id', auth, dashboard.findOne);
//router.get('/getData/all', auth, dashboard.getDataAll);


module.exports = router;