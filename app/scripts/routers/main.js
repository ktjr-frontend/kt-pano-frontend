;
(function() {
    'use strict';
    angular.module('kt.pano')
        .provider('ktRouter', function($stateProvider, $urlRouterProvider, ktHomeRoutesProvider, ktPanoRoutesProvider, ktAccountRoutesProvider, ktErrorRoutesProvider) {

            var setUpRoutes = function(routes) {
                _.each(routes, function(v, k) {
                    $stateProvider.state(k, v)
                })
            }
            var redirectTo = function(url) {
                var fn = function($injector, $location) {
                    var ktUrlGet = $injector.get('ktUrlGet')
                    var search = $location.search()
                    return ktUrlGet(url, search)
                }
                fn.$inject = ['$injector', '$location'] //手动写注入，otherwise不支持数组参数
                return fn
            }

            this.run = function() {
                // 默认跳转页面
                $urlRouterProvider.when('', redirectTo('/index')); // for hashbang mode
                $urlRouterProvider.when('/', redirectTo('/index')); // for html5mode
                // $urlRouterProvider.otherwise('/error/404');
                $urlRouterProvider.otherwise(redirectTo('/index'));

                setUpRoutes(ktHomeRoutesProvider.routes)
                setUpRoutes(ktPanoRoutesProvider.routes)
                setUpRoutes(ktAccountRoutesProvider.routes)
                setUpRoutes(ktErrorRoutesProvider.routes)

            }

            this.$get = {}
        })
})();
