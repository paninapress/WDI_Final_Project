var AcquaintlyApp = angular.module('AcquaintlyApp', ['AppRouter', 'AppController']);

var AppRouter = angular.module('AppRouter', ['ngRoute']);

AppRouter.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/templates/index.html',
        controller: 'AppCtrl'
      }).
      when('/signup', {
        templateUrl: '/templates/new.html',
        controller: 'AppCtrl'
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
        templateUrl: '/templates/index.html',
        controller: 'AppCtrl'
      });
  }]);