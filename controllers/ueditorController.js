

/**
 * BlogController
 */

var router = require('koa-router')();
var koaBody = require("koa-body")();
var config = require("../config/config.js");

router.get('/ueditor/upload',koaBody,function *(next){
	var op = this.request.url.split("?");
  	if (op[1].indexOf("action=config")>=0) {
  		this.body = JSON.stringify(config);
  	}

 });

router.post('/ueditor/upload',koaBody,function *(next){
	var
        fs = require('fs'),
        path = require('path'),
        parse = require('co-busboy'),
        parts, part, name, stream, body;

      parts = parse(this); // 来自github koa example
      this.type = 'text/html; charset=utf-8'; // umeditor只接受'text/html'
      if (part = yield parts) {
        name = +new Date() + part.filename;
        stream = fs.createWriteStream(path.join("public/img", name));
        part.pipe(stream);
        body = '{"url": "' + "http://localhost:3000" + '/img/' + name + '", "title": "' + name + '", "state": "SUCCESS" }';
      } else {
        body = '{"url": "", "title": "", "state": "EORROR" }';
      }
      this.type = 'text/html; charset=utf-8'; // umeditor只接受'text/html'
      this.body = body;
});

module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());

}