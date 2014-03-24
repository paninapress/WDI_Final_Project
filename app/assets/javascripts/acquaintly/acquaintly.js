var AcquaintlyApp = angular.module('AcquaintlyApp', ['ngRoute', 'AppController']);

AcquaintlyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/site',
        controller: 'AquaintlyController'
      }).
      when('/site/new', {
        templateUrl: '/site/new.html.erb',
        controller: 'AquaintlyController'
      });
  }]);