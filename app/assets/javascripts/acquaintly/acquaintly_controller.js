var AppController = angular.module('AppController', []);

AppController.controller("AppCtrl",['$scope','$location','$anchorScroll', '$resource', function($scope, $location, $anchorScroll, $resource) {

    $scope.appName = "Acquaintly";

    $scope.scrollTo = function(id){
      $location.hash(id);
      $anchorScroll();
    };

    $scope.go = function(path){
      $location.path(path);
    };

    Connection = $resource('/connections/:id', {id: "@id"}, {update: {method: "PUT"}});
    Log = $resource('/connections/:connection_id/logs/:id');
    Comment = $resource('/connections/:connection_id/logs/:log_id/comments/:id');
    
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

    $scope.categorize = false;

    $scope.toBeCategorized = function(){
      $scope.noCategory = [];
      for (var i = 0; i < $scope.connections.length; i++) {
        if ($scope.connections[i].info.category === null) {
          var connection = {data: $scope.connections[i], index: i};
          $scope.noCategory.push(connection);
        } 
      }
      if ($scope.categorize === false) {
        $scope.categorize = true;
      } else {
        $scope.categorize = false;
      };
    };

    $scope.categorized = function(contact, cat, index) {
      Connection.update({id: contact.info.connection_id}, {category: cat}, function(successResponse){$scope.updateConnection(contact, successResponse, index)});
      $scope.noCategory.shift();
    };

    $scope.updateConnection = function(connection, data, index) {
      $scope.connections[index] = data.response;
    };

    $scope.createLog = function(contact) {
      console.log("Creating...");
      console.log(contact);
      var createdLog = {};
      Log.save({connection_id:contact.info.connection_id}, {source: $scope.newLog.source}, function(successResponse){$scope.createComment(successResponse, $scope.newLog.comment)});
    };

    $scope.createComment = function(data, comment) {
      Comment.save({connection_id:data.response.connection_id, log_id:data.response.id}, {comment: comment}, function(){console.log("comment saved!");});
      console.log("hit the createComment function with:");
      console.log(data);
    }

    $scope.templates = [ {name: "categorize.html", url: "/templates/categorize.html"}];
}]);
