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
                        specialClass: 'landing-page'

                    },
                    resolve: ktLazyResolve([
                        'views/common/home.js',
                        'views/home/index.css'
                    ], {
                        user: function($q, $window, $rootScope, $state, ktUserService) {
                            'ngInject';
                            var deferred = $q.defer()
                            if ($window.localStorage.token) {
                                ktUserService.get({
                                    notRequired: true
                                }, function(data) {
                                    $rootScope.user = data.account
                                    $state.go('pano.overview')
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
