angular.
  module('app').
  config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function routes($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.rule(function($injector, $location) {
        var path = $location.path();
        var hasTrailingSlash = path[path.length-1] === '/';
        if(hasTrailingSlash) {
          var newPath = path.substr(0, path.length - 1); 
          return newPath; 
        } 
      });
    $stateProvider.
      state('home', {
        url: '/',
        template: '<home></home>',
        data :  {
          authenticate : false
        }
      }).
      state('allpins', {
        url: '/allpins',
        template : '<allpins></allpins>',
        data :  {
          authenticate : false
        }
      }).
      state('mypins', {
        url: '/mypins', 
        template : '<mypins></mypins>',
        data :  {
          authenticate : true
        }
      }).
      state('userpins', {
        url: '/user/:username', 
        template : '<userpins></userpins>',
        data :  {
          authenticate : false
        }
      })
  }])