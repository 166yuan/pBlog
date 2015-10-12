/**
 * TagController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var render = {};

router.get('/tag',function *(next){
  console.log('tag');
});



module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());

    render = render;
}