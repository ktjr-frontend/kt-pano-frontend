!function(){"use strict";angular.module("kt.common").directive("ktRippleButton",["$timeout",function(a){return{restrict:"A",link:function(a,b,c){if($("html").hasClass("mobile")){var d=c.actionChild||"a",e=c.effectChild||d;b.on("mousedown",d,function(a){var b=$(this).closest(e);b=b.length?b:$(this);var c=b.offset(),d=a.pageX,f=a.pageY;b.children(".ripple").remove(),b.css({position:"relative",overflow:"hidden"});var g=Math.max(b.width(),b.height()),h=$('<span class="ripple"></span>').css({width:g,height:g});h.appendTo(b).css({left:d-c.left-h.width()/2,top:f-c.top-h.height()/2}).addClass("ripple")})}}}}])}();