angular.
  module('app')
  .factory('pinService', function ($http, $window){
    var userService = {
      mypins : undefined,
      add : function(pin) {
        return $http.post('/add', pin)
      },
      delete : function(pin) {
        return $http({url:'/delete', method:"DELETE", params: {id : pin._id, username: pin.username}})
      },
      like : function (pin){
        return $http.put("/like", pin)
      },
      reblog: function (pin, username){
        return $http.put("/reblog", {pin :pin, username: username})
      },
      deleteReblog: function (pin, username){
        return $http({url: "/deleteReblog", method: "DELETE", params: {pin :pin, username: username}})
      },
      getByUser : function (user){
        return $http({url: "/getByUser", method:"GET", params: user})
      },
      getAll: function (){
        return $http({url: "/getAll", method:"GET"})
      },
      getRecent: function (){
        return $http({url: "/getRecent", method:"GET"})
      },
    }
    return userService;
  })
