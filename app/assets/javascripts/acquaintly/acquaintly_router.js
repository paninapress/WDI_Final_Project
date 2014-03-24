var AppRouter = angular.module('AppRouter', ['ngRoute']);

AppRouter.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/site',
        controller: 'AquaintlyController'
      }).
      when('/new', {
        templateUrl: '/site/new.html.erb',
        controller: 'AquaintlyController'
      });
  }
]);