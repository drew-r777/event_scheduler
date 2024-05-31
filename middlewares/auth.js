const Connection = require('../models/connection');

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/user/profile');
    }
};


//check if user is authenticated in
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    } else {
        req.flash('error', 'You need to login first.');
        return res.redirect('/user/login');
    }
};


//check if user is creator of connection
exports.isHost = (req, res, next)=>{
    let id = req.params.id;
    Connection.findById(id)
    .then(connection=>{
        if(connection){
            if(connection.host == req.session.user[0]){
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};