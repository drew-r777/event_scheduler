const User = require('../models/user');
const Connection = require('../models/connection');

//view signup form
exports.signup = (req, res) =>{
    return res.render('./user/new');
};

//process signup
exports.signingup = (req, res, next)=>{
    
    let user = new User(req.body);
    user.save()
    .then(()=>{
        req.flash('success', 'Registration was successful');
        res.redirect('./user/login')
    })
    .catch(err=>{
    if(err.name === 'ValidationError'){
        req.flash('error', err.message);
        return res.redirect('./user/new');
    }
    //duplicate email error
    if(err.code === 11000){
        req.flash('error', 'Email address has been used');
        return res.redirect('./user/new');
    }

    next(err);
    });
       
};

//profile
exports.profile = (req, res, next) =>{
    let id = req.session.user[0];
    Promise.all([User.findById(id), Connection.find({host: id})])
    .then(results=>{
        const [user, connections] = results;
        res.render('./user/profile', {user, connections})
    })
    .catch(err=>next(err));
};

//login form
exports.login = (req, res, next) =>{
    return res.render('./user/login');
}

//process login
exports.userLogin =  (req, res)=>{
    //authenticate user's login request
    let email = req.body.email;
    let password = req.body.password;
    
    //get the user that matches the email
    User.findOne({email: email})
    .then(user=>{
        if(user){
            //user found in the database
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = [user._id, user.firstName]; //store user's id and name in the session
                    //req.session.user = user.firstName; //*
                    
                    req.flash('success', 'You have successfully logged in!');
                    res.redirect('./profile');
                } else {
                    req.flash('error', 'Wrong password');
                    res.redirect('./login');
                }
            })
        } else {
            req.flash('error', 'Wrong email address');
            res.redirect('./login');
        }
    })
    .catch(err=>next(err));
    
};



//logout
exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};