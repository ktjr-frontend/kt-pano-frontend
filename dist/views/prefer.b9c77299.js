!function(){"use strict";angular.module("kt.pano").controller("ktPreferCtrl",["$scope","$rootScope","$state","ktSession","ktSweetAlert",function(a,b,c,d,e){a.isCertifyApplication=1==c.params.certifyApplication,b.goHome=function(){d.clear(),c.go("home.index")},a.submitForm=function(){e.swal({title:"",text:a.isCertifyApplication?"成功完成认证申请，审核结果将在1个工作日内通知您":"恭喜您注册成功！"}),c.go(b.defaultRoute||"pano.overview")},a.skip=function(){e.swal({title:"",text:"设置了业务偏好，才可以获得更多个性化服务哦",confirmButtonText:"马上设置",showCancelButton:!0,cancelButtonText:"不需要"},function(d){d||(e.swal({title:"",text:a.isCertifyApplication?"成功完成认证申请，审核结果将在1个工作日内通知您":"恭喜您注册成功！"}),c.go(b.defaultRoute||"pano.overview"))})}}])}();