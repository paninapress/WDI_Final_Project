var AppController = angular.module('AppController', []);

AppController.controller("AppCtrl",['$scope','$location','$anchorScroll', function($scope, $location, $anchorScroll) {

    $scope.appName = "Acquaintly";

    $scope.scrollTo = function(id){
      $location.hash(id);
      $anchorScroll();
    };
    $scope.go = function(path){
      $location.path(path);
    };

  }]);