!function(){"use strict";angular.module("kt.common").directive("ktPlatformInit",function(){return{restrict:"A",link:function(){function a(){$("#wrapper").css("min-height",$(window).height()+"px")}function b(){$(window).width()<769?$("body").addClass("page-small"):($("body").removeClass("page-small"),$("body").removeClass("show-sidebar"))}window.requestAnimationFrame(function(){b(),a()}),$(window).bind("resize click",function(){window.requestAnimationFrame(function(){b()}),setTimeout(function(){a()},200)})}}})}();