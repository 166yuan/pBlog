(function () {
	window.duoshuoQuery = {
    short_name: "siyuanda"
};
	var app = angular.module('app', ['ui.router','ngDuoshuo','ngFileUpload']);
	app.controller('IndexController', ['$scope','$http', function ($scope,$http) {
		$scope.showModal = $scope.showLogin = $scope.showRegister = $scope.isLogin = false;
		$scope.username = "";
		$scope.avatorUrl = "";
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
                    var userInfo = data.data.data;
                    sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
                    $scope.username = userInfo.nickname;
                    $scope.avatorUrl = userInfo.avatorUrl;
                    $scope.isLogin = true;
                    $scope.showModal = $scope.showLogin = false;
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
                	if(data.data.result){
                		$scope.showModal = $scope.showRegister = false;
                		$scope.$emit("showAlert","注册成功");
                	}
                })
			}else{
				$scope.$emit("showAlert","两次输入密码必须一致");
			}
			
		}

        $scope.logout = function ( ){
            $http.post("/user/logout").then(function (data){
                $scope.isLogin = false;
                sessionStorage.removeItem("userInfo");
                window.location.href = "/#/home";
            })
        }

        $scope.$on('showAlert', function(e, info) {
            $scope.$broadcast("com-alert",info);
        }); 
        $scope.$on('showInput', function(e, info) {
            $scope.$broadcast("com-input",info);
        });
        $scope.$on('successInput', function(e, info) {
            $scope.$broadcast("inputFinish",info);
        });  
        
	}]);

	app.controller('MainController', ['$scope','$http', function ($scope,$http) {
        //for personal
		$scope.articles = [];
        //for all
        $scope.allArticles = [];
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
            $http.get("/welcome").success(function(data){
                $scope.allArticles = data.data;
            });
		}
		$scope.init();
	}]);

	app.controller('publishController', ['$scope', '$http','$location',function ($scope,$http,$location) {

		$scope.category = [];
		$scope.publishData = {
			title:"",
			content:"",
			category:"",
			temp:"",
			tags:[]
		}
		var ue = UE.getEditor('ueditor', {
                autoHeightEnabled: true,
                autoFloatEnabled: true
            });
		$scope.init = function( ){
			$http.get("/category/all").success(function(data){
				console.log(data);
				$scope.category = data;
                $scope.publishData.category = data[0].id;
			});

			
		}
		$scope.refresh = function(){
			var target = document.getElementById('ueditor');
            if(target.tagName!=="DIV"){
            	window.location.reload();
            }else{
            		var editorData = localStorage.getItem("editArticle");
	            	if(editorData!="undefined"&&editorData!=null){
					editorData = JSON.parse(editorData);
					$scope.publishData.title = editorData.title;
					$scope.publishData.category = editorData.category;
					$scope.publishData.tags = editorData.tags;
					console.log($scope.publishData.title);
					/*ue.setContent(editorData.content);*/
				}
            }
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
                    $scope.$emit("showAlert","保存成功");
                    window.location.href ="#/article";
                }else{
                    $scope.$emit("showAlert","保存失败");
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
        	sessionStorage.setItem("showInput","publishController");
            $scope.$emit("showInput","新分类");
        }
		$scope.init();
		window.setTimeout(function(){
			$scope.refresh();
		},1000);
		$scope.$on("inputFinish",function(e ,info){
			console.log(info);
			if(sessionStorage.getItem("showInput")=="publishController"){
				sessionStorage.removeItem("showInput")
				$http.post("/category/add",{
				ctitle: info
			}).success(function(data){
				$scope.category.push(data);
			})
			}
			
		})
	}])

	app.controller('articleController', ['$scope','$http', function ($scope,$http) {
		$scope.articles= [];
		$scope.showEdit = false;
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
		$scope.triggerEditor = function () {
			$scope.showEdit = ($scope.showEdit == true?false:true);
		}
		$scope.edit = function (index,aid) {
			console.log($scope.articles[index]);
			localStorage.setItem("editArticle",JSON.stringify($scope.articles[index]));
			window.location.href ="#/publish";
		} 
		$scope.deleteById = function ( index,id ) {
			$http.post("blog/deleteById",{aid:id}).success(function(data){
				if(data.result==1){
					$scope.articles.splice(index,1);
					$scope.$emit("showAlert","删除成功");
				}else{
					$scope.$emit("showAlert","删除失败");
				}
			});
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

    app.controller('centerController', ['$scope','$http','Upload','$timeout',function ($scope,$http,Upload,$timeout) {
    	$scope.userInfo = "";
        $scope.previewing = false;
        $scope.file = {};
        $scope.files = [];
        var userInfo = sessionStorage.getItem("userInfo");
        if (userInfo&&userInfo!="") {
        	$scope.userInfo = JSON.parse(userInfo)
        }
        $scope.saveInfo = function ( ){
        	 console.log($scope.userInfo);
        	$http.post("/user/update",{user:$scope.userInfo}).success(function(){
        		$scope.$emit("showAlert","保存成功")
        		sessionStorage.setItem("userInfo",JSON.stringify($scope.userInfo));
        		$scope.username = $scope.userInfo.nickname;
		$scope.avatorUrl = $scope.userInfo.avatorUrl;
        	})
        }
        $scope.triggerUpload = function ( ) {
            var upload = document.getElementById('upload');
            upload.click();
        }
        $scope.uploadStart = function ( ) { 
            var submit = document.getElementById("submit"); 
            submit.click();
        }

          $scope.uploadPic = function(file) {
		    file.upload = Upload.upload({
		      url: '/upload',
		      data: {file: file}
		    });

		    file.upload.then(function (response) {
		      $timeout(function () {
		        file.result = response.data;
		       var newUrl = response.data;
		       $scope.userInfo.avatorUrl = newUrl;
		      });
		    }, function (response) {
		      if (response.status > 0)
		        $scope.errorMsg = response.status + ': ' + response.data;
		    }, function (evt) {
		      // Math.min is to fix IE which reports 200% sometimes
		      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		    }); 
     	}       

  		/*pic preview*/
        var ele = document.getElementById("upload");
        angular.element(ele).bind("change",function(e){
            var e = e || window.event;
            e.target = e.target || e.srcElement;
            var file = e.target.files[0];
            var img = document.getElementById("preview");
            var reader = new FileReader();
              reader.onload = function(evt){img.src = evt.target.result;}
              reader.readAsDataURL(file);
             img.style.display = "block";
        });

    }])

    app.controller('compoentCtrl', ['$scope', function ($scope) {
        $scope.compoentBox = false;
        $scope.alertBox = false;
        $scope.inputBox = false;
        $scope.info = "";
        $scope.inputTest="";
        $scope.confirm = function () {
            $scope.alertBox = false;
            $scope.compoentBox = false;
            $scope.$emit("successInput",this.inputTest);
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

         $scope.$on("com-input",function(e,info){
            $scope.compoentBox = true;
            $scope.info = info;
            $scope.inputBox = true;
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
        .state("center", {
            url:"/center",
            templateUrl: "tpl/center.html",
            controller: "centerController"
        })
  
});

})()
