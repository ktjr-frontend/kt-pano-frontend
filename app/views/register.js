;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktRegisterCtrl', function($rootScope, $scope, $window, $state, CacheFactory, ktLoginService, ktRegisterService, ktSweetAlert, ktGetCaptcha) {

            $rootScope.goHome = function() {
                $state.go('home.index')
            }

            $scope.QRCodeVisible = false
            $scope.registerUser = {}

            $scope.registerUser.likes = []
            $scope.likes = [{
                name: '票 据',
                value: 0
            }, {
                name: '房地产债权',
                value: 1
            }, {
                name: '政府平台债权',
                value: 2
            }, {
                name: '上市公司债权',
                value: 3
            }, {
                name: '信 托',
                value: 4
            }, {
                name: '银行理财',
                value: 5
            }, {
                name: '券商资管',
                value: 6
            }, {
                name: '保险资管',
                value: 7
            }, {
                name: '应收账款',
                value: 8
            }, {
                name: '小微贷',
                value: 9
            }, {
                name: '其 他',
                value: 10
            }]

            $scope.hasLikes = ''
            $scope.$watch('registerUser.likes.length', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.hasLikes = $scope.registerUser.likes.length ? true : ''
                }
            });

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
