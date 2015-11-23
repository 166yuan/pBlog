/**
 User Model
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema,
    Promise = mongoose.Promise;

//define user scheme
var UserSchema = new Schema({
  	account: { type:String },
  	hashed_password: { type: String},
  	nickname: { type:String },
  	email: { type:String },
  	userLevel: { type:Number,default:1 },
  	avatorUrl: { type:String },
  	sex: { type:Boolean},
    sha1: { type:String },
  	qq: { type:Number },
  	status: { type:Number,default:0 }, 
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});

/*encode passwd and virtual*/
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.sha1 = this.makeSalt();
    this.hashed_password = this._encryptPassword(password);
  })
  .get(function() { return this._password });

UserSchema.methods = {
  _encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.sha1)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  encrptPasswd: function (password,sha1) {
      if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', sha1)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },
  add: function(){
     var _this = this,
  p = new Promise();
  _this.save(function( err, data){
    if(err){
      p.reject(err,-1);
    }else{
      p.resolve( null , 1);
    }

  });
  return p;
  }
}

/*useful method */

UserSchema.statics = { 
  findByAccount :function (account){
      return this.find({"account":account}).exec();
  },
  login: function(account,password){
     var _this = this,
    p = new Promise();
  _this.findOne({account:account},function( err, data){
    if(err){
      p.reject(err,-1);
    }else{
      console.log(data.hashed_password);
      console.log(_this.schema.methods.encrptPasswd(password, data.sha1));
      p.resolve( null , { result: _this.schema.methods.encrptPasswd(password, data.sha1) === data.hashed_password,user:data});
    }

  });
  return p;
  }  
}

//create Model

mongoose.model('User',UserSchema);

module.exports = UserSchema = new Schema({});