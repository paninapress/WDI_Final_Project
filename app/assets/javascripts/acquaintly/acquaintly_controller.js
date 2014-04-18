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
      $scope.noCategory = [];
      for (var i = 0; i < $scope.connections.length; i++) {
        if ($scope.connections[i].info.category === null) {
          var connection = {data: $scope.connections[i], index: i};
          $scope.noCategory.push(connection);
        } 
      }
      if ($scope.categorize === false) {
        $scope.categorize = true;
        $scope.allContacts = false;
      } else {
        $scope.categorize = false;
        $scope.allContacts = true;
      }
    };

    $scope.categorized = function(contact, cat, index) {
      Connection.update({id: contact.info.connection_id}, {category: cat}, function(successResponse){$scope.updateConnection(contact, successResponse, index);});
      $scope.noCategory.shift();
    };

    $scope.updateConnection = function(connection, data, index) {
      $scope.connections[index] = data.response;
      $scope.thisContact = data.response;
    };

    $scope.createLog = function(contact) {
      Log.save({connection_id:contact.info.connection_id}, {log: {source: $scope.newLog.source, comment: $scope.newLog.comment, date: $scope.newLog.date}}, function(successResponse){$scope.updateConnection(contact, successResponse, $scope.connections.indexOf(contact));});
    };

    $scope.removeLog = function(contact, log_id) {
      Log.remove({connection_id:contact.info.connection_id, id: log_id}, function(successResponse){$scope.updateConnection(contact, successResponse, $scope.connections.indexOf(contact));})
    };

    $scope.categorize = false;

    $scope.templates = [ {name: "categorize.html", url: "/templates/categorize.html"}];

    $scope.groupOne = [];
    $scope.groupTwo = [];
    $scope.groupThree = [];
    $scope.groupFour = [];
    $scope.categoryArrSort = function(){
        angular.forEach($scope.connections, function(contact){
        if (contact.info.category === 21){
          $scope.groupOne.push(contact);
        }
        else if (contact.info.category === 42){
          $scope.groupTwo.push(contact)
        }
        else if (contact.info.category === 90){
          $scope.groupThree.push(contact)
        }
        else if (contact.info.category === 180){
          $scope.groupFour.push(contact)
        }
      })
        console.log($scope.groupFour);
    };
}]);
