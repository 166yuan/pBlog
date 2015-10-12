/**
 * BlogController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var render = {};

router.get('/blog',function *(next){
  console.log('blog');
});



module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());
     
     render = render;
}