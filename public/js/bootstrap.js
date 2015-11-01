define(["angular","angular-route"],function(){
	var app = angular.module('mainModule', ["ui.router"]);
	app.controller('MainController', ['$scope', function ($scope) {
		$scope.user = "yes";
	}])

	
})