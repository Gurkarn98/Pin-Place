angular.
  module('app').
  controller('navbar', function($location, $scope, $rootScope, userService){
  $scope.nav=function() {
    $('ul').append($('ul').find('li').get().reverse());
    $('.list').toggleClass('right')
    if (userService.user){
      $('.logged').toggleClass('responsive')
    } else {
      $('.notLogged').toggleClass('responsive')
    }
    $('.both').toggleClass('responsive')
  }
  $('.view-container, footer').on('click', function(event){
    console.log(event)
    if (event.type === 'click'){
      $('.list').addClass('right')
       if (userService.user){
      $('.logged').removeClass('responsive')
      } else {
        $('.notLogged').removeClass('responsive')
      }
        $('.both').removeClass('responsive')
    }
  })
})