var express = require('express');
var path = require('path');
var http = require('http');
var routes = require('./routes/index');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));


// Handle Errors gracefully
app.use(function(err, req, res, next) {
    if(!err) return next();
    console.log(err.stack);
    res.json({error: true});
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.sockets.on('connection', routes.vote);

app.get('/', routes.index);
app.get('/polls/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);


server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;