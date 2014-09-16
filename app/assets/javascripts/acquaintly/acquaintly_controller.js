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
    getCategoryMessage(contact);
  };

  //click the back button to view the list again
  $scope.allShow = function(){
    $scope.allContacts = true;
    if (angular.isDefined($scope.query)) {
      $scope.query.fullname = "";
    }
  };

  $scope.categoryMessage = "";

  var getCategoryMessage = function(contact) {
    if (contact.category === null) {
      $scope.categoryMessage = "Uncategorized";
    }
    else if (contact.category === 11) {
      $scope.categoryMessage = ("Current category: None");
    }
    else {
      $scope.categoryMessage = ("Current category: " + contact.category + " days");
    }
    return $scope.categoryMessage;
  };

  $scope.toBeCategorized = function(){
    $scope.noCategory = [];
    for (var i = 0; i < $scope.connections.length; i++) {
      if ($scope.connections[i].category === null) {
        $scope.noCategory.push($scope.connections[i]);
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

  $scope.categorized = function(contact, cat, list) {
    Connection.update({id: contact.id}, {category: cat}, function(successResponse){$scope.updateConnection(successResponse, $scope.connections.indexOf(contact));});
    if (list === true) {
      $scope.noCategory.shift();
    }
  };

  $scope.updateConnection = function(data, index) {
    $scope.connections[index] = data;
    $scope.thisContact = data;
    getCategoryMessage(data);
    $scope.sortGroup($scope.connections);
    if (angular.isDefined($scope.newLog)) {
      $scope.newLog.comment = "";
    }
  };

  $scope.createLog = function(contact) {
    if (angular.isUndefined($scope.newLog)){$scope.newLog = {source: ""};};
    Log.save({connection_id:contact.id}, {log: {source: $scope.newLog.source, comment: $scope.newLog.comment, date: $scope.newLog.date}}, function(successResponse){$scope.updateConnection(successResponse, $scope.connections.indexOf(contact));});
  };

  $scope.removeLog = function(contact, log_id) {
    Log.remove({connection_id:contact.id, id: log_id}, function(successResponse){$scope.updateConnection(successResponse, $scope.connections.indexOf(contact));});
  };

  $scope.categorize = false;

  $scope.templates = [ {name: "categorize.html", url: "/templates/categorize.html"}];

// START functions to get average/overall social health
  // Choosing to include contacts in this hash because we can use
  // them later for the queue/recommender feature
  // $scope.groupOne = {contacts: [], average: null, percentage: null, status: null};
  // $scope.groupTwo = {contacts: [], average: null, percentage: null, status: null};
  // $scope.groupThree = {contacts: [], average: null, percentage: null, status: null};
  // $scope.groupFour = {contacts: [], average: null, percentage: null, status: null};
  // $scope.overallHealth = {average: null, percentage: null, status: null};
  // $scope.sortGroup = function(connectionsArray){
  //     $scope.groupOne.contacts = [];
  //     $scope.groupTwo.contacts = [];
  //     $scope.groupThree.contacts = [];
  //     $scope.groupFour.contacts = [];
  //     var g1 = {sum: 0.0, count: 0};
  //     var g2 = {sum: 0.0, count: 0};
  //     var g3 = {sum: 0.0, count: 0};
  //     var g4 = {sum: 0.0, count: 0};
  //     angular.forEach(connectionsArray, function(contact){
  //       if(contact.health !== null){
  //         if (contact.category === 21 && contact.health >= 0){
  //             $scope.groupOne.contacts.push(contact);
  //             g1.sum += contact.health;
  //             g1.count += 1;
  //         }
  //         else if (contact.category === 42 && contact.health >= 0){
  //             $scope.groupTwo.contacts.push(contact);
  //             g2.sum += contact.health;
  //             g2.count += 1;
  //         }
  //         else if (contact.category === 90 && contact.health >= 0){
  //             $scope.groupThree.contacts.push(contact);
  //             g3.sum += contact.health;
  //             g3.count += 1;
  //         }
  //         else if (contact.category === 180 && contact.health >= 0){
  //             $scope.groupFour.contacts.push(contact);
  //             g4.sum += contact.health;
  //             g4.count += 1;
  //         }
  //       };
  //     });
  //     calcGroupAverages(g1, g2, g3, g4);
  //     calcOverallHealth(g1, g2, g3, g4);
  //   };
  // var calcGroupAverages = function(g1, g2, g3, g4){
  //   $scope.groupOne.average = g1.sum / g1.count;
  //   $scope.groupTwo.average = g2.sum / g2.count;
  //   $scope.groupThree.average = g3.sum / g3.count;
  //   $scope.groupFour.average = g4.sum / g4.count;
  //   calcGroupPercentages();
  //   calcGroupStatuses();
  // };
  // // calcOverallHealth is separate func becuase 
  // // the groups are weighted differently: g1 is 2x of g2 
  // // then g2 is 2x of g3 and so on...
  // var calcOverallHealth = function(g1, g2, g3, g4){
  //   var allGroupSum = null;
  //   var allGroupCount = null;
  //   var average = null;
    
  //   allGroupSum += (g1.sum * Math.pow(2,3)); //g1 weighted 2*2*2
  //   allGroupSum += (g2.sum * Math.pow(2,2)); //g2 weighted 2*2
  //   allGroupSum += (g3.sum * 2); //g3 weighted double
  //   allGroupSum += g4.sum;

  //   allGroupCount += (g1.count * Math.pow(2,3));
  //   allGroupCount += (g2.count * Math.pow(2,2));
  //   allGroupCount += (g3.count * 2);
  //   allGroupCount += g4.count;
    
  //   average = allGroupSum / allGroupCount;
  //   $scope.overallHealth.average = average;
  //   $scope.overallHealth.percentage =reversePercent(average);
  //   $scope.overallHealth.status = calcHealthStatus(average);
  // };
  //   this is to calculate a percentage for the user
  //   on how well they're doing. Trying to get all Groups to 100%
  // var calcGroupPercentages = function(){
  //   $scope.groupOne.percentage = reversePercent($scope.groupOne.average);
  //   $scope.groupTwo.percentage = reversePercent($scope.groupTwo.average);
  //   $scope.groupThree.percentage = reversePercent($scope.groupThree.average);
  //   $scope.groupFour.percentage = reversePercent($scope.groupFour.average);
  // };
  // var calcGroupStatuses = function(){
  //   $scope.groupOne.status = calcHealthStatus($scope.groupOne.average);
  //   $scope.groupTwo.status = calcHealthStatus($scope.groupTwo.average);
  //   $scope.groupThree.status = calcHealthStatus($scope.groupThree.average);
  //   $scope.groupFour.status = calcHealthStatus($scope.groupFour.average);
  // };
  // // this is a function to calculate a percentage for the user
  // // on how well they're doing. Trying to get all Groups to 100%
  // // rather than how we use the numbers where lower is better
  // var reversePercent = function(average){
  //   if (average >= 0){
  //     return (100 - (average * 100));
  //   }
  //   else {
  //     return 0;
  //   }
  // };
  // var calcHealthStatus = function(average){
  //   if (average <= 0.2){
  //     return "GREAT";
  //   }
  //   else if (average <= 0.5){
  //     return "GOOD";
  //   }
  //   else if (average <= 1 ){
  //     return "OK";
  //   }
  //   else if (average > 1){
  //     return "You're in the DANGER ZONE!";
  //   }
  //   else{
  //     return "none";
  //   }
  // };
  // // Calculate div style based on health status
  // $scope.changeStyle = function(health){
  //   if (health === null) {
  //     return "{background: white}";
  //   }
  //   else if (health < 0.8){
  //     return "{background: 'green'}";
  //   }
  //   else if (health <= 1){
  //     return "{background: 'orange'}";
  //   }
  //   else if (health > 1){
  //     return "{background: 'red'}";
  //   }
  //   else if (health > 2){
  //     return "{background: 'grey'}";
  //   }
  //   else {
  //     return "{background: 'white'}";
  //   }
  // };
}]);
