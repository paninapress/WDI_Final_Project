var AppController = angular.module('AppController', []);

AppController.controller("AppCtrl",['$scope','$location','$anchorScroll', '$resource', function($scope, $location, $anchorScroll, $resource) {
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

    Connection = $resource('/connections/:id', {id: "@id"});

    $scope.connections = Connection.query();

    $scope.toBeCategorized = function(){

      for (i in $scope.connections) {
        noCategory = [];
        if ($scope.connections[i]['category'] === null || $scope.connections[i]['category'] === 0) {
          noCategory.push($scope.connections[i]);
        }
        noCategory[0]['category'] = 0;
        return noCategory;
      };
    };

    $scope.categorized = function(id, category) {
      // $scope.toBeCategorized[id]['category'] = category;
      // find the id of $scope.connections we're looking for
      // make custom route to custom method in ConnectionsController to update
      $http.put("/category/"+id+"/"+category);
    }

  }]);

// ng-show if category === 0
// upon iteration, category is set to 0
// if "Slip" is clicked, category goes to 5
// else, category is set to 1..4