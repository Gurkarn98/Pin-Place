angular.
  module("app").
  run(function ($rootScope, $transitions, $state, userService, pinService) {
    $transitions.onStart( {}, function($transition$) {
      if (userService.user === undefined) {
        userService.isAuthenticated().then(function (response){
          if (response.data !== false) {
            $rootScope.show = true
          } else {
            $rootScope.show = false
          }
          if (response.data === false && $transition$.$to().data.authenticate === true) {
            userService.user = false
            $state.transitionTo("home");
          } else if (response.data === false && $transition$.$to().data.authenticate === false) {
          } else {
            userService.user = response.data
            var user = {username: userService.user.username}
            pinService.getByUser(user).then(res=>{
              pinService.mypins = res.data
            })
          }
        })
      } else if (userService.user === false && $transition$.$to().data.authenticate === true) {
        $state.transitionTo("home");
        $rootScope.show = false
      } else if (userService.user !== undefined && userService.user !== false) {
        $rootScope.show=true
      }
    });
  });