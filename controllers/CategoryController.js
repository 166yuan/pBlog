/**
 * CategoryController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var render = {};

router.get('/category',function *(next){
  console.log('category');
});


module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());

     render = render;
}