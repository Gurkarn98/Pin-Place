angular
  .module('app')
  .directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});

angular
  .module('app')
  .directive('uiSrefIf', function(userService) {
  return {
    restriction: 'A',
    priority: 100,
    link: function(scope, element, attrs) {
      element.bind('click', function(event) {
        if (userService.user.username === attrs.uiSrefIf){
          event.preventDefault();
        }
      });
    }
  }
});
angular
  .module('app')
  .directive('image', function(userService) {
  return {
    restriction: 'A',
    priority: 100,
    link: function($scope, element, attrs) {
      element.on('load', function(){
        var $element = $(element).parents('.grid-item')
        var grid = $('.grid')
        grid.masonry('appended', $element);
        $element.removeClass('hide')
        grid.masonry('reloadItems');
        grid.masonry('layout');
      })
    }
  }
});

angular
  .module('app')
  .directive('masonry', function(userService) {
  return {
    restriction: 'A',
    priority: 100,
    link: function($scope, element, attrs) {
      var $grid = $('.grid')
      $grid.masonry({
        itemSelector: '.grid-item',
        columnWidth: 200,
        gutter : '.gutter-sizer',
        fitWidth: true
      });
    }
  }
});

angular
  .module('app')
  .directive('active', function($location) {
  return {
    restriction: 'A',
    priority: 100,
    link: function($scope, element, attrs) {
      var path = $location.path().split('/')[$location.path().split('/').length-1]
      if (path === 'mypins' || path === 'allpins'){
        $(".nav").removeClass('clicked')
        $("."+path).addClass('clicked')
      } else {
        $(".nav").removeClass('clicked')
      }
    }
  }
});