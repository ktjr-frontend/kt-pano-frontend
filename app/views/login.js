;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktLoginCtrl', function($scope, $rootScope, $state, $timeout, $uibModal, ktSweetAlert, ktLoginCommon) {

            $rootScope.goHome = function() {
                $state.go('home.index')
                $rootScope.bdTrack(['注册页', '点击', 'logo'])
            }

            try {
                window.localStorage.setItem('_detect', 'work')
            } catch (e) {
                ktSweetAlert.swal({
                    title: '错误：',
                    text: '您的浏览器不支持localStorage，可能是无痕浏览模式导致的，请不要使用无痕上网模式',
                    type: 'error',
                })
            }

            $scope.user = $rootScope.user = JSON.parse(window.localStorage.user || '{}')

            $scope.submitForm = function() {
                ktLoginCommon($scope, function() {
                    // $rootScope.show2016Report = true
                        /*ktSweetAlert.swal({
                            title: '提示',
                            text: '《2016互金理财市场年度报告》新鲜出炉，<br/>快到右上角【报告】模块下载吧！',
                            type: ''
                        })*/
                }, function() {
                    $rootScope.bdTrack(['登录页', '确定', '登录失败'])
                })
            }

            // 忘记密码
            $scope.resetPassword = function() {
                var modalStepTwo
                var modalStepThree

                // modalStepOne = $uibModal.open({
                //     size: 'md',
                //     backdrop: 'static',
                //     templateUrl: 'views/modals/input_img_captcha.html',
                //     controller: 'resetPasswordOneCtrl'
                // })

                // modalStepOne.result.then(function() {

                modalStepTwo = $uibModal.open({
                    size: 'md',
                    backdrop: 'static',
                    // animation: false,
                    templateUrl: 'views/modals/input_phone_captcha.html',
                    controller: 'resetPasswordTwoCtrl'
                })

                modalStepTwo.result.then(function() {
                    modalStepThree = $uibModal.open({
                        size: 'md',
                        // animation: false,
                        backdrop: 'static',
                        templateUrl: 'views/modals/reset_password.html',
                        controller: 'resetPasswordThreeCtrl'
                    })

                    modalStepThree.result.then(function() {
                        ktSweetAlert.success('密码修改成功！')
                    })

                })

                // }, function() {
                //     console.log('cancel step 1')
                // })

                /*var modal = $uibModal.open({
                    size: 'md',
                    backdrop: 'static',
                    animation: false,
                    templateUrl: 'views/modals/reset_password_merge.html',
                    controller: 'resetPasswordCtrl'
                })
                modal.result.then(function() {


                }, function() {
                    console.log('cancel reset_password')
                })*/

            }

        })
        /*.controller('resetPasswordCtrl', function($scope, $uibModalInstance, ktRecoverService, ktGetCaptcha, ktSweetAlert) {
            $scope.title = '忘记密码'
            $scope.user = {}
            var getCaptcha = ktGetCaptcha.getCaptcha($scope, ktRecoverService, {content: 'captcha'}, $scope.user)
            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return
                getCaptcha($scope.user.mobile, channel)
            }

            $scope.ok = function() {
                ktRecoverService.update($scope.user, function (res) {
                    $uibModalInstance.close()
                }, function (res) {
                    $scope.error = res.error || '保存失败！'
                })
            }
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            }
        })*/
        /*.controller('resetPasswordOneCtrl', function($scope, $uibModalInstance) {
            $scope.title = '重置密码'
            $scope.ok = function() {
                $uibModalInstance.close()
            }
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            }
        })*/
        .controller('resetPasswordTwoCtrl', function($scope, $uibModalInstance, ktRecoverService, ktGetCaptcha, ktCaptchaService, ktSweetAlert) {
            $scope.title = '验证手机'
                // $scope.user = {}
            $scope.user.content = 'validate_captcha'
            $scope.user.captcha = ''
            $scope.notLastStep = true

            $scope.imgCaptcha = {}
            $scope.refreshImgCaptcha = function() {
                ktCaptchaService.get(function(data) {
                    $scope.imgCaptcha.url = data.url
                    $scope.imgCaptcha.img_captcha_key = data.key
                })
            }

            $scope.refreshImgCaptcha()

            // 初始化图形验证码
            var getCaptcha = ktGetCaptcha.initCaptcha($scope, ktRecoverService, { content: 'captcha' }, $scope.user)
            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return

                if ($scope.popForm.mobile.$invalid) {
                    ktSweetAlert.error('手机号号码不正确！')
                    $scope.popForm.mobile.$setDirty()
                    return
                }

                if ($scope.popForm.img_captcha.$invalid) {
                    ktSweetAlert.error('请正确填写图形验证码！')
                    $scope.popForm.img_captcha.$setDirty()
                    return
                }

                getCaptcha({
                    img_captcha: $scope.user.img_captcha,
                    img_captcha_key: $scope.imgCaptcha.img_captcha_key,
                    mobile: $scope.user.mobile,
                    channel: channel
                })
            }

            $scope.submitForm = function() {
                ktRecoverService.update($scope.user, function() {
                    $uibModalInstance.close()
                }, function(res) {
                    $scope.error = res.error || '更新出错！'
                })
            }

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            }
        })
        .controller('resetPasswordThreeCtrl', function($scope, $uibModalInstance, ktSweetAlert, ktRecoverService) {
            $scope.title = '设置新密码'
                // $scope.user = {}
            $scope.user.content = ''
            $scope.user.password = ''
            $scope.user.password_confirmation = ''

            $scope.submitForm = function() {
                ktRecoverService.update($scope.user, function() {
                    $uibModalInstance.close()
                }, function(res) {
                    $scope.error = res.error || '更新出错！'
                })
            }

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            }
        })
})();
