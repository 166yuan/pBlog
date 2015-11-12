/**
 * BlogController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var koaBody = require("koa-body")();
var Blog = mongoose.model('Blog');
var Tag = mongoose.model('Tag');

router.post("/blog/publish",koaBody,function* (next){
	console.log(this.request.body);
	var articleData = this.request.body;
	var blog  = new Blog(articleData);
	for (var i = 0; i < articleData.tags.length; i++) {
		var tag = yield Tag.findByName(articleData.tags[i]);
		if(tag.length==0){
			tag = new Tag({
				tname:articleData.tags[i]
			});
			tag.save();
		}
	}
	var result = yield blog.add();
	this.body = {
		result:1,
		info:"success save"
	};
})

router.get("/blog/getAll",koaBody,function* (next){
	var data = yield Blog.findAll();
	if(data){
		this.body = {
			result:1,
			data:data,
			info:"success get"
		}
	}
});

module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());
     
     render = render;
}