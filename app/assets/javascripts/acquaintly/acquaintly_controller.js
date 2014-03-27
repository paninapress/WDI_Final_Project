var AppController = angular.module('AppController', []);

AppController.controller("AppCtrl",['$scope','$location','$anchorScroll', function($scope, $location, $anchorScroll) {
    // $http.get('/auth/linkedin/callback.json').then(function(response){
    //     $scope.data = response;
    //   });

    $scope.appName = "Acquaintly";

    $scope.scrollTo = function(id){
      $location.hash(id);
      $anchorScroll();
    };

    $scope.go = function(path){
      $location.path(path);
    };

    $scope.connections = [{first_name: 'Stephen', last_name: 'Bauer'},{first_name: 'Nina', last_name: 'Pacifico'}];


  }]);