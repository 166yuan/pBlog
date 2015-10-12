/**
Blog Model
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//define user scheme
var BlogSchema = new Schema({
  	publisherId: Schema.Types.ObjectId,
    title: String,
    cantent: String,
    tags: [Schema.Types.ObjectId],
    viewNumber: { type:Number,default:0 },
    isHead: { type:Boolean,default:false },
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});

/**
*/

//create Model

mongoose.model('Blog',BlogSchema);