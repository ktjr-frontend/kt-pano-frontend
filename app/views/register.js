;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktRegisterCtrl', function($rootScope, $scope, $window, $state, CacheFactory, ktLoginService, ktRegisterService, ktSweetAlert, ktGetCaptcha) {

            $rootScope.goHome = function() {
                $state.go('home.index')
            }

            $scope.registerUser = {}

            $scope.submitForm = function() {
                $scope.pendingRequests = true

                ktRegisterService.save($scope.registerUser).$promise.then(function() {
                    // $scope.pendingRequests = false
                    $scope.user = {
                        mobile: $scope.registerUser.mobile,
                        password: $scope.registerUser.password
                    }
                    ktLoginService.save($scope.user, function(res) {
                        $scope.pendingRequests = false

                        if (res.token) {
                            CacheFactory.clearAll()
                            $window.localStorage.token = res.token
                            ktSweetAlert.swal({
                                title: '注册成功！',
                                text: '',
                                type: 'success',
                            }, function() {
                                $state.go('account.perfect')
                            })
                        }
                    })


                }, function(res) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '提交失败',
                        text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，您的信息没有提交成功，请再次尝试！'),
                        type: 'error',
                    });
                })
                return false;
            }

            $scope.captchaSettings = {}

            var getCaptcha = ktGetCaptcha.getCaptcha($scope, ktRegisterService, { content: 'captcha' }, $scope.registerUser)

            // 获取验证码，首先校验图形验证码，通过事件的异步方式
            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()


                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return

                //获取语音或短信验证码
                getCaptcha($scope.registerUser.mobile, channel)

            }
        })
})();
