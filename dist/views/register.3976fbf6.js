!function(){"use strict";angular.module("kt.pano").controller("ktRegisterCtrl",["$rootScope","$scope","$window","$state","CacheFactory","ktLoginService","ktRegisterService","ktSweetAlert","ktGetCaptcha",function(a,b,c,d,e,f,g,h,i){a.goHome=function(){d.go("home.index")},b.QRCodeVisible=!1,b.registerUser={},b.registerUser.likes=[],b.likes=[{name:"票 据",value:0},{name:"房地产债权",value:1},{name:"政府平台债权",value:2},{name:"上市公司债权",value:3},{name:"信 托",value:4},{name:"银行理财",value:5},{name:"券商资管",value:6},{name:"保险资管",value:7},{name:"应收账款",value:8},{name:"小微贷",value:9},{name:"其 他",value:10}],b.hasLikes="",b.$watch("registerUser.likes.length",function(a,c){a!==c&&(b.hasLikes=b.registerUser.likes.length?!0:"")}),b.submitForm=function(){return b.pendingRequests=!0,b.registerUser.password_confirmation=b.registerUser.password,g.save(b.registerUser).$promise.then(function(){b.user={mobile:b.registerUser.mobile,password:b.registerUser.password},f.save(b.user,function(a){b.pendingRequests=!1,a.token&&(e.clearAll(),c.localStorage.token=a.token,h.swal({title:"注册成功！",text:"",type:"success"},function(){d.go("account.perfect")}))})},function(a){b.pendingRequests=!1,h.swal({title:"提交失败",text:$.isArray(a.error)?a.error.join("<br/>"):a.error||"抱歉，您的信息没有提交成功，请再次尝试！",type:"error"})}),!1},b.captchaSettings={};var j=i.getCaptcha(b,g,{content:"captcha"},b.registerUser);b.getCaptcha=function(a,c){a.preventDefault(),a.stopPropagation(),"sms"===c&&b.waitCaptchaMessage||"tel"===c&&b.waitCaptchaTel||j(b.registerUser.mobile,c)}}])}();