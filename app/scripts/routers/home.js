;
(function() {
    'use strict';
    angular.module('kt.pano')
        .provider('ktHomeRoutes', function(ktLazyResolveProvider) {
            var ktLazyResolve = ktLazyResolveProvider.$get()
            this.$get = {}
            this.routes = {
                'home': {
                    abstract: true,
                    url: '?apimock&landingpagetypea&landingpagetypeb',
                    templateUrl: 'views/common/home.html',
                    data: {
                        pageTitle: '开通金融',
                        specialClass: 'landing-page',
                        permits: [{
                            name: 'role',
                            skipAuth: true,
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    },
                    resolve: ktLazyResolve([
                        'views/common/home.js',
                        'views/home/index.css'
                    ], {
                        getUser: function($q, $window, $rootScope, $state, ktUserService) {
                            'ngInject';
                            var deferred = $q.defer()

                            if ($window.localStorage.token && (!$rootScope.user || !$rootScope.user.group)) {
                                ktUserService.get({
                                    notRequired: true
                                }, function(res) {
                                    $rootScope.user = res.account
                                    deferred.resolve(res.account)
                                }, function() {
                                    deferred.resolve(null)
                                })
                            } else {
                                deferred.resolve(null)
                            }
                            return deferred.promise
                        }
                    }),
                    controller: 'ktHomeCtrl'
                },
                'home.index': {
                    url: '/index',
                    templateUrl: 'views/home/index.html',
                    resolve: ktLazyResolve(['views/home/index.js']),
                    controller: 'ktIndexCtrl',
                    data: {
                        pageTitle: '最专业的金融互联网交易服务商'
                    }
                }
            }
        })
})();
