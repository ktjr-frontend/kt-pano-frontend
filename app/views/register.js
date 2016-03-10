;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktRegisterCtrl', function($scope, $rootScope, $stateParams, $timeout, $state, ktRegisterService, ktSweetAlert, ktGetCaptcha) {
            $scope.registerUser = {}

            $scope.submitForm = function() {
                $scope.pendingRequests = true

                ktRegisterService.save($scope.registerUser).$promise.then(function(res) {
                    $scope.pendingRequests = false

                    ktSweetAlert.swal({
                        title: '注册成功！',
                        text: '',
                        type: 'success',
                    }, function() {
                        $state.go('account.perfect')
                    });

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
            
            var getCaptcha = ktGetCaptcha.getCaptcha($scope, ktRegisterService, {content: 'captcha'}, $scope.registerUser)

            // 获取验证码，首先校验图形验证码，通过事件的异步方式
            $scope.getCaptcha = function($event, channel, captchaId) {
                $event.preventDefault()
                $event.stopPropagation()

                /*var CAPTCHA = $scope.captchaSettings.CAPTCHA
                if (!CAPTCHA) {
                    ktSweetAlert.swal({
                        title: '验证码组件有误',
                        text: '验证码组件有误！',
                        type: 'error',
                    });
                    return
                }*/

                // CAPTCHA.validate($scope.registerUser.img_captcha, function(isValid) {
                //     if (isValid) {
                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return

                //获取语音或短信验证码
                getCaptcha($scope.registerUser.mobile, channel)
                /*ktRegisterService.get({
                        content: 'captcha',
                        mobile: $scope.registerUser.mobile,
                        channel: channel
                    }, function(data) {
                        $scope.registerUser.verif_id = data.verif_id
                        if (channel === 'sms') {
                            $scope.waitCaptchaMessage = true;
                            timerMessage(60);
                        } else {
                            $scope.waitCaptchaTel = true;
                            timerTel(60);
                        }

                    }, function(data) {
                        ktSweetAlert.swal({
                            title: '发送失败',
                            text: data.msg || '抱歉，系统繁忙！',
                            type: 'error',
                        });
                    })*/
                    //     } else {
                    //         $timeout(function() {
                    //             ktSweetAlert.swal({
                    //                 title: '',
                    //                 text: '图形验证码不正确！',
                    //                 type: 'error',
                    //             }, function() {
                    //                 var form = CAPTCHA._container.closest('form')
                    //                 form.trigger('accessible.' + form.attr('id'), {
                    //                     field: 'img_captcha'
                    //                 })
                    //                 $scope.registerUser.img_captcha = '';
                    //             });
                    //         }, 100)
                    //     }
                    // })
                return false
            }



        })
})();
