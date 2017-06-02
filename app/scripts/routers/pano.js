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
                    url: '/pano?apimock&{_t:any}', //父view的设置，通过ui-sref的跳转会将参数带到子view
                    abstract: true,
                    templateUrl: 'views/common/pano.html',
                    data: {
                        breadcrumb: false,
                        pageTitle: '微贷平台',
                        specialClass: 'pano-page'
                    },
                    resolve: ktLazyResolve(['views/common/pano.js']),
                    controller: 'ktPanoCtrl'
                },

                // 总览
                'pano.overview': {
                    url: '/overview',
                    templateUrl: 'views/pano/overview.html',
                    resolve: ktLazyResolve([
                        'views/pano/overview.css',
                        'views/pano/overview.js',
                        'common/directives/kt-echart3-directive.js',
                        'common/libs/html2canvas.min.js'
                    ]),
                    controller: 'ktOverviewCtrl',
                    data: {
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }],
                        // breadcrumb: true,
                        // breadcrumbTitle: '资产特征',
                        pageTitle: '总览',
                    }
                },

                // 市场数据
                'pano.market': {
                    abstract: true,
                    url: '/market',
                    templateUrl: 'views/pano/market/layout.html',
                    resolve: ktLazyResolve([
                        'views/pano/market/layout.js',
                    ]),
                    controller: 'ktMarketLayoutCtrl',
                    data: {
                        rejectedLimit: true, // 拒绝用户限制
                        normalLimit: true, // 用于正常路由，但是非认证用户弹出提示框
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
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
                // 'pano.market.obligatoryRight': {
                //     url: '/obligatory_right?type&from&credit_right_or&start_at&end_at&dimension&asset_type&mapped_exchange&page&per_page&sort_by&order',
                //     templateUrl: 'views/pano/market/obligatory_right.html',
                //     resolve: ktLazyResolve([
                //         'views/pano/market/obligatory_right.js',
                //     ]),
                //     controller: 'ktMarketObligatoryRightCtrl',
                //     data: {
                //         pageTitle: '产品信息-债权类',
                //     }
                // },
                'pano.market.assetManage': {
                    url: '/asset_manages',
                    templateUrl: 'views/pano/market/asset_manage.html',
                    resolve: ktLazyResolve([
                        'views/pano/market/asset_manage.js',
                    ]),
                    controller: 'ktOrderAssetManageCtrl',
                    data: {
                        pageTitle: '产品信息-资管类',
                    }
                },
                //说明页
                'pano.explain': {
                    url: '/explain',
                    templateUrl: 'views/pano/account/explain.html',
                    resolve: ktLazyResolve([
                        'views/pano/account/explain.css'
                    ])
                },
                // 产品信息
                'pano.products': {
                    abstract: true,
                    url: '/products',
                    templateUrl: 'views/pano/products/layout.html',
                    resolve: ktLazyResolve([
                        'views/pano/products/layout.js',
                        'views/pano/products/layout.css',
                    ]),
                    controller: 'ktProductsLayoutCtrl',
                    data: {
                        rejectedLimit: true,
                        normalLimit: true,
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }],
                        pageTitle: '产品信息',
                    }
                },
                'pano.products.obligatoryRight': {
                    url: '/obligatory_right?search_fields[]&key_word&created_or_updated_in&status_eq&credit_manager_eq&life_days_in&rate_in&asset_type_eq&exchange_eq&from_eq&page&per_page&sort_by&order',
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
                    url: '/asset_manages?search_fields[]&key_word&created_or_updated_in&status_eq&rate_in&life_days_in&credit_manager_eq&from_eq&page&per_page&sort_by&order',
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
                        rejectedLimit: true,
                        normalLimit: true,
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected']
                            }
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
                        // normalLimit: true,
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }],
                        pageTitle: '机构',
                    }
                },

                // 机构信息默认页
                'pano.institutions.dashboard': {
                    url: '/dashboard',
                    templateUrl: 'views/pano/institutions/dashboard.html',
                    resolve: ktLazyResolve([
                        'views/pano/institutions/dashboard.js',
                        'views/pano/institutions/dashboard.css',
                    ]),
                    controller: 'ktInsitutionDashboardCtrl',
                    data: {
                        pageTitle: '机构信息',
                    }
                },
                // 机构信息列表页
                'pano.institutions.table': {
                    url: '/table',
                    abstract: true,
                    templateUrl: 'views/pano/institutions/layout.html',
                    resolve: ktLazyResolve([
                        'views/pano/institutions/layout.js',
                        'views/pano/institutions/layout.css',
                    ]),
                    controller: 'ktInstitutionsLayoutCtrl',
                    data: {
                        pageTitle: '机构信息列表',
                    }
                },
                'pano.institutions.table.list': {
                    url: '/list?search_fields[]&key_word&institution_type&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/institutions/list.html',
                    resolve: ktLazyResolve([
                        'views/pano/institutions/list.js',
                        'views/pano/institutions/list.css',
                    ]),
                    controller: 'ktInsitutionListCtrl',
                    data: {
                        pageTitle: '机构信息列表',
                    }
                },
                'pano.institutions.detail': {
                    url: '/detail/:id?dimension',
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
                // 资产产品详情页
                'pano.productObligatoryRight': {
                    url: '/product_obligatory_right/:id',
                    templateUrl: 'views/pano/products/obligatory_right/obligatory_right.html',
                    data: {
                        rejectedLimit: true,
                        normalLimit: true,
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected'],
                            }
                        }],
                        pageTitle: '产品信息',
                    },
                    resolve: ktLazyResolve([
                        'views/pano/products/obligatory_right/obligatory_right.css',
                        'views/pano/products/obligatory_right/obligatory_right.js',
                        'views/pano/products/assets_manage_common.css',
                        'common/directives/kt-echart3-directive.js',
                        'common/directives/datepicker/directive.js',
                        'common/directives/datepicker/theme/v4/style.css'
                    ]),
                    controller: 'ktAssetsCtrl'
                },

                // 资管产品详情页
                'pano.productAssetManage': {
                    url: '/product_asset_manage/:id',
                    templateUrl: 'views/pano/products/asset_manage/asset_manage.html',
                    resolve: ktLazyResolve([
                        'views/pano/products/assets_manage_common.css',
                        'views/pano/products/asset_manage/asset_manage.css',
                        'views/pano/products/asset_manage/asset_manage.js',
                        'common/directives/kt-echart3-directive.js',
                        'common/directives/datepicker/directive.js',
                        'common/directives/datepicker/theme/v4/style.css'
                    ]),
                    controller: 'ktAssetManageCtrl',
                    data: {
                        rejectedLimit: true,
                        normalLimit: true,
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected'],
                            }
                        }]
                    }
                },
                'pano.settings': {
                    url: '/settings',
                    templateUrl: 'views/pano/account/settings.html',
                    resolve: ktLazyResolve([
                        'views/pano/account/settings.css',
                        'common/factories/kt-captcha.js',
                        'common/directives/kt-qrcode-directive.js',
                        'scripts/directives/business-card-upload/style.css',
                        'scripts/directives/business-card-upload/directive.js',
                        'scripts/directives/prefer-setting/style.css',
                        'scripts/directives/prefer-setting/directive.js',
                        'views/pano/account/settings.js'
                    ]),
                    controller: 'ktSettingsCtrl',
                    data: {
                        pageTitle: '账户设置',
                        specialClass: 'simple-page',
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    }
                },
                'pano.find': {
                    url: '/find',
                    templateUrl: 'views/pano/account/find/find.html',
                    resolve: ktLazyResolve([
                        'views/pano/account/find/find.css',
                        'views/pano/account/find/find.js',
                        'common/directives/kt-qrcode-directive.js',
                        'scripts/directives/business-card-upload/directive.js'
                    ]),
                    controller: 'ktFindCtrl',
                    data: {
                        pageTitle: '找人',
                        specialClass: 'simple-page',
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    }
                },
                'pano.findRecord': {
                    url: '/findRecord?page&per_page',
                    templateUrl: 'views/pano/account/find/findRecord.html',
                    resolve: ktLazyResolve([
                        'views/pano/account/find/findRecord.css',
                        'views/pano/account/find/findRecord.js'
                    ]),
                    controller: 'ktFindRecordCtrl',
                    data: {
                        pageTitle: '找人',
                        specialClass: 'simple-page',
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    }
                },
                //小微资产专栏
                'pano.smallAssetsLists': {
                    abstract: true,
                    url: '/small_assets_lists',
                    template: '<ui-view/>',
                    data: {
                        pageTitle: '小微资产专栏',
                        specialClass: 'simple-page',
                        rejectedLimit: true,
                        permits: [{
                            name: 'role', // 角色维度的权限
                            group: {
                                premium: ['passed', 'pended', 'rejected'],
                                certified: ['passed', 'pended', 'rejected'],
                                normal: ['passed', 'pended', 'rejected']
                            }
                        }]
                    }
                },

                'pano.smallAssetsLists.table': {
                    abstract: true,
                    url: '/table',
                    templateUrl: 'views/pano/small_assets_lists/layout.html',
                    resolve: ktLazyResolve([
                        'views/pano/small_assets_lists/layout.css',
                        'views/pano/small_assets_lists/layout.js'
                    ]),
                    controller: 'ktAssetsTableCtrl',
                    data: {
                        pageTitle: '小微资产专栏'
                    }
                },
                'pano.smallAssetsLists.table.list': {
                    url: '/list?search_fields[]&key_word&finance_type_eq&page&per_page&sort_by&order',
                    templateUrl: 'views/pano/small_assets_lists/list.html',
                    resolve: ktLazyResolve([
                        'views/pano/small_assets_lists/list.css',
                        'views/pano/small_assets_lists/list.js'
                    ]),
                    controller: 'ktAssetsTableListCtlr',
                    data: {
                        pageTitle: '小微资产'
                    }
                }
            }
        })
})();
