var AppController = angular.module('AppController', []);

AppController.controller("AppCtrl",['$scope','$location','$anchorScroll', '$resource', '$timeout', function($scope, $location, $anchorScroll, $resource, $timeout) {
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

    Connection = $resource('/connections/:id', {id: "@id"}, {update: {method: "PUT"}});

    $scope.connections = Connection.query();


    //allows all contacts to show
    $scope.allContacts = true;

    //click on a contact and will hide list 
    //and show that contact's info
    $scope.contactShow = function(contact){
      $scope.allContacts = false;
      $scope.thisContact = contact;
    };

    //click the back button to view the list again
    $scope.allShow = function(){
      $scope.allContacts = true;
    };

    $scope.toBeCategorized = function(){
      var noCategory = [];
      for (i in $scope.connections) {
        if ($scope.connections[i].info.category === null || $scope.connections[i].info.category === 0) {
          noCategory.push($scope.connections[i]);
        };
      }
      noCategory[0].info.category = 0;
      return noCategory;
    };

    $scope.categorized = function(contact, index, cat) {
      contact.$update({category: cat, id: contact.connection_id});
      // Connection.update({id: $id}, conn);
      // $scope.connections[index + 1]['category'] = 0;
    };

}]);

// ng-show if category === 0
// upon iteration, category is set to 0
// if "Skip" is clicked, category goes to 5
// else, category is set to 1..4
