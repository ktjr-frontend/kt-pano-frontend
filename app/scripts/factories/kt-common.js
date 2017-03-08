;
(function() {
    'use strict';
    angular.module('kt.pano')
        // api 缓存
        .factory('ktApiCache', function($cacheFactory) {
            return $cacheFactory('ktApiCache');
        })
        // 登录通用控制函数
        .factory('ktLoginCommon', function($rootScope, $window, $templateRequest, $state, $location,
            ktLoginService, ktUserService, ktPermits, ktRedirectState, ktSweetAlert, ktUrlGet, CacheFactory) {
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

                        // 登录成功获取用户信息
                        ktUserService.get(function(data) {
                            var wantGo = $rootScope.wantGo
                            $rootScope.defaultRoute = 'pano.overview'
                            var defaultState = $state.get($rootScope.defaultRoute)
                                // data.account.group = 'certified'
                                // data.account.status = 'pended'
                            $rootScope.user = data.account

                            if (wantGo && ktPermits(wantGo.toState, true)) {
                                $location.url($state.href(wantGo.toState.name, wantGo.toParams))
                            } else if (!ktPermits(defaultState, true)) {
                                $state.go(ktRedirectState(), $location.search())
                            } else {
                                $state.go($rootScope.defaultRoute)
                            }
                            successCallback && successCallback(res, data) // eslint-disable-line
                        })
                    }

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
        // 获取短信或者语音验证码
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
        // 退出登录
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
        // 升级到高级会员
        .factory('ktUpgradeMember', function($uibModal) {
            return function() {
                $uibModal.open({
                    size: 'md',
                    backdrop: 'static',
                    // animation: false,
                    templateUrl: 'views/modals/upgrade_member.html',
                    controller: function($scope, $rootScope, $uibModalInstance, $timeout, $window, ktEnv, ktAccountService, ktSweetAlert) {
                        $scope.title = '升级到高级会员'
                        $scope.inviteUrl = ktEnv().host + '/account/register?_u=' + $rootScope.user.id
                        $scope.user = {
                            wx: $rootScope.user.wx
                        }

                        $scope.autoCopyDisabled = $window.isSafari() || $window.isSogou()
                        $scope.copyTooltip = '按' + ($window.isWindows() ? 'Ctrl' : '⌘') + '-C复制!'
                        $scope.copySuccess = function() {
                            $scope.tooltipIsOpen = true
                            $timeout(function() {
                                $scope.tooltipIsOpen = false
                            }, 1000)
                        }

                        // 提交微信号
                        $scope.submitForm = function() {
                            ktAccountService.save({
                                content: 'get_premium_by_wx',
                                wx: $scope.user.wx
                            }, function() {
                                ktSweetAlert.swal({ title: '', text: '已提交，稍后工作人员会与您联系' })
                                $uibModalInstance.close()
                            }, function(res) {
                                $uibModalInstance.close()
                                ktSweetAlert.swal({
                                    title: '',
                                    text: res.error || '您的申请正在审核中，勿重复提交'
                                })
                            })
                        }

                        $scope.cancel = function(event) {
                            event.preventDefault()
                            $uibModalInstance.dismiss('cancel')
                        }
                    }
                })
            }
        })
        // 环境变量
        .factory('ktEnv', function() {
            var hostMap = {
                'localhost': 'http://dev-pano.ktjr.com',
                'dev-pano.ktjr.com': 'http://dev-pano.ktjr.com',
                'stage-pano.ktjr.com': 'http://stage-pano.ktjr.com',
                'pano.ktjr.com': 'http://pano.ktjr.com',
            }

            return function() {
                var hostname = location.hostname
                return { host: hostMap[hostname] || 'http://pano.ktjr.com' }
            }

        })
})();
