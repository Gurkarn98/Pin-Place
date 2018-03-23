angular.
  module('app')
  .factory('userService', function ($http, $window){
    var userService = {
      user : undefined,
      login : function() {
        window.open("/login", "_self")
      },
      isAuthenticated : function(){
        return $http.get('/authorized')
      },
      logout : function (){
        return $http.post("/logout")
      }
    }
    return userService;
  })
