/**
 User Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Promise = mongoose.Promise;

//define category scheme
var CategorySchema = new Schema({
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
	findByName:function(name){
		return this.find({cname:name}).exec();
	},
	findAll : function(){
		return this.find().exec();
	}
}

//create Model

mongoose.model('Category',CategorySchema);