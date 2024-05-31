const express = require('express');
const userController = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');

const userRouter = express.Router();


userRouter.get('/new', isGuest, userController.signup);
 
userRouter.post('/', isGuest, userController.signingup);

userRouter.get('/profile', isLoggedIn, userController.profile);

userRouter.get('/login', isGuest, userController.login);

userRouter.post('/login', isGuest, userController.userLogin);

userRouter.get('/logout', isLoggedIn, userController.logout);

module.exports = userRouter;

