/**
 * UserController
 */

var mongoose = require('mongoose');
var router = require('koa-router')();
var User = mongoose.model('User');
var koaBody = require("koa-body")();
var parse = require("co-body");
var render = {};


router.post('/user/login',koaBody,function *(next){
      var body = {};
       var user = yield User.login(this.request.body.account,this.request.body.passwd);
       console.log(user);
       this.body = body;
});


router.post('/user/register',koaBody,
	function * (next) {
    var _this = this;
    var body = {};
		var userData = {
			account:this.request.body.account,
			password:this.request.body.passwd
		}
    var u1 = yield User.findByAccount(userData.account);
     if(u1.length!=0){
        body = {
          result: -1,
          info : "account exist"
        }
     }else {
        var user = new User(userData);
        var result = yield user.add();
        if(result){
           body = {
             result :1,
             info : "successful add"
           }
        }else {
           body = {
             result: -1,
             info : "server error"
           }
        }
     }

      this.body = body; 
});

module.exports = function(app,render){
  render = render;
  app
    .use(router.routes())
    .use(router.allowedMethods()); 
}