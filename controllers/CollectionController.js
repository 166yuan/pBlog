/**
 * CollectionController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var render = {};

router.get('/collection',function *(next){
  console.log('collection');
});


module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());

     render = render;
}