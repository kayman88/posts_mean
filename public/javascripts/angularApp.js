angular.module('news',['ui.router'])
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
		$stateProvider.
		state('home',{
			url:'/home',
			templateUrl:'/home.html',
			controller:'main',
			resolve : { postPromise: ['posts', function(posts){
    		return posts.getAll();
  }]}
		}).
		state('posts', {
			url: '/posts/{id}',
			templateUrl : '/posts.html',
			controller: 'PostsCtrl',
			resolve: {
				post: ['$stateParams', 'posts', 
				function($stateParams,posts){
					return posts.get($stateParams.id);
				}]
			}
		});

		$urlRouterProvider.otherwise('home');
}])
.factory('posts', ['$http',function($http){
	var o ={
		posts : []
	};
	o.getAll = function(){
		return $http.get('/posts').success(function(data){
			angular.copy(data,o.posts);
		});
	};

	o.create = function(post){
		return $http.post('/posts',post).success(function(data){
			o.posts.push(data);
		});
	};

	o.upvote = function(post){
		return $http.put('/posts/'+post._id+ '/upvote')
		.success(function(data){
			post.votes+=1;
		}).error(function(data){
			alert('Something went very bad, please research a lot');
		});
	};

	o.get = function(id){
		return $http.get('/posts/'+id).then(function(res){
			return res.data;
		});
	};

	o.addComment = function(id, comment) {
  return $http.post('/posts/' + id + '/comments', comment);
};

o.upvoteComment = function(post, comment) {
  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
    .success(function(data){
      comment.upvotes += 1;
    });
};
	return o;
}])
.controller('main',[
	'$scope',
	'posts',
	 function($scope, posts){
	 	$scope.posts = posts.posts;
	 	$scope.newPost='';
 		$scope.addPost = function(){
 	if($scope.newPost === ''){ return; }
 	posts.create(
 		{title:$scope.newPost,
 		 votes:0,
 		 link: $scope.link
 		});
 	$scope.newPost='';
 	$scope.link= '';
 };
	 	$scope.upVote = function(post){
	 		posts.upvote(post);
	 	};
}]).
controller('PostsCtrl',[
'$scope',
'$stateParams',
'posts',
'post',
function($scope, $stateParams, posts, post){
	$scope.post =  post;//posts.posts[$stateParams.id];
	//$scope.post.comments= [{author:'Joe', body:'Cool', votes:0},
	//	{author:'Bobby', body:'CoolOldTerm', votes:10}];
	$scope.addComment = function(){
		if($scope.body === ''){return ;}
		posts.addComment(post._id, {
			body : $scope.body,
			author: 'guess'
		}).success(function(comment){
			$scope.post.comments.push(comment);
		});
		$scope.body = '';	
	};

	$scope.incrementUpvotes = function(comment){
  posts.upvoteComment(post, comment);
};
}]);

/*
.controller('main',[
'$scope',
function($scope){
 $scope.test = 'Hi there';
 $scope.posts = [
 {title:'My post 1', votes: 5},
 {title:'My post 2', votes: 6},
 {title:'My post 3', votes: 8, link:"http://google.com"},
 {title:'My post 4', votes: 2},
 {title:'My post 5', votes: 4}
 ];
 $scope.newPost='';
 $scope.addPost = function(){
 	if($scope.newPost === ''){ return; }
 	$scope.posts.push(
 		{title:$scope.newPost,
 		 votes:0,
 		 link: $scope.link
 		});
 	$scope.newPost='';
 	$scope.link= '';
 }

 $scope.upVote = function(post){
 	post.votes += 1;
 }
}]);
*/