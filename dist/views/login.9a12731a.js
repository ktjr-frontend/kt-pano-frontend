!function(){"use strict";angular.module("kt.pano").controller("ktLoginCtrl",["$scope","$rootScope","$state","$timeout","$uibModal","ktSweetAlert","ktLoginCommon",function(a,b,c,d,e,f,g){b.goHome=function(){c.go("home.index"),b.bdTrack(["注册页","点击","logo"])};try{window.localStorage.setItem("_detect","work")}catch(h){f.swal({title:"错误：",text:"您的浏览器不支持localStorage，可能是无痕浏览模式导致的，请不要使用无痕上网模式",type:"error"})}a.user=b.user=JSON.parse(window.localStorage.user||"{}"),a.submitForm=function(){g(a,function(){b.show2016Report=!0},function(){b.bdTrack(["登录页","确定","登录失败"])})},a.resetPassword=function(){var a,b;a=e.open({size:"md",backdrop:"static",templateUrl:"views/modals/input_phone_captcha.html",controller:"resetPasswordTwoCtrl"}),a.result.then(function(){b=e.open({size:"md",backdrop:"static",templateUrl:"views/modals/reset_password.html",controller:"resetPasswordThreeCtrl"}),b.result.then(function(){f.success("密码修改成功！")})})}}]).controller("resetPasswordTwoCtrl",["$scope","$uibModalInstance","ktRecoverService","ktGetCaptcha","ktCaptchaService","ktSweetAlert",function(a,b,c,d,e,f){a.title="验证手机",a.user.content="validate_captcha",a.user.captcha="",a.notLastStep=!0,a.imgCaptcha={},a.refreshImgCaptcha=function(){e.get(function(b){a.imgCaptcha.url=b.url,a.imgCaptcha.img_captcha_key=b.key})},a.refreshImgCaptcha();var g=d.initCaptcha(a,c,{content:"captcha"},a.user);a.getCaptcha=function(b,c){return b.preventDefault(),b.stopPropagation(),"sms"===c&&a.waitCaptchaMessage||"tel"===c&&a.waitCaptchaTel?void 0:a.popForm.mobile.$invalid?(f.error("手机号号码不正确！"),void a.popForm.mobile.$setDirty()):a.popForm.img_captcha.$invalid?(f.error("请正确填写图形验证码！"),void a.popForm.img_captcha.$setDirty()):void g({img_captcha:a.user.img_captcha,img_captcha_key:a.imgCaptcha.img_captcha_key,mobile:a.user.mobile,channel:c})},a.submitForm=function(){c.update(a.user,function(){b.close()},function(b){a.error=b.error||"更新出错！"})},a.cancel=function(){b.dismiss("cancel")}}]).controller("resetPasswordThreeCtrl",["$scope","$uibModalInstance","ktSweetAlert","ktRecoverService",function(a,b,c,d){a.title="设置新密码",a.user.content="",a.user.password="",a.user.password_confirmation="",a.submitForm=function(){d.update(a.user,function(){b.close()},function(b){a.error=b.error||"更新出错！"})},a.cancel=function(){b.dismiss("cancel")}}])}();