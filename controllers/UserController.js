/**
 * UserController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var User = mongoose.model('User');
var parse = require("co-body");
var render = {};


router.get('/user/register',function *(next){
   var user = this.params.account;
   
});

module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());
     
     render = render;
}