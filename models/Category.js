/**
 User Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Promise = mongoose.Promise;

//define category scheme
var CategorySchema = new Schema({
    userId:String,
  	ctitle:String,
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now}
    
});

CategorySchema.methods = {
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

CategorySchema.statics = {
	findByName:function(name,uid){
		return this.find({cname:name,userId:uid}).exec();
	},
	findAll : function(uid){
		return this.find({userId:uid}).exec();
	}
}

//create Model

mongoose.model('Category',CategorySchema);