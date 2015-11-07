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
       var that = this;
      
       User.login(this.request.body.account,this.request.body.passwd,function(err,user){
            if (user) {
              that.body = "sss";
            }else{
                console.log('fail');
            }
       });
});

router.post("/user/test",koaBody,function *(next){

	var da = yield User.test(this.request.body.account);
	if (da.account = "qwe"){
		this.body = {
			success:"ok"
		}
	}
})

router.post('/user/register',koaBody,
	function * (next) {
    var _this = this;
		var userData = {
			account:this.request.body.account,
			password:this.request.body.passwd
		}
		  var user = new User(userData);
     var result = yield user.add();
     console.log(result);
      this.body = "ok"; 
});

module.exports = function(app,render){
	
  render = render;
  app
    .use(router.routes())
    .use(router.allowedMethods());
     
     
}