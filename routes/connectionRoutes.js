const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');


const router = express.Router();

//GET /connections send all connections to the user
router.get('/', controller.index);

//GET /newConnection send HTML form for creating a new connection
router.get('/new', isLoggedIn, controller.new);

//POST /connection create a new connection
router.post('/', isLoggedIn, controller.create);

//GET /connection/:id send details of connection identified by id
router.get('/:id', validateId, controller.show);

//GET /connection/:id/edit send html form for editing existing connection
router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

//PUT /connection/:id update the connection identified by id
router.put('/:id', validateId, isLoggedIn, isHost, controller.update);

//DELETE /connection/:id delete the connection identified by id
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);


module.exports = router;

