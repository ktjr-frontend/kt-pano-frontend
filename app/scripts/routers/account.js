;
(function() {
    'use strict';
    angular.module('kt.pano')
        .provider('ktAccountRoutes', function(ktLazyResolveProvider) {
            var ktLazyResolve = ktLazyResolveProvider.$get()
            this.$get = {}
            this.routes = {
                /**
                 * 账户相关，包括平台内的账户信息、设置以及登录、注册等
                 */
                'account': {
                    abstract: true,
                    url: '/account?apimock',
                    templateUrl: 'views/common/simple.html',
                    resolve: ktLazyResolve([
                        // 'common/directives/kt-captchaimg-directive.js',
                        'common/factories/kt-captcha.js'
                    ]),
                    controller: ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
                        $scope.footerContainer = true
                        $scope.footerGoHome = function() {
                            $rootScope.bdTrack([$state.name === 'account.register' ? '注册页' : '登录页', '点击', '开通官网'])
                        }
                        $scope.footerContactUs = function() {
                            $rootScope.bdTrack([$state.name === 'account.register' ? '注册页' : '登录页', '点击', '联系我们'])
                        }
                    }],
                    data: {
                        pageTitle: 'Common',
                        specialClass: 'account-page'
                    }
                },

                // 上传名片
                'account.perfect': {
                    url: '/perfect?certifyApplication',
                    templateUrl: 'views/perfect.html',
                    resolve: ktLazyResolve([
                        'common/directives/kt-qrcode-directive.js',
                        'scripts/directives/business-card-upload/style.css',
                        'scripts/directives/business-card-upload/directive.js',
                        'scripts/directives/register-flow/style.css',
                        'scripts/directives/register-flow/directive.js',
                        'views/perfect.js',
                    ], {
                        getUser: function($q, $window, ktUserService) {
                            'ngInject';
                            var deferred = $q.defer()
                            if ($window.localStorage.token) {
                                ktUserService.get(function(data) {
                                    deferred.resolve(data.account)
                                }, function() {
                                    deferred.resolve(null)
                                })
                            } else {
                                deferred.resolve(null)
                            }
                            return deferred.promise
                        }
                    }),
                    controller: 'ktPerfectCtrl',
                    data: {
                        pageTitle: '上传名片',
                        specialClass: 'account-page register-page',
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    }
                },

                // 偏好设置
                'account.prefer': {
                    url: '/prefer?certifyApplication',
                    templateUrl: 'views/prefer.html',
                    resolve: ktLazyResolve([
                        'scripts/directives/register-flow/style.css',
                        'scripts/directives/register-flow/directive.js',
                        'scripts/directives/prefer-setting/style.css',
                        'scripts/directives/prefer-setting/directive.js',
                        'views/prefer.js',
                    ]/*, {
                        userInfo: function($q, $window, ktUserInfoService) {
                            'ngInject';
                            var deferred = $q.defer()
                            if ($window.localStorage.token) {
                                ktUserInfoService.get(function(data) {
                                    deferred.resolve(data)
                                }, function() {
                                    deferred.resolve(null)
                                })
                            } else {
                                deferred.resolve(null)
                            }
                            return deferred.promise
                        }
                    }*/),
                    controller: 'ktPreferCtrl',
                    data: {
                        pageTitle: '偏好设置',
                        specialClass: 'account-page register-page',
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    }
                },
                'account.login': {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    resolve: ktLazyResolve(['views/login.js']),
                    controller: 'ktLoginCtrl',
                    data: {
                        pageTitle: '登录',
                        specialClass: 'account-page login-page',
                        skipAuth: true,
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    }
                },
                'account.register': {
                    url: '/register?_u',
                    templateUrl: 'views/register.html',
                    resolve: ktLazyResolve([
                        'scripts/directives/register-flow/style.css',
                        'scripts/directives/register-flow/directive.js',
                        'views/register.js'
                    ]),
                    controller: 'ktRegisterCtrl',
                    data: {
                        pageTitle: '入会',
                        specialClass: 'account-page register-page',
                        skipAuth: true,
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    }
                },
                /*'account.confirm': {
                    url: '/confirm',
                    templateUrl: 'views/confirm.html',
                    resolve: ktLazyResolve(['views/confirm.js']),
                    controller: 'ktConfirmCtrl',
                    params: {
                        institution: {},
                        user: {}
                    },
                    data: {
                        pageTitle: '信息确认'
                    }
                },*/
            }
        })
})();
