/**
Tag Model
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//define user scheme
var TagSchema = new Schema({
  	tname:String,
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});

/**
*/

//create Model

mongoose.model('Tag',TagSchema);