var AcquaintlyApp = angular.module('AcquaintlyApp', ['ngRoute', 'AppController']);

AcquaintlyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/site',
        controller: 'AppCtrl'
      }).
      when('/site/new', {
        templateUrl: '/site/new.html.erb',
        controller: 'AppCtrl'
      });
  }]);