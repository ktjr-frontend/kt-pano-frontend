/**
 * common tools
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular
        .module('kt.pano')
        // 登录通用控制函数
        .factory('ktLoginCommon', function($rootScope, $window, $state, $location, ktLoginService, ktSweetAlert, ktUrlGet, CacheFactory) {
            return function(scope, successCallback, errorCallback) {
                scope.pendingRequests = true

                ktLoginService.save(scope.user).$promise.then(function(res) {
                    scope.pendingRequests = false

                    if (res.token) {
                        CacheFactory.clearAll()
                        $window.localStorage.token = res.token
                        var url = $rootScope.wantJumpUrl || ktUrlGet('/pano/overview', $location.search())
                        $location.url(url)
                            /*eslint-disable*/
                        successCallback && successCallback(res)
                            /*eslint-enable*/
                    }
                    /*else {
                        $state.go('account.confirm', {
                            institution: res.institution,
                            user: scope.user
                        })
                    }*/
                }).catch(function(res) {
                    scope.pendingRequests = false
                    var error = res.error || '登录失败！'
                    if (res.code === 22 && res.name === 'QuotaExceededError') {
                        error = '您的浏览器不支持localStorage,如果您使用的是iOS浏览器，可能是您使用“无痕浏览模式”导致的，请不要使用无痕浏览模式！'
                    }

                    ktSweetAlert.swal({
                        title: '登录失败',
                        text: error,
                        type: 'error',
                    });
                    /*eslint-disable*/
                    errorCallback && errorCallback(res)
                    /*eslint-enable*/

                })
            }
        })
        .factory('ktGetCaptcha', function(ktSweetAlert, ktCaptchaHelper) {
            return {
                getCaptcha: function(scope, service, params, model) {
                    return function(mobile, channel) {
                        var timerMessage = ktCaptchaHelper.timerMessage(scope)
                        var timerTel = ktCaptchaHelper.timerTel(scope)
                        scope.waitCaptchaMessage = false;
                        scope.waitCaptchaTel = false;

                        service.get($.extend({
                            mobile: mobile,
                            channel: channel
                        }, params), function(data) {
                            model.verif_id = data.verif_id
                            if (channel === 'sms') {
                                scope.waitCaptchaMessage = true;
                                timerMessage(60);
                            } else {
                                scope.waitCaptchaTel = true;
                                timerTel(60);
                            }

                        }, function(data) {
                            ktSweetAlert.swal({
                                title: '发送失败',
                                text: data.error || '抱歉，系统繁忙！',
                                type: 'error',
                            });
                        })
                    }
                }
            }
        })

})();
