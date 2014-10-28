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
  $scope.predicate = 'health';
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
  var gradientColors = {80: 'rgb(69,195,0)', 
                        81: 'rgb(77,197,2)',
                        82: 'rgb(84,199,4)',
                        83: 'rgb(94,201,6)',
                        84: 'rgb(102,202,8)',
                        85: 'rgb(110,204,10)',
                        86: 'rgb(112,206,12)',
                        87: 'rgb(129,208,14)',
                        88: 'rgb(137,210,16)',
                        89: 'rgb(144,211,18)',
                        90: 'rgb(156,214,20)',
                        91: 'rgb(162,215,22)',
                        92: 'rgb(170,217,24)',
                        93: 'rgb(179,219,26)',
                        94: 'rgb(189,221,28)',
                        95: 'rgb(194,222,30)',
                        96: 'rgb(202,224,32)',
                        97: 'rgb(213,226,34)',
                        98: 'rgb(223,228,36)',
                        99: 'rgb(232,230,38)',
                        100: 'rgb(236,231,40)',
                        101: 'rgb(221,228,48)',
                        102: 'rgb(209,226,59)',
                        103: 'rgb(196,224,71)',
                        104: 'rgb(184,222,83)',
                        105: 'rgb(173,220,92)',
                        106: 'rgb(162,218,102)',
                        107: 'rgb(151,216,114)',
                        108: 'rgb(138,214,126)',
                        109: 'rgb(127,212,135)',
                        110: 'rgb(117,210,145)',
                        111: 'rgb(103,208, 159)',
                        112: 'rgb(93,206,16)',
                        113: 'rgb(83,204,176)',
                        114: 'rgb(71,202,189)',
                        115: 'rgb(59,200,200)',
                        116: 'rgb(48,198,210)',
                        117: 'rgb(36,196,222)',
                        118: 'rgb(24,194,232)',
                        119: 'rgb(13,192,242)',
                        120: 'rgb(0,190,255)'};
  // Calculate div style based on health status
  $scope.changeStyle = function(health){
    if (health === null) {
      return "{background: 'white'}";
    }
    else if (health <= 0.8){
      return "{background: '"+ gradientColors[80]+ "'}";
    }
    else if (health <= 0.81){
      return "{background: '"+ gradientColors[81]+ "'}";
    }
    else if (health <= 0.82){
      return "{background: '"+ gradientColors[82]+ "'}";
    }
    else if (health <= 0.83){
      return "{background: '"+ gradientColors[83]+ "'}";
    }
    else if (health <= 0.84){
      return "{background: '"+ gradientColors[84]+ "'}";
    }
    else if (health <= 0.85){
      return "{background: '"+ gradientColors[85]+ "'}";
    }
    else if (health <= 0.86){
      return "{background: '"+ gradientColors[86]+ "'}";
    }
    else if (health <= 0.87){
      return "{background: '"+ gradientColors[87]+ "'}";
    }
    else if (health <= 0.88){
      return "{background: '"+ gradientColors[88]+ "'}";
    }
    else if (health <= 0.89){
      return "{background: '"+ gradientColors[89]+ "'}";
    }
    else if (health <= 0.90){
      return "{background: '"+ gradientColors[90]+ "'}";
    }
    else if (health <= 0.91){
      return "{background: '"+ gradientColors[91]+ "'}";
    }
    else if (health <= 0.92){
      return "{background: '"+ gradientColors[92]+ "'}";
    }
    else if (health <= 0.93){
      return "{background: '"+ gradientColors[93]+ "'}";
    }
    else if (health <= 0.94){
      return "{background: '"+ gradientColors[94]+ "'}";
    }
    else if (health <= 0.95){
      return "{background: '"+ gradientColors[95]+ "'}";
    }
    else if (health <= 0.96){
      return "{background: '"+ gradientColors[96]+ "'}";
    }
    else if (health <= 0.97){
      return "{background: '"+ gradientColors[97]+ "'}";
    }
    else if (health <= 0.98){
      return "{background: '"+ gradientColors[98]+ "'}";
    }
    else if (health <= 0.99){
      return "{background: '"+ gradientColors[99]+ "'}";
    }
    else if (health <= 1){
      return "{background: '"+ gradientColors[100]+ "'}";
    }
    else if (health <= 1.01){
      return "{background: '"+ gradientColors[101]+ "'}";
    }
    else if (health <= 1.02){
      return "{background: '"+ gradientColors[102]+ "'}";
    }
    else if (health <= 1.03){
      return "{background: '"+ gradientColors[103]+ "'}";
    }
    else if (health <= 1.04){
      return "{background: '"+ gradientColors[104]+ "'}";
    }
    else if (health <= 1.05){
      return "{background: '"+ gradientColors[105]+ "'}";
    }
    else if (health <= 1.06){
      return "{background: '"+ gradientColors[106]+ "'}";
    }
    else if (health <= 1.07){
      return "{background: '"+ gradientColors[107]+ "'}";
    }
    else if (health <= 1.08){
      return "{background: '"+ gradientColors[108]+ "'}";
    }
    else if (health <= 1.09){
      return "{background: '"+ gradientColors[109]+ "'}";
    }
    else if (health <= 1.10){
      return "{background: '"+ gradientColors[110]+ "'}";
    }
    else if (health <= 1.11){
      return "{background: '"+ gradientColors[111]+ "'}";
    }
    else if (health <= 1.12){
      return "{background: '"+ gradientColors[112]+ "'}";
    }
    else if (health <= 1.13){
      return "{background: '"+ gradientColors[113]+ "'}";
    }
    else if (health <= 1.14){
      return "{background: '"+ gradientColors[114]+ "'}";
    }
    else if (health <= 1.11){
      return "{background: '"+ gradientColors[115]+ "'}";
    }
    else if (health <= 1.16){
      return "{background: '"+ gradientColors[116]+ "'}";
    }
    else if (health <= 1.17){
      return "{background: '"+ gradientColors[117]+ "'}";
    }
    else if (health <= 1.18){
      return "{background: '"+ gradientColors[118]+ "'}";
    }
    else if (health <= 1.19){
      return "{background: '"+ gradientColors[119]+ "'}";
    }
    else if (health > 1.19 && health <= 3){
      return "{background: '"+ gradientColors[120]+ "'}";
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
    var div_width = 300; //if this changes also change the css
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
          //green
          return "{background: '#89E818', width:"+ bar_width +"}";
        }
        else if (health <= 1){
          //yellow
          return "{background: '#FFEB2C', width:"+ bar_width +"}";
        }
        else if (health > 1 && health < 3){
          //blue
          return "{background: '#4FB2FF', width:"+ bar_width +"}";
        }
        else if (health >= 3){
          //lightgrey
          return "{background: 'lightgrey', width:"+ bar_width +"}";
        }
        else {
          return "{background: 'white'}";
        }
      }
    };
// This handles tab functionality
  $scope.contactSort = "";
  $scope.query = "";

  $scope.makeTabActive = function(tabNum){
    $scope.query.fullname = "";
    if (tabNum == 0){
      $('#main-group-tab').addClass('active');
      $('#multi-group-tab').removeClass('active');
      $scope.contactSort = "";
    }
    else if (tabNum == 6){
      $('#main-group-tab').removeClass('active');
      $('#multi-group-tab').addClass('active');
      $scope.contactSort = "";
    }
    else{
      $('#main-group-tab').addClass('active');
      $('#multi-group-tab').removeClass('active');
    }
  }
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
