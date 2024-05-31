//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectionRoutes = require('./routes/connectionRoutes');
const mainrouter = require('./routes/mainRoutes');
const userRouter = require('./routes/userRoutes');
const flash = require('connect-flash');
const user1 = require('./models/user');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/NBAD'
app.set('view engine', 'ejs');


//connect to MongoDB
mongoose.connect(url)
.then(()=>{
    //start the server
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})


//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'hjshlffi27329sfh',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/NBAD'}),
}));

//flash
app.use(flash());

app.use((req, res, next)=>{
    //console.log(req.session);
    //console.log(req.session.user);
    res.locals.user = req.session.user||null; //[0] =id [1] = name
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});


app.use(mainrouter);

app.use('/connections', connectionRoutes);

app.use('/user', userRouter);

app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});


app.use((err, req, res, next)=>{
    console.log(err.stack);

    if(!err.status){
        err.status = 500;
        err.message = ("Internal server error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});


