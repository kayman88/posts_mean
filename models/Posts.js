var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	_id : {select : false},
	title: String,
	link: String,
	votes:{type: Number, default: 0},
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});



/*PostSchema.methods.upvote = function(cb){
	console.log('Calling upvote at model');
	var updateable = this.toObject();
	delete updateable["_id"];
	updateable["votes"] = this.votes +1;
	console.log('Updateable object '+ updateable["votes"]);
	var condition = { _id : this._id };
	var options = {safe : false};
	
	console.log("Called before update ");
	PostSchema.update(condition,updateable,options,cb);
}*/

mongoose.model('Post', PostSchema);


console.log('post shcema loaded');
