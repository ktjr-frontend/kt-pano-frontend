;
(function() {
    'use strict';
    angular.module('kt.pano')
        .provider('ktRouter', function($rootScopeProvider, $stateProvider, $urlRouterProvider, ktPanoRoutesProvider, ktAccountRoutesProvider, ktErrorRoutesProvider) {

            var setUpRoutes = function(routes) {
                _.each(routes, function(v, k) {
                    $stateProvider.state(k, v)
                })
            }
            var redirectTo = function(url) {
                return function($injector, $location) {
                    var ktUrlGet = $injector.get('ktUrlGet')
                    var search = $location.search()
                    return ktUrlGet(url, search)
                }
            }

            this.run = function() {
                // 默认跳转页面
                $urlRouterProvider.when('', redirectTo('/pano/overview')); // for hashbang mode
                $urlRouterProvider.when('/', redirectTo('/pano/overview')); // for html5mode
                // $urlRouterProvider.otherwise('/error/404');
                $urlRouterProvider.otherwise(redirectTo('/error/404'));

                setUpRoutes(ktPanoRoutesProvider.routes)
                setUpRoutes(ktAccountRoutesProvider.routes)
                setUpRoutes(ktErrorRoutesProvider.routes)

            }

            this.$get = {}
        })
})();
