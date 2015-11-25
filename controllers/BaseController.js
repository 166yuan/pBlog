var router = require('koa-router')();
var path = require("path");
var fs = require('fs'),
  parse = require('co-busboy');

var render = {};

router.get('/',function *(next){
	yield this.render("index.jade");
});

router.post('/upload',function*(next){
  var parts = parse(this);
  console.log(parts);
  var part;
  console.log('post here');
  var fileNames = {};

  while (part = yield parts) {
    var stream = fs.createWriteStream(path.join("public/img/") + Math.random()+part.filename);

    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);

    fileNames[part.filename] = stream.path;
  }

})

module.exports = function( app,render ){
	app
		.use(router.routes())
		.use(router.allowedMethods());

	render = render;	
};