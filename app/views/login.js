;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktLoginCtrl', function($scope, $rootScope, $state, $window, $timeout, $uibModal, ktSweetAlert, ktLoginCommon) {

            $rootScope.goHome = function() {
                $state.go('home.index')
            }

            try {
                $window.localStorage.getItem('nothing')
            } catch (e) {
                ktSweetAlert.swal({
                    title: '错误：',
                    text: '您的浏览器不支持localStorage，可能是无痕浏览模式导致的，请不要使用无痕上网模式',
                    type: 'error',
                })
            }

            // $scope.captchaSettings = {
            //     randomColours: false,
            //     colour1: '#eef7fb', //背景
            //     colour2: '#4a6920' //前景
            // }

            $scope.user = $rootScope.user = JSON.parse($window.localStorage.user || '{}')

            $scope.submitForm = function() {
                ktLoginCommon($scope)
                    // var CAPTCHA = $scope.captchaSettings.CAPTCHA
                    // if (!CAPTCHA) return

                /*CAPTCHA.validate($scope.user.img_captcha, function(isValid) {
                        var form = CAPTCHA._container.closest('form')

                        if (isValid) {
                            $window.localStorage.user = JSON.stringify({
                                mobile: $scope.user.remember ? $scope.user.mobile : '',
                                remember: $scope.user.remember
                            })

                            ktLoginCommon($scope, null, function() {

                                CAPTCHA.generate() //刷新验证码
                                $scope.user.img_captcha = null
                                $scope.loginForm.img_captcha.$setPristine() //回复原始避免显示验证码错误

                                form.trigger('accessible.' + form.attr('id'), {
                                    field: 'mobile'
                                })
                            })

                        } else {
                            $timeout(function() {
                                ktSweetAlert.swal({
                                    title: '图形验证码不正确！',
                                    text: '',
                                    type: 'error',
                                }, function() {

                                    form.trigger('accessible.' + form.attr('id'), {
                                        field: 'img_captcha'
                                    })
                                    $scope.user.img_captcha = ''
                                })
                            }, 100)
                        }
                    })*/
                // return false
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
        .controller('resetPasswordTwoCtrl', function($scope, $uibModalInstance, ktRecoverService, ktGetCaptcha) {
            $scope.title = '验证手机'
                // $scope.user = {}
            $scope.user.content = 'validate_captcha'
            $scope.user.captcha = ''
            $scope.notLastStep = true

            var getCaptcha = ktGetCaptcha.getCaptcha($scope, ktRecoverService, { content: 'captcha' }, $scope.user)
            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return
                getCaptcha($scope.user.mobile, channel)
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
