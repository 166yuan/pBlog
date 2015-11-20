(function () {
	window.duoshuoQuery = {
    short_name: "siyuanda"
};
	var app = angular.module('app', ['ui.router','ngDuoshuo']);
	app.controller('IndexController', ['$scope','$http', function ($scope,$http) {
		$scope.showModal = $scope.showLogin = $scope.showRegister = false;
		$scope.loginData = {
			account: "",
			passwd : ""
		}
		$scope.registerData = {
			account: "",
			passwd: "",
			repasswd: ""
		}
		$scope.navMenu = [{
			src:"article",
			name:"文章"
		},{
			src:"category",
			name:"分类"
		},{
			src:"tags",
			name:"标签"
		},{
			src:"collection",
			name:"收藏"
		},{
			src:"about",
			name:"关于"
		}];
		$scope.triggerModal = function (index) {
			switch(index) {
				case 1:
				$scope.showModal = $scope.showLogin = true;	
					break;
				case 2:
				$scope.showModal = $scope.showRegister = true;	
					break;
				default:
				$scope.showModal = $scope.showRegister = $scope.showLogin = false;	
			}
		}
		$scope.login = function (){
			if($scope.loginData.account !="" && $scope.loginData.passwd !=""){
                $http.post("/user/login",$scope.loginData)
                .then(function (data){
                    alert(data.info);
                })
            }else{
                alert("账号密码必须填写");
            }
		}
		$scope.reset = function () {
			for (prop in $scope.loginData) {
				if ($scope.loginData.hasOwnProperty(prop)) {
					$scope.loginData[prop] = "";
				}
			}
			for (prop in $scope.registerData) {
				if ($scope.registerData.hasOwnProperty(prop)) {
					$scope.registerData[prop] = "";
				}
			}
		}
		$scope.register = function() {
			if($scope.registerData.passwd === $scope.registerData.repasswd){
				$http.post("/user/register",$scope.registerData).
                then(function (data){
                	console.log(data);
                    alert(data.data.info);
                })
			}else{
				alert("两次输入密码必须一致");
			}
			
		}

        $scope.$on('showAlert', function(e, info) {
            $scope.$broadcast("com-alert",info);
        }); 
	}]);

	app.controller('MainController', ['$scope', function ($scope) {
		$scope.username = "zoro";
		$scope.articles= [];
		$scope.userInfo = {};
		$scope.init = function(){
			$scope.articles = [{
				id:56,
				"title":"博克测试啊",
				date:"2015-04-05"
			},{
				id:78,
				"title":"阿瓦隆硬件",
				date:"2015-06-05"
			}];
		}
		$scope.init();
	}]);

	app.controller('publishController', ['$scope', '$http','$location',function ($scope,$http,$location) {
        console.log("execute");
		var ue = UE.getEditor('ueditor', {
                autoHeightEnabled: true,
                autoFloatEnabled: true
            });
		$scope.category = [];
		$scope.publishData = {
			title:"",
			content:"",
			category:"",
			temp:"",
			tags:[]
		}
		$scope.init = function( ){
			$http.get("/category/all").success(function(data){
				
				$scope.category = data;
                $scope.publishData.category = data[0].id;
			});
		}
		$scope.addTags= function(){
			if ($scope.publishData.temp !== "") {
				$scope.publishData.tags.push($scope.publishData.temp);
				$scope.publishData.temp = "";
			}else{
				alert("标签内容不能为空");
			}
		}

		$scope.removeTags = function( index){
			$scope.publishData.tags.splice(index,1);
		}
		$scope.publish = function(){
			$scope.publishData.content = ue.getContent();
			$http.post("/blog/publish",$scope.publishData).
			success(function(data){
				if(data.result==1){
                    alert("保存成功");
                    window.location.href ="#/article";
                }else{
                    alert("保存失败");
                }
			}).
			error(function(err){
				console.log(err);
			})
		}
		$scope.reset = function(){
			for (prop in $scope.publishData) {
				if ($scope.publishData.hasOwnProperty(prop)) {
					$scope.publishData[prop] = "";
				}
				ue.setContent("请输入内容");
			}
		}
        $scope.newCate = function(){
            $scope.$emit("showAlert","保存成功");
        }
		$scope.init();
	}])

	app.controller('articleController', ['$scope','$http', function ($scope,$http) {
		$scope.articles= [];
    	$scope.pagination = {
    		currentPage:1,
    		totalPage:1,
    		pageSize:10,
    		endPage:1,
    		pages:[1]
    	}
		$scope.init = function(){
			$http.get("blog/getAll").success(function(data){
				if(data.result==1){
					$scope.articles = data.data;
				}else{
					alert("failure");
				}
			});

		}
		$scope.load = function(){
			console.log('load page');
		}
		$scope.loadPage = function(num ){
			console.log('load num page');
		} 
		$scope.init();
	}])

	app.controller('categoryController', ['$scope', "$http",function ($scope,$http) {
		$scope.categorys = [];
		$scope.blogs = [];
		$scope.ctitle = "";
		$scope.showInput = false;
		$scope.newCollection = "";
		$http.get("/category/all").success(function(data){
				$scope.categorys = data;
		});
		
		$scope.addTest = function (){
			$http.get("/category/test").success(function ( data){
				console.log(data);
			});
		}

		$scope.addNew = function ( ) {
			console.log($scope.newCollection);
			$http.post("/category/add",{ctitle:$scope.newCollection}).success(function(data){
				if(data){
					alert("添加成功");
					window.location.reload();
				}
			});
		}
		$scope.triggerEditor = function(){
			$scope.showInput = $scope.showInput==true?false:true;
		}

		$scope.findById = function(cid,name){
			$http.post("/category/getArticleByCate",{cid:cid}).success(function(data){
				$scope.blogs = data;
				$scope.ctitle = name;
			});
		}
	}])

    app.controller('collectionController', ['$scope', '$http',function ($scope,$http) {
        $scope.collection = [{
            articleId:234,
            createTime:new Date(),
            title:"如何学习js"
        },{
            articleId:456,
            createTime:new Date(),
            title:"node 即学即会"
        },{
            articleId:789,
            createTime:new Date(),
            title:"angular 和 avalon 哪个更好？"
        }];

        $scope.cancelCollection = function (index,Id){
            /* here delete index by ID*/
            if(confirm("确定要取消关注?")){
                $scope.collection.splice(index,1);
            }
            
        }

        $http.get("/collection/getAll");
    }])

    app.controller('tagsController', ['$scope','$http', function ($scope,$http) {
        $scope.tags=[];
        $scope.blogs = [];
        $http.get("/tag/getAll").success(function(data){
        	console.log(data);
        	$scope.tags = data;
        });
        $scope.findByTag = function (name) {
        	$http.post("/tag/getArticleBytag",{tname:name}).success(function(data){
        		if(data.result==1){
        			$scope.blogs = data.data;
        		}else{
        			alert("查询文章失败");
        		}
        		
        	});
        }
    }])

    app.controller('detailController', ['$scope','$stateParams', "$http","$sce",function ($scope,$stateParams,$http,$sce) {
        $scope.article = {};
        var aid = $stateParams.articleId;
        $http.post("/blog/getById",{aid:aid}).success(function(data){
        	if(data.result===1){
        		$scope.article = data.data;
        		$scope.article.content = $sce.trustAsHtml(data.data.content);
        	}else{
        		alert("fail to get blog");
        	}
        });
        $scope.addCollection = function(id){
        	$http.post("/collection/add",{blogId:id}).success(function( data){
        			console.log('success add');
        	});
        }
    }])
    app.controller('aboutController', ['$scope', function ($scope) {
        
    }])

    app.controller('compoentCtrl', ['$scope', function ($scope) {
        $scope.compoentBox = false;
        $scope.alertBox = false;
        $scope.inputBox = false;
        $scope.info = "";
        $scope.showInput = function ( ) {
            
        }
        $scope.confirm = function () {
            $scope.alertBox = false;
            $scope.compoentBox = false;
        }
        $scope.cancel = function () {
            $scope.compoentBox = false;
        }
        /*事件监听区域*/
        $scope.$on("com-alert",function(e,info){
            $scope.compoentBox = true;
            $scope.info = info;
            $scope.alertBox = true;
        });

    }])
	app.config(function ($stateProvider, $urlRouterProvider) {
 
     $urlRouterProvider.when("", "/home");
 
     $stateProvider
        .state("home", {
            url: "/home",
            templateUrl: "tpl/list.html",
            controller: "MainController"
        })
        .state("publish", {
            url:"/publish",
            templateUrl: "tpl/publish.html",
            controller: "publishController"
        })
        .state("article", {
            url:"/article",
            templateUrl: "tpl/article.html",
            controller: "articleController"
        })
        .state("adetail", {
            url:"/article/{articleId}",
            templateUrl: "tpl/adetail.html",
            controller: "detailController"
        })
        .state("category", {
            url:"/category",
            templateUrl: "tpl/category.html",
            controller: "categoryController"
        })
        .state("tags", {
            url:"/tags",
            templateUrl: "tpl/tags.html",
            controller: "tagsController"
        })
        .state("collection", {
            url:"/collection",
            templateUrl: "tpl/collection.html",
            controller: "collectionController"
        })
        .state("about", {
            url:"/about",
            templateUrl: "tpl/about.html",
            controller: "aboutController"
        })
  
});

})()
