/**
Blog Model
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//define user scheme
var CollectionSchema = new Schema({
  	colleactorId:Schema.Types.ObjectId,
  	BlogId:Schema.Types.ObjectId,
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});

/**
*/

//create Model

mongoose.model('Collection',CollectionSchema);