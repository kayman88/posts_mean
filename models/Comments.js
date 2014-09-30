var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CommentSchema = new Schema({
	body: String,
	author: String,
	votes: {type: Number, default :0},
	post : {type: mongoose.Schema.Types.ObjectId, ref : 'Post'}
});

mongoose.model('Comment', CommentSchema);

console.log('comment shcema loaded');