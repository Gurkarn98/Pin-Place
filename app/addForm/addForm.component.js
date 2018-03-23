angular
  .module('addForm')
  .component('addForm', {
    templateUrl: "/addForm/addForm.template.html",
    controller: function addFormController($scope, userService, pinService) {
      var self = this;
      var grid = $('.grid')
      $scope.$watch("link", function(newVal, oldVal){
        if (newVal !== oldVal){
          $scope.image=$scope.link
        }
      })
      self.onKeyDown= function($event){
        if (window.event.code === "Escape" || $event.code === "Escape") {
          $scope.$parent.showForm=!$scope.$parent.showForm
          $scope.link = undefined;
          $scope.title = undefined;
        }
      }
      self.close = function(){
        $scope.$parent.showForm=!$scope.$parent.showForm
      }
      self.add = function(title, link){
        if (title && link){
          var pin = {
            title: $scope.title,
            link: $scope.link,
            reblogged: [],
            voted: [],
            reblog : false,
            username: userService.user.username
          }
          pinService.add(pin).then(res=>{
            pinService.mypins = res.data[0]
            $scope.$parent.showForm=!$scope.$parent.showForm
            $scope.link = undefined;
            $scope.title = undefined;
            var newPin = res.data[1]
            $scope.$parent.pins.push(newPin)

          })
        }
      }
    }
  })