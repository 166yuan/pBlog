/**
Blog Model
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    Promise = mongoose.Promise;

//define user scheme
var BlogSchema = new Schema({
  	publisherId: Schema.Types.ObjectId,
    title: String,
    cantent: String,
    tags: [String],
    viewNumber: { type:Number,default:0 },
    isHead: { type:Boolean,default:false },
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});

BlogSchema.methods = {
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
/**
*/

//create Model

mongoose.model('Blog',BlogSchema);