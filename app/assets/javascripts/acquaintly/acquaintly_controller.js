var AppController = angular.module('AppController', []);

AppController.controller("AppCtrl", function($scope) {

    $scope.appName = "Acquaintly";

    $scope.testList = [1,2,3,4,5];
    
  })