/**
 User Model
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//define category scheme
var CategorySchema = new Schema({
  	ctitle:String,
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});

//create Model

mongoose.model('Category',CategorySchema);