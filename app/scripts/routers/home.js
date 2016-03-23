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
                    url: '?apimock',
                    templateUrl: 'views/common/home.html',
                    data: {
                        pageTitle: '开通金融',
                        specialClass: 'landing-page'

                    },
                    resolve: ktLazyResolve([
                        'views/common/home.js',
                        'views/home/index.css'
                    ]),
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
