(function () {

  'use strict';

  require('angular');
  require('angular-route');
  require('angular-animate');

  var mainCtrl = require('./controller/maincontroller');

  angular.module('SampleApp', ['ngRoute', 'ngAnimate'])
    .config([
      '$locationProvider',
      '$routeProvider',
      function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        // routes
        $routeProvider
          .when("/", {
            templateUrl: "./partial/partial1.html",
            controller: "MainController"
          })
          .otherwise({
             redirectTo: '/'
          });
      }
    ]);

  //Load controller
  angular.module('SampleApp').controller('MainController', mainCtrl);

}());