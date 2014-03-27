var AcquaintlyApp = angular.module('AcquaintlyApp', ['AppRouter', 'AppController']);

var AppRouter = angular.module('AppRouter', ['ngRoute']);

AppRouter.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/templates/login.html',
        controller: 'LoginCtrl'
      }).
      when('/signup', {
        templateUrl: '/templates/signup.html',
        controller: 'LoginCtrl'
      }).
      when('/dashboard', {
        templateUrl: '/templates/dashboard.html',
        controller: 'AppCtrl'
      }).
      when('/categorize', {
        templateUrl: '/templates/categorize.html',
        controller: 'AppCtrl'
      }).
      otherwise({
        templateUrl: '/templates/login.html',
        controller: 'LoginCtrl'
      });
  }]);

// login = index
