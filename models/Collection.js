/**
Blog Model
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    Promise = mongoose.Promise;

//define user scheme
var CollectionSchema = new Schema({
  	colleactorId:String,
  	BlogId:String,
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});
CollectionSchema.methods = {
	add :function(){
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
CollectionSchema.statics = {
	add :function(blogId){
		var _this = this,
  		p = new Promise();
	  _this.save({BlogId:blogId},function( err, data){
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

mongoose.model('Collection',CollectionSchema);