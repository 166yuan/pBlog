/**
 * CategoryController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var koaBody = require("koa-body")();
var Category = mongoose.model("Category");
var Blog = mongoose.model("Blog");

router.get('/category/test',function *(next){
    var cate1 =  new Category({ctitle:"默认分类"});
    var cate2 =  new Category({ctitle:"日记"});
    yield cate1.add();
    yield cate2.add();
});

router.get("/category/all",function*(next){
	var body = [];
    console.log(this.session.user._id);
	var result = yield Category.findAll(this.session.user._id);
	for (var i = 0; i < result.length; i++) {
	 	body.push({
	 		id:result[i].toObject()._id,
	 		ctitle:result[i].toObject().ctitle
	 	});
	 }
	 this.body = body; 
});

router.post("/category/add",koaBody,function*(next){
	console.log(this.request.body);
	var body = [];
	var result = yield Category.findByName(this.request.body.ctitle,this.session.user._id);
	if(result){
		var cate = new Category({ctitle:this.request.body.ctitle});
        cate.userId = this.session.user._id;
		var a = yield cate.add();
	}
	 this.body = a.toObject(); 
});

router.post("/category/getArticleByCate",koaBody,function * (next){
	var body = [];
	var cid = this.request.body.cid;
	var result = yield Blog.findByCategory(cid,this.session.user._id);
	this.body = result;
});

router.post("/category/update",koaBody,function * (next){
	var id = this.request.body.cid;
	var newName = this.request.body.name;
	var cate = yield Category.findById(id);
	cate.ctitle = newName;
	cate.save();
	this.body = "ok";
});

router.post("/category/delete",koaBody,function*(next){
	var cid = this.request.body.cid;
	var cate = yield Category.findById(cid);
	var defaultCate = yield Category.findByName("默认分类");
	var arts = yield Blog.findByCategory(cid,this.session.user._id);
	for (var i = 0; i < arts.length; i++) {
		arts[i].category = defaultCate._id;
		arts[i].save();
	}
	cate.isDelete = true;
	cate.save();
	this.body = "ok";
});

module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());
}