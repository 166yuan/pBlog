/**
 User Model
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

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
  }
}

/*useful method */

UserSchema.statics.login = function(account, password, callback) {
  var User = mongoose.model('User');
  var that = this;
  this.findOne({ account: account }, function (err, user) {

    if (err) callback(err, null);
    if(user) {
      if (user.hashed_password == that.schema.methods.encrptPasswd(password, user.sha1)) {
        callback(err, user);
      } else {
        callback(null, null);
      }

    } else {
      callback(null, null);
    }
  });

};

//create Model

mongoose.model('User',UserSchema);

module.exports = UserSchema = new Schema({});