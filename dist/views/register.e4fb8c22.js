!function(){"use strict";angular.module("kt.pano").controller("ktRegisterCtrl",["$rootScope","$scope","$window","$state","CacheFactory","ktLoginService","ktRegisterService","ktSweetAlert","ktGetCaptcha",function(a,b,c,d,e,f,g,h,i){a.goHome=function(){d.go("home.index")},b.QRCodeVisible=!1,b.registerUser={},b.submitForm=function(){return b.pendingRequests=!0,b.registerUser.password_confirmation=b.registerUser.password,g.save(b.registerUser).$promise.then(function(){b.user={mobile:b.registerUser.mobile,password:b.registerUser.password},f.save(b.user,function(a){b.pendingRequests=!1,a.token&&(e.clearAll(),c.localStorage.token=a.token,h.swal({title:"注册成功！",text:"",type:"success"},function(){d.go("account.perfect")}))})},function(a){b.pendingRequests=!1,h.swal({title:"提交失败",text:$.isArray(a.error)?a.error.join("<br/>"):a.error||"抱歉，您的信息没有提交成功，请再次尝试！",type:"error"})}),!1},b.captchaSettings={};var j=i.getCaptcha(b,g,{content:"captcha"},b.registerUser);b.getCaptcha=function(a,c){a.preventDefault(),a.stopPropagation(),"sms"===c&&b.waitCaptchaMessage||"tel"===c&&b.waitCaptchaTel||j(b.registerUser.mobile,c)}}])}();