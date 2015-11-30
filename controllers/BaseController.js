var router = require('koa-router')();
var path = require("path");
var fs = require('fs'),
  parse = require('co-busboy');
var render = {};
var mongoose = require('mongoose');
var Blog = mongoose.model("Blog");

router.get('/',function *(next){
	yield this.render("index.jade");
});

router.post('/upload',function*(next){
  var parts = parse(this);
  var part;
  console.log('post here');
  var fileNames = {};
  var newPath = "";
  while (part = yield parts) {
    var stream = fs.createWriteStream(path.join("public/img/") +part.filename);

    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);
    newPath = part.filename;
    fileNames[part.filename] = stream.path;
  }
 console.log(fileNames);
 this.body = "img/"+newPath;
 /*this.redirect("/#/center");*/

})

router.get("/welcome",function*(next){
  var data = yield Blog.findAll();
  if(data){
    this.body = {
      result:1,
      data:data,
      info:"success get"
    }
  }

})

module.exports = function( app,render ){
	app
		.use(router.routes())
		.use(router.allowedMethods());

	render = render;	
};