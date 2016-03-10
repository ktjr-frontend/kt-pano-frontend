;
(function() {
    'use strict';
    angular.module('kt.pano')
    .provider('ktErrorRoutes', function(ktLazyResolveProvider) {
        var ktLazyResolve = ktLazyResolveProvider.$get()
        this.$get = {}
        this.routes = {
            /**
             * 错误页面
             */
            'error': {
                abstract: true,
                url: '/error?apimock&inst_type&role',
                templateUrl: 'views/common/empty.html',
                resolve: ktLazyResolve(['views/error/errors.js']),
                controller: 'ktErrorsCtrl',
                data: {
                    pageTitle: '错误',
                    specialClass: 'error-page'
                }
            },
            'error.404': {
                url: '/404',
                templateUrl: 'views/error/404.html',
                data: {
                    pageTitle: '页面未找到'
                }
            },
            'error.500': {
                url: '/500',
                templateUrl: 'views/error/500.html',
                data: {
                    pageTitle: '服务器故障'
                }
            },
        }
    })
})();
