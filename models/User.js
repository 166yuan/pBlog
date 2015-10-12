/**
 User Model
 */

var mongoose = require('mongoose');

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
  	qq: { type:Number },
  	status: { type:Number,default:0 }, 
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});

//create Model

mongoose.model('User',UserSchema);