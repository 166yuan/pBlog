/**
 * the entrance of blog system
 */
var fs = require("fs");
var path = require('path');
var join = path.join;
var app = require('koa')();
var static = require('koa-static');
var mongoose = require('mongoose');
var db = require("./config/database.js");
var jade = require('koa-jade-render');
var port = process.env.PORT || 3000;

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(db.path, options);
};

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
mongoose.connection.on('success',function(){
	console.log('success connect to mongodb');
});

// init model
fs.readdirSync(join(__dirname, 'models')).forEach(function (file) {
 	
 	if (~file.indexOf('.js')) require(join(__dirname, 'models', file));
});

app.use(jade(path.join(__dirname, 'views')));
app.use(static(__dirname+'/public'));

/**
 *  init Controller
 */
 fs.readdirSync(join(__dirname, 'controllers')).forEach(function (file) {
 	
 	if (~file.indexOf('.js')) require(join(__dirname, 'controllers', file))(app);
});


app.listen(3000);
console.log('connection to service on port:' + port);