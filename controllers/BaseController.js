var router = require('koa-router')();

var render = {};

router.get('/',function *(next){
	yield this.render("index.jade");
});


module.exports = function( app,render ){
	app
		.use(router.routes())
		.use(router.allowedMethods());

	render = render;	
};