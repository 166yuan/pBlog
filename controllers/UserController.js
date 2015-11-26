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
       var data = yield User.login(this.request.body.account,this.request.body.passwd);
       if(data.result){
          this.body = {
            result:1,
            info:"success login",
            data:data.user
          }
       }else{
          this.body = {
            result:-1,
            info:"fail to login"
          }
       }
       
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
     if(u1){
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

router.post("/user/update",koaBody,function * (next){
  var data = this.request.body.user;
  console.log(data);
  User.findById(data._id,function(err,person){
     person.nickname = data.nickname;
     person.qq = data.qq;
     person.email = data.email;
     person.avatorUrl = data.avatorUrl;
     person.save();
  })
  this.body = {
    result:1
  }
 /* var user = yield User.findByAccount(data.account);
  if(user){
     user.nickname = data.nickname;
     user.sex = data.sex;
     user.avatorUrl = data.avatorUrl;
     user.qq = data.qq;
     user.email = user.email;
     user.updateTime = Date.now;
     user.save();
     this.body = {
        result:1,
        info:"ok"
     };
  }else{
    this.body = {
      result:-1,
      info:"fail"
    }
  }*/
})

module.exports = function(app,render){
  render = render;
  app
    .use(router.routes())
    .use(router.allowedMethods()); 
}