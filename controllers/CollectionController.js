/**
 * CollectionController
 */

var mongoose = require('mongoose');
var koaBody = require("koa-body")();
var Collection = mongoose.model('Collection');
var Blog = mongoose.model('Blog');
var router = require('koa-router')();


router.post("/collection/add",koaBody,function *(next){
	var collection = new Collection({
		BlogId:this.request.body.blogId
	});
	collection.userId = this.session.user._id; 
	var result = yield collection.add();
	if(result==1){
		this.body = "ok";
	}
});

router.get("/collection/getAll",koaBody,function *(next){
	var collections = yield Collection.find({userId:this.session.user._id}).exec();
	var blogs = [];
	for (var i = 0; i < collections.length; i++) {
		blogs.push( yield Blog.findOne({_id:new Object(collections[i].BlogId)}));
	}

	this.body = blogs;
});

module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());
}