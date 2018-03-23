angular
  .module('allpins')
  .component('allpins', {
    templateUrl: "/allpins/allpins.template.html",
    controller: function recentsController($state, $location, userService, $scope, pinService) {
      var self = this;
      var grid = $('.grid')
      $scope.$watch(function(){
        return userService.user
      }, function (newVal, oldVal){
        if (newVal){
          self.username = userService.user.username
        }
      })
      pinService.getAll().then(res=>{
        self.pins = res.data.reverse()
      })
      self.like = function(pin){
        var username = userService.user.username
        pin.myUsername = username
        if (username !== pin.username){
          pinService.like(pin).then(res=>{
            if (res.data !== "No Update"){
              $("#"+res.data._id+'votes').html('<i class="fas fa-heart"></i> '+res.data.voted.length)
            }
          })
        }
      }
      self.reblog = function(pin){
        var username = self.username
        if (username !== pin.username){
          pinService.reblog(pin, username).then(res=>{
          if (res.data !== "No Update"){
            pinService.mypins.push(res.data)
            $("#"+res.data._id+'reblogs').html('<i class="fas fa-redo-alt"></i> '+res.data.reblogged.length)
          }
        })
        }
      }
    }
  })