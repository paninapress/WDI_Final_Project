var AppController = angular.module('AppController', []);

AppController.controller("AppCtrl",['$scope','$location','$anchorScroll', '$resource', function($scope, $location, $anchorScroll, $resource, connections) {

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
    
    // $scope.connections = Connection.get();
    // $scope.conns = connections;
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

    // $scope.noCategory = [];

    $scope.categorize = false;

    $scope.toBeCategorized = function(){
      $scope.noCategory = [];
      for (var i = 0; i < $scope.connections.length; i++) {
        if ($scope.connections[i].info.category === null || $scope.connections[i].info.category === 0) {
          $scope.noCategory.push($scope.connections[i]);
        } else {
          $scope.noCategory.push(false);
        }
      }
      // $scope.noCategory[0].info.category = 0;
      if ($scope.categorize === false) {
        $scope.categorize = true;
      } else {
        $scope.categorize = false;
      };
      // return $scope.noCategory;

    };

    $scope.categorizeOff = function(){$scope.categorize = false;};

    $scope.categorized = function(contact, cat) {
      Connection.update({id: contact.info.connection_id}, {category: cat});
      // $http.put("/connections/"+contact.connection_id+"", {category: cat}).success(function(){console.log("Updated");});
      // Connection.put({id: contact.connection_id}, {category: cat});
      // Connection.update({id: $id}, conn);
      // $scope.connections[index + 1]['category'] = 0;
      $scope.noCategory.shift();
      while ($scope.noCategory[0] !== false) {
        $scope.noCategory.shift();
      }
      // $scope.connections[] = Connection.get({id: contact.info.connection_id})
      // $scope.noCategory[0].info.category = 0;
    };

    $scope.createLog = function(contact) {
      console.log("Creating...");
      console.log(contact);
      var createdLog = {};
      Log.save({connection_id:contact.info.connection_id}, {source: $scope.newLog.source}, function(successResponse){$scope.createComment(successResponse, $scope.newLog.comment)});
      // if ($scope.newLog.comment) {
      // }
    };

    $scope.createComment = function(data, comment) {
      Comment.save({connection_id:data.response.connection_id, log_id:data.response.id}, {comment: comment}, function(){console.log("comment saved!");});
      console.log("hit the createComment function with:");
      console.log(data);
    }

    $scope.templates = [ {name: "categorize.html", url: "/templates/categorize.html"}];
    $scope.template = $scope.templates[0];
}]);

// ng-show if category === 0
// upon iteration, category is set to 0
// if "Skip" is clicked, category goes to 5
// else, category is set to 1..4


AppController.resolve = {
  connections: function($q, $http) {
    var deferred = $q.defer();
    $http.get("/connections").
      success(function(successData) {
        deferred.resolve(successData);
      }).
      error(function(errorData){
        deferred.resolve("Error");
      });
    return deferred.promise;
  }
};
