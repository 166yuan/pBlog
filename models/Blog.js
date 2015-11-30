/**
Blog Model
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    Promise = mongoose.Promise;

//define user scheme
var BlogSchema = new Schema({
  	userId:String,
    title: String,
    content: String,
    category:String,
    tags: [String],
    viewNumber: { type:Number,default:0 },
    isHead: { type:Boolean,default:false },
    createTime: { type:Date ,default:Date.now },
    updateTime: { type:Date ,default:Date.now},
    isDelete: { type:Boolean ,default:false}
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

BlogSchema.statics = {
	findAll: function(){
		var _this = this,
		p = new Promise();
		_this.find({isDelete:false},function(err,data){
			if(err){
				p.reject(err,-1);
			}else{
				p.resolve(null,data);
			}
		});
		return p;
	},
  findAllByUser: function(uid){
    var _this = this,
    p = new Promise();
    _this.find({isDelete:false ,userId:uid},function(err,data){
      if(err){
        p.reject(err,-1);
      }else{
        p.resolve(null,data);
      }
    });
    return p;
  },
  findById: function(aid){
      var _this = this,
    p = new Promise();
    _this.findOne({_id:new Object(aid),isDelete:false},function(err,data){
      if(err){
        p.reject(err,-1);
      }else{
        p.resolve(null,data);
      }
    });
    return p;
  },
  findByCategory: function(cid,uid){
     var _this = this;
     p = new Promise();
     _this.find({category:cid,isDelete:false,userId:uid},function(err,data ){
        if (err) {
          p.reject(err,-1);
        }else {
          p.resolve(null,data);
        }
     });
     return p;
  },
  findByTag: function (tname,uid) {
    var _this = this;
     p = new Promise();
     _this.find({tags:tname,isDelete:false,userId:uid},function(err,data ){
        if (err) {
          p.reject(err,-1);
        }else {
          p.resolve(null,data);
        }
     });
     return p;
  },
  updateInfo: function(id,update){
       var _this = this,
       p = new Promise();
       _this.update({_id:id},update,{},function(err,docs){
        if(err){
          p.reject(err,-1);
        }else{
          p.resolve(null,1);
        }

      });
    return p;
  }
}

/**
*/

//create Model

mongoose.model('Blog',BlogSchema);