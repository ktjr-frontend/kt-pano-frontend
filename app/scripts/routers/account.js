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
                        'common/directives/kt-captchaimg-directive.js',
                        'common/factories/kt-captcha.js'
                    ]),
                    controller: ['$scope', function ($scope) {
                        $scope.footerContainer = true
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
                        'views/perfect.js'
                    ]),
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
