var express = require('express');
var mongoose = require('mongoose');


var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/posts/', function(req , res){
	Post.find(function(err, posts){
		if(err){ return next(err);}
		res.json(posts);
	});
});

/* Load a post*/
router.get('/posts/:post', function(req , res){
req.post.populate('comments', function(){
	res.json(req.post);
	});
});
	

/*Used to load the post with the URL*/
router.param('post', function(req,res,next,id){
	var query = Post.findById(id, function(err, post){
		if(err){return next(err);}
		if(!post){ return next(new Error("Cant find post"));}
		req.post = new Post(post);
		return next();
	});
});

/*Create posts*/
router.post('/posts', function(req, res){
	console.log(req.body);
	var post = new Post(req.body);

	post.save(function(err, post){
		if(err){return next(err);}

		res.json(post);

	});
});


/*To upvote for a post*/
router.put('/posts/:post/upvote', function(req, res, next){
	console.log('Calling upvote at router');
	var condition = { _id : req.post._id };
	var options = {safe : false};
	var update = {$set : { votes : req.post.votes +1}};
	
	console.log("Called before update ");
	Post.update(condition,update,options,
		function(err, post){
		if(err){console.log(err); next(err);}
		res.json(post);
	});
});

/* Load a post*/
router.get('/posts/:post/comments/', function(req , res){
	/*Post.find(function(err, posts){
		if(err){ return next(err);}

		res.json(posts);
	});*/
res.json(req.comment);
});


/*Used to load the post with the URL
router.param('comment', function(req,res,next,id){
	var query = Comment.findById(id, function(err, comment){
		if(err){return next(err);}
		if(!comment){ return next(new Error("Cant find comments"));}
		req.comment = comment;
		return next();
	});
});




/*To create new cooments*/
router.post('/posts/:post/comments', function(req ,res ,next){
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment){
		if(err){ console.log(err);
			return next(err);}

		req.post.comments.push(comment);
		
		Post.update({_id:req.post._id}, { $set : {comments : req.post.comments} },function(err, post){
			if(err){ console.log(err); return next(err);}
			res.json(comment);
		});
	});
})

module.exports = router;
