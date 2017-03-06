;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktRegisterCtrl', function($rootScope, $scope, $timeout, $window, $state, CacheFactory, ktLoginService, ktRegisterService, ktSweetAlert, ktGetCaptcha, ktCaptchaService) {

            $rootScope.goHome = function() {
                $state.go('home.index')
                $rootScope.bdTrack(['注册页', '点击', 'logo'])
            }

            $scope.QRCodeVisible = false
            $scope.registerUser = {
                inviter_account_id: $state.params._u || '',
                agreement: 1
            }

            $scope.submitForm = function() {
                $scope.pendingRequests = true
                $scope.registerUser.password_confirmation = $scope.registerUser.password //隐藏重复输入密码的逻辑

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
                            $state.go('account.perfect')
                                /*ktSweetAlert.swal({
                                    title: '注册成功！',
                                    text: '',
                                    type: 'success',
                                }, function() {
                                    $state.go('account.perfect')
                                })*/
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

            $scope.imgCaptcha = {}
            $scope.refreshImgCaptcha = function() {
                ktCaptchaService.get(function(data) {
                    $scope.imgCaptcha.url = data.url
                    $scope.imgCaptcha.img_captcha_key = data.key
                })
            }

            // 页面加载获取一次图形验证码
            $scope.refreshImgCaptcha()

            // 初始化获取短信验证码
            var getCaptcha = ktGetCaptcha.initCaptcha($scope, ktRegisterService, { content: 'captcha' }, $scope.registerUser)

            // 获取短信验证码，首先校验图形验证码，通过事件的异步方式
            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return

                if ($scope.registerForm.mobile.$invalid) {
                    ktSweetAlert.error('手机号号码不正确！')
                    $scope.registerForm.mobile.$setDirty()
                    return
                }

                if ($scope.registerForm.img_captcha.$invalid) {
                    ktSweetAlert.error('请正确填写图形验证码！')
                    $scope.registerForm.img_captcha.$setDirty()
                    return
                }

                //获取语音或短信验证码
                getCaptcha({
                    mobile: $scope.registerUser.mobile,
                    img_captcha: $scope.registerUser.img_captcha,
                    img_captcha_key: $scope.imgCaptcha.img_captcha_key,
                    channel: channel
                })

            }
        })
})();
