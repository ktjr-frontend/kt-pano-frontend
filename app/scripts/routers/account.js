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
                'account.perfect': {
                    url: '/perfect',
                    templateUrl: 'views/perfect.html',
                    resolve: ktLazyResolve([
                        'common/directives/kt-qrcode-directive.js',
                        'scripts/directives/business-card-upload/style.css',
                        'scripts/directives/business-card-upload/directive.js',
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
                        pageTitle: '账户设置',
                        specialClass: 'account-page register-page'
                    }
                },
                'account.login': {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    resolve: ktLazyResolve(['views/login.js']),
                    controller: 'ktLoginCtrl',
                    data: {
                        pageTitle: '登录',
                        specialClass: 'account-page login-page'
                    }
                },
                'account.register': {
                    url: '/register',
                    templateUrl: 'views/register.html',
                    resolve: ktLazyResolve(['views/register.js']),
                    controller: 'ktRegisterCtrl',
                    data: {
                        pageTitle: '入会',
                        specialClass: 'account-page register-page'
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
