!function(){"use strict";angular.module("kt.pano").controller("ktRegisterCtrl",["$rootScope","$scope","$timeout","$window","$state","CacheFactory","ktLoginService","ktRegisterService","ktSweetAlert","ktGetCaptcha","ktCaptchaService",function(a,b,c,d,e,f,g,h,i,j,k){a.goHome=function(){e.go("home.index"),a.bdTrack(["注册页","点击","logo"])},b.QRCodeVisible=!1,b.registerUser={inviter_account_id:e.params._u||null,agreement:1},b.submitForm=function(){return b.pendingRequests=!0,b.registerUser.password_confirmation=b.registerUser.password,h.save(b.registerUser).$promise.then(function(){b.user={mobile:b.registerUser.mobile,password:b.registerUser.password},g.save(b.user,function(a){b.pendingRequests=!1,a.token&&(f.clearAll(),d.localStorage.token=a.token,e.go("account.perfect"))})},function(a){b.pendingRequests=!1,i.swal({title:"提交失败",text:$.isArray(a.error)?a.error.join("<br/>"):a.error||"抱歉，您的信息没有提交成功，请再次尝试！",type:"error"})}),!1},b.imgCaptcha={},b.refreshImgCaptcha=function(){k.get(function(a){b.imgCaptcha.url=a.url,b.imgCaptcha.img_captcha_key=a.key})},b.refreshImgCaptcha();var l=j.initCaptcha(b,h,{content:"captcha"},b.registerUser);b.getCaptcha=function(a,c){return a.preventDefault(),a.stopPropagation(),"sms"===c&&b.waitCaptchaMessage||"tel"===c&&b.waitCaptchaTel?void 0:b.registerForm.mobile.$invalid?(i.error("手机号号码不正确！"),void b.registerForm.mobile.$setDirty()):b.registerForm.img_captcha.$invalid?(i.error("请正确填写图形验证码！"),void b.registerForm.img_captcha.$setDirty()):void l({mobile:b.registerUser.mobile,img_captcha:b.registerUser.img_captcha,img_captcha_key:b.imgCaptcha.img_captcha_key,channel:c})}}])}();