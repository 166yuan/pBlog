/**
Tag Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Promise = mongoose.Promise;

//define user scheme
var TagSchema = new Schema({
  	tname:String,
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
});

TagSchema.methods = {
	add: function(){
     var _this = this,
  p = new Promise();
  _this.save(function( err, data){
    if(err){
      p.reject(err,-1);
    }else{
      p.resolve( null , data);
    }

  });
  return p;
  }
} 

TagSchema.statics = {
	findByName:function(name){
		return this.find({tname:name}).exec();
	}
}
/**
*/

//create Model

mongoose.model('Tag',TagSchema);