const express = require('express');
const router = express.Router();
const menu = require('../../controllers/menu/menu');
const auth = require('../../middleware/auth');

router.get('/', auth, menu.findAll);


module.exports = router;