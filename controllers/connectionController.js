const model =  require('../models/connection');

exports.index = (req, res, next)=>{
    //res.send('send all connections');
   
    model.find().sort({topic: 1})
    .then(connections=>{
        res.render('./connections/index', {connections});
    })
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    //res.send("Send the new form")
    res.render('./connections/newConnection');
};

exports.create = (req, res, next)=>{
    //res.send("Created a new connection")
    let connection =  new model(req.body);
    connection.host = req.session.user[0];
    connection.save()
    .then((connection)=>{
        req.flash('success', 'Connection was created successfully');
        res.redirect('/connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next)=>{
    //res.send('send connections with id' + req.params.id);
    let id = req.params.id;
    
    model.findById(id).populate('host', 'firstName lastName')
    .then(connection=>{
        if(connection){
            res.render('./connections/connection', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    //res.send('send the edit form');
    let id = req.params.id;

    model.findById(id)
    .then(connection=>{
        if(connection){
            res.render('./connections/edit', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    //res.send('update connections with id' + req.params.id);
    let connection = req.body
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        if(connection){
            req.flash('success', 'Connection was updated successfully');
            res.redirect('/connections/'+id);
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err)
    });

};

exports.delete = (req, res, next)=>{
    //res.send('delete connections with id' + req.params.id);
    let id = req.params.id;
    

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection=>{
        if(connection){
            req.flash('success', 'Connection was deleted successfully');
            res.redirect('/connections');
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};