;
(function() {
    'use strict';
    angular.module('kt.pano')
        .provider('ktPanoRoutes', function(ktLazyResolveProvider) {
            var ktLazyResolve = ktLazyResolveProvider.$get()
            this.$get = {}
            this.routes = {
                /**
                 *  微贷平台
                 */
                'pano': {
                    url: '/pano?apimock', //父view的设置，通过ui-sref的跳转会将参数带到子view
                    abstract: true,
                    templateUrl: 'views/common/pano.html',
                    data: {
                        breadcrumb: false,
                        pageTitle: '微贷平台',
                        permit: ['login'],
                        specialClass: 'pano-page'
                    },
                    resolve: ktLazyResolve(['views/common/pano.js'], {

                        user: function($q, $rootScope, $state, ktUserService) {
                            var deferred = $q.defer()
                            ktUserService.get(function(res) {
                                $rootScope.defaultRoute = 'pano.overview'
                                $rootScope.user = res.account
                                if (res.account.refilled !== 'true') {
                                    $state.go('account.perfect')
                                    return
                                }

                                deferred.resolve(res.account)
                            }, function() {
                                deferred.resolve(null)
                            })
                            return deferred.promise
                        }
                    }),
                    controller: 'ktPanoCtrl'
                },

                // 总览
                'pano.overview': {
                    url: '/overview',
                    templateUrl: 'views/pano/overview.html',
                    resolve: ktLazyResolve([
                        'views/pano/overview.js',
                        'common/directives/kt-echart3-directive.js',
                        'common/directives/kt-linemenu-directive.js'
                    ]),
                    controller: 'ktOverviewCtrl',
                    data: {
                        // breadcrumb: true,
                        // breadcrumbTitle: '资产特征',
                        pageTitle: '总览',
                    }
                },

                // 产品信息 
                'pano.products': {
                    abstract: true,
                    url: '/products',
                    templateUrl: 'views/pano/products/layout.html',
                    resolve: ktLazyResolve([
                        'views/pano/products/layout.js',
                    ]),
                    controller: 'ktProductsLayoutCtrl',
                    data: {
                        pageTitle: '产品信息',
                    }
                },
                'pano.products.obligatoryRight': {
                    url: '/obligatory_right?asset_type&status&published_date&period&fund&exchange&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/products/obligatory_right.html',
                    resolve: ktLazyResolve([
                        'views/pano/products/obligatory_right.js',
                    ]),
                    controller: 'ktProductObligatoryRightCtrl',
                    data: {
                        pageTitle: '产品信息-债权类',
                    }
                },
                'pano.products.assetManage': {
                    url: '/asset_manage?asset_type&status&published_date&period&fund&exchange&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/products/asset_manage.html',
                    resolve: ktLazyResolve([
                        'views/pano/products/asset_manage.js',
                    ]),
                    controller: 'ktProductAssetManageCtrl',
                    data: {
                        pageTitle: '产品信息-资管类',
                    }
                },
                // 可预约产品 
                'pano.order': {
                    abstract: true,
                    url: '/order',
                    templateUrl: 'views/pano/order/layout.html',
                    resolve: ktLazyResolve([
                        'views/pano/order/layout.js',
                    ]),
                    controller: 'ktOrderLayoutCtrl',
                    data: {
                        pageTitle: '可预约产品',
                    }
                },
                'pano.order.obligatoryRight': {
                    url: '/obligatory_right?asset_type_eq&life_days_in&guarantees_eq&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/order/obligatory_right.html',
                    resolve: ktLazyResolve([
                        'views/pano/order/obligatory_right.js',
                    ]),
                    controller: 'ktOrderObligatoryRightCtrl',
                    data: {
                        pageTitle: '可预约产品-债权类',
                    }
                },

                'pano.order.assetManage': {
                    url: '/asset_manage?asset_type_eq&life_days_in&guarantees_eq&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/order/asset_manage.html',
                    resolve: ktLazyResolve([
                        'views/pano/order/asset_manage.js',
                    ]),
                    controller: 'ktOrderAssetManageCtrl',
                    data: {
                        pageTitle: '可预约产品-资管类',
                    }
                },

                'pano.settings': {
                    url: '/settings',
                    templateUrl: 'views/pano/account/settings.html',
                    resolve: ktLazyResolve([
                        'common/factories/kt-captcha.js',
                        'views/pano/account/settings.js'
                    ]),
                    controller: 'ktSettingsCtrl',
                    data: {
                        pageTitle: '账户设置',
                        specialClass: 'simple-page'
                    }
                },

            }
        })
})();
