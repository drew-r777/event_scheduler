const express = require('express');
const maincontroller = require('../controllers/mainController');

const mainrouter = express.Router();

mainrouter.get('/', maincontroller.index);

mainrouter.get('/about', maincontroller.about);

mainrouter.get('/contact', maincontroller.contact);


module.exports = mainrouter;
