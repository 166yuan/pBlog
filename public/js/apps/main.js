(function () {
	var app = angular.module('app', ['ui.router']);
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
                    console.log(data);
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
                })
			}else{
				alert("两次输入密码必须一致");
			}
			
		} 
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

	app.controller('publishController', ['$scope', function ($scope) {
		var ue = UE.getEditor('ueditor', {
                autoHeightEnabled: true,
                autoFloatEnabled: true
            });
		$scope.category = [{
			id:1,
			name:"我的日记"
		},{
			id:2,
			name:"专业技术"
		},{
			id:3,
			name:"学业教育"
		}];
		$scope.publishData = {
			title:"",
			content:"",
			category:"",
			temp:"",
			tags:[]
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
			console.log($scope.publishData);
		}
		$scope.reset = function(){
			for (prop in $scope.publishData) {
				if ($scope.publishData.hasOwnProperty(prop)) {
					$scope.publishData[prop] = "";
				}
				ue.setContent("请输入内容");
			}
		}
	}])

	app.controller('articleController', ['$scope', function ($scope) {
		$scope.articles= [];
    	$scope.pagination = {
    		currentPage:1,
    		totalPage:1,
    		pageSize:10,
    		endPage:1,
    		pages:[1]
    	}
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
		$scope.load = function(){
			console.log('load page');
		}
		$scope.loadPage = function(num ){
			console.log('load num page');
		} 
		$scope.init();
	}])

	app.controller('categoryController', ['$scope', function ($scope) {
		$scope.categorys = [{
			id:12,
			name: "学习"
		},{
			id:34,
			name: "生活"
		},{
			id:56,
			name: "娱乐"
		}];


	}])

    app.controller('collectionController', ['$scope', function ($scope) {
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
    }])

    app.controller('tagsController', ['$scope', function ($scope) {
        
    }])

    app.controller('aboutController', ['$scope', function ($scope) {
        
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
