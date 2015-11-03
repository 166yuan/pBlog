/**
 * UserController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var User = mongoose.model('User');
var koaBody = require("koa-body")();
var render = {};


router.post('/user/login',koaBody,function *(next){

       User.login(this.request.body.account,this.request.body.passwd,function(err,user){
            if (user) {
                console.log('success');
                yield this.render({
                    success:"ok"
                });
            }else{
                console.log('fail');
            }
       });
});

router.post('/user/register',koaBody,
	function * (next) {
		var userData = {
			account:this.request.body.account,
			password:this.request.body.passwd
		}
		console.log(this.request.body);
		  var user = new User(userData);
  user.save(function (err) {
    if (err) {
    	console.log(err);  
    }});
});

module.exports = function(app,render){
	app
    .use(router.routes())
    .use(router.allowedMethods());
     
     render = render;
}