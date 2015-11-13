/**
 * TagController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var koaBody = require("koa-body")();
var Tag = mongoose.model('Tag');
var render = {};

router.get('/tag/getAll',koaBody,function *(next){
  var tags = yield Tag.getAll();
  this.body = tags;
});



module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());

    render = render;
}