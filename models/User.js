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
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password });

UserSchema.methods = {
  encryptPassword: function (password) {
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
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  }
}
//create Model

mongoose.model('User',UserSchema);