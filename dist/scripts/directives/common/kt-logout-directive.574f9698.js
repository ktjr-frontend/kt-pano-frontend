!function(){"use strict";angular.module("kt.pano").directive("ktLogout",["$window","$state","ktSession",function(a,b,c){return{restrict:"A",link:function(a,d){d.on("click",function(a){a.stopPropagation(),a.preventDefault(),c.clear(),b.go("account.login",{},{reload:!0})})}}}])}();