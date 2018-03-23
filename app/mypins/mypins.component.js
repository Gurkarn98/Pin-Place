angular
  .module('mypins')
  .component('mypins', {
    templateUrl: "/mypins/mypins.template.html",
    controller: function mypinsController($location, pinService, userService, $scope) {
      var self = this;
      var grid = $('.grid')
      $scope.showForm = false;
      self.showForm= function (){
        $scope.showForm=!$scope.showForm
      }
      $scope.$watch(function(){
        return pinService.mypins;
      }, function(newVal, oldVal){
        var equal = JSON.stringify(newVal) === JSON.stringify(oldVal)
        if ((newVal && !oldVal) || (newVal && equal)){
          $scope.pins = pinService.mypins
        }
      })
      $scope.$watch(function(){
        return userService.user;
      }, function(newVal, oldVal){
        if (newVal){
          self.username = userService.user.username
        }
      })
      self.delete = function del(pin){
        if (pin.username === self.username) {
          pinService.delete(pin).then(res=>{
            pinService.mypins = res.data
            $scope.length = pinService.mypins.length
            $scope.pins = $scope.pins.filter(thisPin=>{
              return pin._id !== thisPin._id
            })
            var $item = $("#"+pin._id)
            $item.remove()
            grid.masonry('reloadItems')
            grid.masonry('layout')
          })
        } else if (pin.username !== self.username){
          pinService.deleteReblog(pin, self.username).then(res=>{
            pinService.mypins = res.data
            $scope.pins = $scope.pins.filter(thisPin=>{
              return pin._id !== thisPin._id
            })
            var $item = $("#"+pin._id)
            $item.remove()
            grid.masonry('reloadItems')
            grid.masonry('layout')
          })
        }
      }
    }
  })