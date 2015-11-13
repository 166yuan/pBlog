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
	var result = yield Category.findAll();
	for (var i = 0; i < result.length; i++) {
	 	body.push({
	 		id:result[i]._id,
	 		ctitle:result[i].ctitle
	 	});
	 }
	 this.body = body; 
});

router.post("/category/add",koaBody,function*(next){
	var body = [];
	var result = yield Category.findByName(this.request.body.ctitle);
	if(result){
		var cate = new Category({ctitle:this.request.body.ctitle});
		var a = yield cate.add();
	}
	 this.body = "ok"; 
});

router.post("/category/getArticleByCate",koaBody,function*(next){
	var body = [];
});


module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());
}