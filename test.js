var mongoose = require('mongoose');
var fs = require('fs');
var join = require('path').join;
fs.readdirSync(join(__dirname, 'models')).forEach(function (file) {
 	
 	if (~file.indexOf('.js')) require(join(__dirname, 'models', file));
});

var User = mongoose.model('User');
console.log("success");