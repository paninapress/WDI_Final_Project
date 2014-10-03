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
  var Group = $resource("/groups/:id", {id: "@id"});

  $scope.groups = Group.query();
  $scope.connections = Connection.query();

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
  $scope.categorizeCount = function(){
    var total = $scope.connections.length;
    var sum = 0;
    for (var i = 0; i < total; i++) {
      if ($scope.connections[i].category === null) {
        sum += 1;
      }
    }
    if (sum == 0 && total != 0){
      $('#categorize-btn').addClass('hide');
    }
    return sum + " / " + total;
  }
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
    $scope.groups = Group.query();
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


// START functions to get Percent/Status/Style of social health
// this is to calculate a percentage for the user
// on how well they're doing. Trying to get all Groups to 100%
  $scope.reversePercent = function(average){
    if (average === null){
      return 0;
    }
    else if (average >= 0){
      return (100 - (average * 100));
    }
    else {
      return 0;
    }
  };
  $scope.calcHealthStatus = function(average){
    if (average === null){
      return "none";
    }
    else if (average <= 0.3){
      return "GREAT";
    }
    else if (average <= 0.8){
      return "GOOD";
    }
    else if (average <= 1 ){
      return "OK";
    }
    else if (average > 1){
      return "You're in the DANGER ZONE!";
    }
    else{
      return "none";
    }
  };
  // Calculate div style based on health status
  $scope.changeStyle = function(health){
    if (health === null) {
      return "{background: 'white'}";
    }
    else if (health < 0.8){
      return "{background: '#89E818'}";
    }
    else if (health <= 1){
      return "{background: '#FFEB2C'}";
    }
    else if (health > 1 && health < 3){
      return "{background: '#4FB2FF'}";
    }
    else if (health >= 3){
      return "{background: 'lightgrey'}";
    }
    else {
      return "{background: 'white'}";
    }
  };
  var calcHealthBarWidth = function(health){
    var num = 0;
    var bar_width = 0;
    var div_width = $('.health-bar button').width();
    if (health <= 1){
      num = 1 - health;
    }
    else if (health >= 1 && health <= 2){
      num = health - 1;
    }
    else{
      num = 1;
    }
    bar_width = div_width * num;
    return bar_width;
  };
  $scope.changeHealthBar = function(health){
      if (health === null) {
        return "{background: 'white'}";
      }
      else{
        bar_width = calcHealthBarWidth(health);
        if (health < 0.8){
          return "{background: '#89E818', width:"+ bar_width +"}";
        }
        else if (health <= 1){
          return "{background: '#FFEB2C', width:"+ bar_width +"}";
        }
        else if (health > 1 && health < 3){
          return "{background: '#4FB2FF', width:"+ bar_width +"}";
        }
        else if (health >= 3){
          return "{background: 'lightgrey', width:"+ bar_width +"}";
        }
        else {
          return "{background: 'white'}";
        }
      }
    };
// This handles tab functionality
  $scope.contactSort = {category: null};
  $scope.query = {fullname: ""};
  $scope.makeTabActive = function(tab){
    $scope.query.fullname = "";
    if (tab == 0){
      $('#category-tab').removeClass('active');
      $('#all-tab').addClass('active');
    }
    else if (tab == 6){
      $('#category-tab').removeClass('active');
      $('#all-tab').removeClass('active');
      $('#multi-group-tab').addClass('active');
    }
    else {
        if (tab == 1){
          $scope.contactSort.category = "21";
        }
        else if (tab == 2){
          $scope.contactSort.category = "42";
        }
        else if (tab == 3){
          $scope.contactSort.category = "90";
        }
        else if (tab == 4){
          $scope.contactSort.category = "180";
        }
        else if (tab == 5){
          $scope.contactSort.category = "11";
        }
      $('#all-tab').removeClass('active');
      $('#multi-group-tab').removeClass('active');
      $('#category-tab').addClass('active');
    }
  };

  // for filtering on multi-group-tab
  $scope.g1 = {category: 21};
  $scope.g2 = {category: 42};
  $scope.g3 = {category: 90};
  $scope.g4 = {category: 180};

  // change category number to group number
  $scope.catToGroupNum = function(categoryNum){
    if (categoryNum == 21){
      return 1;
    }
    else if (categoryNum == 42){
      return 2;
    }
    else if (categoryNum == 90){
      return 3;
    }
    else if (categoryNum == 180){
      return 4;
    }
    else if (categoryNum == 11){
      return "none";
    }
  };
}]);
