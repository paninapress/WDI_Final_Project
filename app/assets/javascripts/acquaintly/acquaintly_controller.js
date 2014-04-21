var AppController = angular.module("AppController", []);

AppController.controller("AppCtrl",["$scope","$location","$anchorScroll", "$resource", function($scope, $location, $anchorScroll, $resource) {

  $scope.appName = "Acquaintly";

  $scope.scrollTo = function(id){
    $location.hash(id);
    $anchorScroll();
  };

  $scope.go = function(path){
    $location.path(path);
  };

  var Connection = $resource("/connections/:id", {id: "@id"}, {update: {method: "PUT"}});
  var Log = $resource("/connections/:connection_id/logs/:id");
  
  $scope.connections = Connection.query(function(successResponse){$scope.sortGroup(successResponse);});

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
    $scope.sortGroup($scope.connections);
  };

  $scope.createLog = function(contact) {
    Log.save({connection_id:contact.info.connection_id}, {log: {source: $scope.newLog.source, comment: $scope.newLog.comment, date: $scope.newLog.date}}, function(successResponse){$scope.updateConnection(contact, successResponse, $scope.connections.indexOf(contact));});
  };

  $scope.removeLog = function(contact, log_id) {
    Log.remove({connection_id:contact.info.connection_id, id: log_id}, function(successResponse){$scope.updateConnection(contact, successResponse, $scope.connections.indexOf(contact));});
  };

  $scope.categorize = false;

  $scope.templates = [ {name: "categorize.html", url: "/templates/categorize.html"}];

// START functions to get average/overall social health
  // Choosing to include contacts in this hash because we can use
  // them later for the queue/recommender feature
  $scope.groupOne = {contacts: [], averageHealth: null};
  $scope.groupTwo = {contacts: [], averageHealth: null};
  $scope.groupThree = {contacts: [], averageHealth: null};
  $scope.groupFour = {contacts: [], averageHealth: null};
  $scope.overallHealth = null;
  $scope.sortGroup = function(connectionsArray){
      var g1 = {sum: null, count: null};
      var g2 = {sum: null, count: null};
      var g3 = {sum: null, count: null};
      var g4 = {sum: null, count: null};
      angular.forEach(connectionsArray, function(contact){
        if (contact.info.category === 21 && contact.c_health){
          $scope.groupOne.contacts = contact;
          g1.sum += contact.c_health;
          g1.count += 1;
        }
      else if (contact.info.category === 42 && contact.c_health){
          $scope.groupTwo.contacts = contact;
          g2.sum += contact.c_health;
          g2.count += 1;
        }
      else if (contact.info.category === 90 && contact.c_health){
          $scope.groupThree.contacts = contact;
          g3.sum += contact.c_health;
          g3.count += 1;
        }
      else if (contact.info.category === 180 && contact.c_health){
          $scope.groupFour.contacts = contact;
          g4.sum += contact.c_health;
          g4.count += 1;
        }
      });
      calcGroupAverages(g1, g2, g3, g4);
      calcOverallAverage(g1, g2, g3, g4);
    };
  var calcGroupAverages = function(g1, g2, g3, g4){
    $scope.groupOne.averageHealth = g1.sum / g1.count;
    $scope.groupTwo.averageHealth = g2.sum / g2.count;
    $scope.groupThree.averageHealth = g3.sum / g3.count;
    $scope.groupFour.averageHealth = g4.sum / g4.count;
  };
  // calcOverallAverage is separate func becuase 
  // the groups are weighted differently: g1 is 2x of g2 
  // then g2 is 2x of g3 and so on...
  var calcOverallAverage = function(g1, g2, g3, g4){
    var allGroupSum = null;
    var allGroupCount = null;
    
    allGroupSum += (g1.sum * Math.pow(2,3)); //g1 weighted 2*2*2
    allGroupSum += (g2.sum * Math.pow(2,2)); //g2 weighted 2*2
    allGroupSum += (g3.sum * 2); //g3 weighted double 
    allGroupSum += g4.sum;

    allGroupCount += (g1.count * Math.pow(2,3));
    allGroupCount += (g2.count * Math.pow(2,2));
    allGroupCount += (g3.count * 2);
    allGroupCount += g4.count;
    
    $scope.overallHealth = allGroupSum / allGroupCount;
  };
  // this is a function to calculate a percentage for the user
  // on how well they're doing. Trying to get all Groups to 100%
  // rather than how we use the numbers where lower is better
  $scope.reversePercent = function(average){
    if (average > 0){
      console.log((100 - (average * 100)));
      return (100 - (average * 100));
    }
    else {
      return 0;
    }
  };
  var calcHealthStatus = function(average){
    if (average <= 0.2){
      return "GREAT";
    }
    else if (average <= 0.5){
      return "GOOD";
    }
    else if (average <= 1 ){
      return "OK";
    }
    else if (average > 1){
      return "You're in the DANGER ZONE!";
    }
    else{
      return "n/a";
    }
  };
  // Calculate div style based on health status
  $scope.changeStyle = function(health){
    if (health < 0.8){
      return "{background: 'green'}";
    }
    else if (health <= 1){
      return "{background: 'orange'}";
    }
    else if (health > 1){
      return "{background: 'red'}";
    }
    else if (health > 2){
      return "{background: 'grey'}";
    }
    else {
      return "{background: 'white'}";
    }
  };
}]);
