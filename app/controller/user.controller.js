angular.
  module('app').
  controller('userController', function($scope, $rootScope, $state, userService){
    $scope.logout = function (){
      userService.logout().then(function (response) {
        if (response.data === true){ 
          userService.user = false;
          $rootScope.show = false;
          $state.transitionTo("home");
          $('.logged').toggleClass('responsive')
          $('.notLogged').toggleClass('responsive')
        }
      })
    };
    $scope.login = function (){
      userService.login()
    };
})