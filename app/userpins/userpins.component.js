angular
  .module('userpins')
  .component('userpins', {
    templateUrl: "/userpins/userpins.template.html",
    controller: function recentsController(userService, $state, $scope, pinService, $stateParams) {
      var self = this;
      var grid = $('.grid')
      self.user = {username: $stateParams.username}
      if (self.user.username === userService.user.username){
        $state.go('mypins')
      }
      pinService.getByUser(self.user).then(res=>{
        self.pins = res.data
      })
      self.like = function(pin){
        var username = userService.user.username
        pin.myUsername = username
        if (username !== pin.username){
          pinService.like(pin).then(res=>{
            if (res.data !== "No Update"){
              $("#"+res.data._id+'uservotes').html('<i class="fas fa-heart"></i> '+res.data.voted.length)
            }
          })
        }
      }
      self.reblog = function(pin){
        var username = userService.user.username
        if (username !== pin.username){
          pinService.reblog(pin, username).then(res=>{
          if (res.data !== "No Update"){
            pinService.mypins.push(res.data)
            $("#"+res.data._id+'userreblogs').html('<i class="fas fa-redo-alt"></i> '+res.data.reblogged.length)
          }
        })
        }
      }
    }
  })