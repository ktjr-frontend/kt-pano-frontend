!function(){"use strict";angular.module("kt.pano").controller("ktHomeCtrl",["$scope","$state","$rootScope",function(a,b,c){c.goHome=function(){b.go("home.index")},a.footerGoHome=function(){c.bdTrack(["LandingPage页","点击","开通官网"])},a.footerContactUs=function(){c.bdTrack(["LandingPage页","点击","联系我们"])},a.footerContainer=!0}])}();