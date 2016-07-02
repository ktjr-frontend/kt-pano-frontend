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
                        // permit: ['login'],
                        specialClass: 'pano-page'
                    },
                    resolve: ktLazyResolve(['views/common/pano.js'], {

                        user: function($q, $rootScope, $state, ktUserService) {
                            'ngInject';
                            var deferred = $q.defer()

                            ktUserService.get(function(res) {
                                $rootScope.defaultRoute = 'pano.overview'
                                $rootScope.user = res.account

                                // 强制跳转标记，避免从pano.** -> pano.** 跳转的死循环
                                if (!$rootScope.forceJumpState) {
                                    if (res.account.role === 'unfilled') {
                                        $state.go('account.perfect')
                                        return
                                    } else if (res.account.role === 'rejected') {
                                        $state.go('pano.settings', { forceJump: true })
                                        return
                                    }
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
                        'views/pano/overview.css',
                        'views/pano/overview.js',
                        'common/directives/kt-echart3-directive.js'
                    ]),
                    controller: 'ktOverviewCtrl',
                    data: {
                        permits: [{
                            name: 'role', // 角色维度的权限
                            value: ['passed', 'unchecked']
                        }],
                        // breadcrumb: true,
                        // breadcrumbTitle: '资产特征',
                        pageTitle: '总览',
                    }
                },

                // 产品信息
                'pano.market': {
                    abstract: true,
                    url: '/market',
                    templateUrl: 'views/pano/market/layout.html',
                    resolve: ktLazyResolve([
                        'views/pano/market/layout.js',
                    ]),
                    controller: 'ktMarketLayoutCtrl',
                    data: {
                        permits: [{
                            name: 'role', // 角色维度的权限
                            value: ['passed']
                        }],
                        pageTitle: '市场数据',
                    }
                },
                'pano.market.default': {
                    url: '/default?type&from&credit_right_or&start_at&end_at&dimension&asset_type&mapped_exchange&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/market/default.html',
                    resolve: ktLazyResolve([
                        'views/pano/market/default.js',
                        'common/directives/kt-echart3-directive.js'
                    ]),
                    controller: 'ktMarketCtrl',
                    data: {
                        pageTitle: '市场数据',
                    }
                },
                /*'pano.market.obligatoryRight': {
                    url: '/obligatory_right?type&from&credit_right_or&start_at&end_at&dimension&asset_type&mapped_exchange&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/market/obligatory_right.html',
                    resolve: ktLazyResolve([
                        'views/pano/market/obligatory_right.js',
                    ]),
                    controller: 'ktMarketObligatoryRightCtrl',
                    data: {
                        pageTitle: '产品信息-债权类',
                    }
                },
                'pano.market.assetManage': {
                    url: '/asset_manages?type&from&credit_right_or&start_at&end_at&dimension&asset_type&mapped_exchange&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/market/asset_manage.html',
                    resolve: ktLazyResolve([
                        'views/pano/market/asset_manage.js',
                    ]),
                    controller: 'ktMarketAssetManageCtrl',
                    data: {
                        pageTitle: '产品信息-资管类',
                    }
                },*/
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
                        permits: [{
                            name: 'role', // 角色维度的权限
                            value: ['passed']
                        }],
                        pageTitle: '产品信息',
                    }
                },
                'pano.products.obligatoryRight': {
                    url: '/obligatory_right?status_eq&life_days_in&rate_in&asset_type_eq&exchange_eq&from_eq&page&per_page&sort_by&order',
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
                    url: '/asset_manages?status_eq&rate_in&life_days_in&credit_manager_eq&from_eq&page&per_page&sort_by&order',
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
                        permits: [{
                            name: 'role', // 角色维度的权限
                            value: ['passed']
                        }],
                        pageTitle: '可预约产品',
                    }
                },
                'pano.order.obligatoryRight': {
                    url: '/obligatory_right?asset_type_eq&status_eq&guarantees_eq&page&per_page&sort_by&order',
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
                    url: '/asset_manage?rate_in&status_eq&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/order/asset_manage.html',
                    resolve: ktLazyResolve([
                        'views/pano/order/asset_manage.js',
                    ]),
                    controller: 'ktOrderAssetManageCtrl',
                    data: {
                        pageTitle: '可预约产品-资管类',
                    }
                },

                // 机构
                'pano.institutions': {
                    abstract: true,
                    url: '/institutions',
                    template: '<ui-view/>',
                    data: {
                        permits: [{
                            name: 'role', // 角色维度的权限
                            value: ['passed']
                        }],
                        pageTitle: '机构',
                    }
                },
                'pano.institutions.detail': {
                    url: '/:id?dimension',
                    templateUrl: 'views/pano/institutions/detail.html',
                    resolve: ktLazyResolve([
                        'common/directives/kt-echart3-directive.js',
                        'views/pano/institutions/detail.js',
                        'views/pano/institutions/detail.css',
                    ]),
                    controller: 'ktInsitutionCtrl',
                    data: {
                        pageTitle: '机构详情页',
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
                    params: {
                        forceJump: false // 强制跳入开关，避免当前pano resolve内的跳转造成死循环
                    },
                    data: {
                        pageTitle: '账户设置',
                        specialClass: 'simple-page'
                    }
                },

            }
        })
})();
