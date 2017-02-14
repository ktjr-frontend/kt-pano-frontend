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
        .factory('ktLoginCommon', function($rootScope, $window, $templateRequest, $state, $location, ktLoginService, ktSweetAlert, ktUrlGet, CacheFactory) {
            return function(scope, successCallback, errorCallback) {
                scope.pendingRequests = true

                $window.localStorage.user = JSON.stringify({
                    mobile: scope.user.remember ? scope.user.mobile : '',
                    remember: scope.user.remember
                })

                ktLoginService.save(scope.user).$promise.then(function(res) {
                    scope.pendingRequests = false

                    if (res.token) {
                        CacheFactory.clearAll()
                        $window.localStorage.token = res.token
                        var url = $rootScope.wantJumpUrl || ktUrlGet('/pano/overview', $.extend({ jump: true }, $location.search()))
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

                    // 错误模板
                    $templateRequest('views/tooltips/login_error.html').then(function(tpl) {
                        var errorText = _.template(tpl)
                        ktSweetAlert.swal({
                            title: '',
                            text: errorText({
                                title: '登录失败',
                                text: error
                            }),
                            html: true,
                            // type: 'error',
                            customClass: 'login-error'
                        })

                        errorCallback && errorCallback(res) // eslint-disable-line
                    })

                })
            }
        })
        .factory('ktGetCaptcha', function(ktSweetAlert, ktCaptchaHelper) {
            return {
                initCaptcha: function(scope, service, params, model) {
                    scope.waitCaptchaMessage = false;
                    scope.waitCaptchaTel = false;

                    return function(reqParams) {
                        var timerMessage = ktCaptchaHelper.timerMessage(scope)
                        var timerTel = ktCaptchaHelper.timerTel(scope)

                        service.get($.extend(reqParams, params), function(data) {
                            model.verif_id = data.verif_id
                            if (reqParams.channel === 'sms') {
                                scope.waitCaptchaMessage = true;
                                timerMessage(60);
                            } else {
                                scope.waitCaptchaTel = true;
                                timerTel(60);
                            }

                        }, function(data) {
                            scope.refreshImgCaptcha()
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
        .factory('ktSession', function($window, $rootScope, ipCookie, CacheFactory) {
            return {
                clear: function() {
                    // delete $window.localStorage.user
                    delete $window.localStorage.token
                        // $rootScope.currentUrl = ''
                    $rootScope.user = null
                    $rootScope.wantJumpUrl = ''
                    ipCookie.remove('token')
                    CacheFactory.clearAll()
                }
            }
        })

})();
