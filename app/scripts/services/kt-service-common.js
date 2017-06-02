/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    // 产品
    .factory('ktProductsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/products/:content', {
            content: '@content'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 机构
    .factory('ktInsitutionsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/institutions/:instID', {
            instID: '@instID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 机构库
    .factory('ktInsitutionRepositoriesService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/inst_repositories/:instID', {
            instID: '@instID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 资产
    .factory('ktAssetService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/fame_assets/:content', {
            content: '@content'
        })
    })

    // 产品信息
    .factory('ktCompassAssetService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/compass_assets/:content', {
            content: '@content'
        })
    })

    // 资产意向
    .factory('ktAssetIntentionService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/asset_intentions')
    })

    // 统计分析-总览，市场数据也
    .factory('ktAnalyticsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/stats/:content', {
            content: '@content'
        })
    })

    // 联系我们
    .factory('ktContactUsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/contact_us')
    })

    // 内部打点
    .factory('ktLogService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/shadows')
    })

    // 用户反馈
    .factory('ktFeedbackService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/feedbacks')
    })

    // 上传名片正面
    .factory('ktBusinessCardUpload', function($urlMatcherFactory, Upload, ktApiVersion) {
        return function upload(data) {
            var url = $urlMatcherFactory.compile('/api/' + ktApiVersion + '/cards').format(data)
            return Upload.upload({
                url: url,
                data: data || {}
            })
        }
    })

    // 上传名片背面
    .factory('ktBusinessCardBackUpload', function($urlMatcherFactory, Upload, ktApiVersion) {
        return function upload(data) {
            var url = $urlMatcherFactory.compile('/api/' + ktApiVersion + '/back_cards').format(data)
            return Upload.upload({
                url: url,
                data: data || {}
            })
        }
    })

    // 获取用户上传的名片
    .factory('ktCardsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/cards/:content', {
            content: '@content'
        })
    })

    // 获取用户上传的名片
    .factory('ktBackCardsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/back_cards/:content', {
            content: '@content'
        })
    })

    // 产品详情内趋势图
    .factory('ktProductTrendsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/product_trends')
    })
    // 总览页 or 机构信息页
    .factory('ktInstitutionalInfoService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/institutions/overview')
    })
    // 总览页最新机构信息
    .factory('ktNewProductService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/institutions/latest_products_info')
    })
    // 各产品收益率表
    .factory('ktProductRateService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/quotes/list')
    })
    //小微资产筛选列表
    .factory('ktSmallAssetsSettingService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/micro_finances/settings')
    })
    //小微资产筛选table
    .factory('ktSmallAssetsTableService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/micro_finances')
    })
    // .factory('ktSmallAssetsSettingService', function($resource, ktApiVersion) {
    //     return $resource('/api/' + ktApiVersion + '/micro_finances/settings')
    // })
    // .factory('ktSmallAssetsTableService', function($resource, ktApiVersion) {
    //     return $resource('/api/' + ktApiVersion + '/micro_finances')
    // })
})();
