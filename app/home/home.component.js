angular
  .module('home')
  .component('home', {
    templateUrl: "/home/home.template.html",
    controller:function($scope, pinService){
      var self = this
      $("#img").on('load', function(){
        var self = this
        var c=document.getElementById("canvas");
        var ctx=c.getContext("2d");
        var img=document.getElementById("img");
        ctx.drawImage(img, 0, 0);
        ctx.font="150px Lobster";
        ctx.lineWidth=5
        ctx.strokeStyle="white"
        ctx.strokeText("Pin Place",25,150);
        ctx.strokeStyle="white"
        ctx.font="75px Lobster";
        ctx.lineWidth=4
        ctx.fillStyle="white"
        ctx.textAlign = "center";
        ctx.fillText("Pin your favorite places here!",700,700);
        ctx.strokeStyle="white"
      })
      pinService.getRecent().then(res=>{
        self.pins = res.data
      })
    }
  })