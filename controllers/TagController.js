/**
 * TagController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var koaBody = require("koa-body")();
var Tag = mongoose.model('Tag');
var Blog = mongoose.model('Blog');
var render = {};

router.get('/tag/getAll',koaBody,function *(next){
  var tags = yield Tag.getAll();
  this.body = tags;
});

router.post("/tag/getArticleBytag",koaBody,function*(next){
	var result = yield Blog.findByTag(this.request.body.tname,this.session.user._id);
	if(result){
		this.body = {
			result:1,
			info:"ok",
			data:result
		}
	}else{
		this.body = {
			result:-1,
			info:"fail"
		}
	}
});

module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());

    render = render;
}