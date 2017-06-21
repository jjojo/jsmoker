var robotApp = angular.module('robotApp', ["ngRoute",'ngResource','ui.bootstrap','chart.js']);

robotApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {                        
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);
