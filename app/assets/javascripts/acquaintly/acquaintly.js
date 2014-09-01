var AcquaintlyApp = angular.module('AcquaintlyApp', ['AppRouter', 'AppController', 'ngResource']);

var AppRouter = angular.module('AppRouter', ['ngRoute']);

AppRouter.config(['$routeProvider','$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/templates/login.html',
        controller: 'AppCtrl'
      }).
      when('/dashboard', {
        templateUrl: '/templates/dashboard.html',
        controller: 'AppCtrl'
      }).
      when('/users/sign_in', {
        templateUrl: '/templates/login.html',
        controller: 'AppCtrl'
      });
    $locationProvider.html5Mode(true);
  }]);

// login = index
