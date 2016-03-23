/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    // 项目
    .factory('ktProductsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/products/:productID', {
            productID: '@productID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 联系我们
    .factory('ktContactUsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/contact_us', {
            productID: '@productID'
        })
    })

    // 内部打点
    .factory('ktLogService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/shadows')
    })

    // 资产
    .factory('ktAssetService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/fame_assets/:content', {
            content: '@content'
        })
    })

    // 资产过滤条件
    .factory('ktAssetFiltersService', function($resource, ktApiVersion, ktAjaxCache) {
        return $resource('/api/' + ktApiVersion + '/fame_assets/settings', {}, {
            get: {
                method: 'GET',
                cache: ktAjaxCache
            }
        })
    })

    // 产品信息
    .factory('ktCompassAssetService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/compass_assets/:content', {
            content: '@content'
        })
    })

    // 产品过滤条件
    .factory('ktCompassAssetFiltersService', function($resource, ktApiVersion, ktAjaxCache) {
        return $resource('/api/' + ktApiVersion + '/compass_assets/settings', {}, {
            get: {
                method: 'GET',
                cache: ktAjaxCache
            }
        })
    })

    // 资产意向
    .factory('ktAssetIntentionService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/asset_intentions')
    })

    // 用户反馈
    .factory('ktFeedbackService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/feedbacks')
    })

    // 总览
    .factory('ktOverviewService', function($resource, ktAjaxCache, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/stats/overview', {}, {
            get: {
                cache: ktAjaxCache
            }
        })
    })

    // 市场数据
    .factory('ktMarketAnalyticsService', function($resource, ktApiVersion, ktAjaxCache) {
        return $resource('/api/' + ktApiVersion + '/stats/detail', {}, {
            get: {
                cache: ktAjaxCache
            }
        })
    })


    // 市场数据过滤条件
    .factory('ktMarketSettingsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/stats/settings')
    })

    // 资管类数据
    .factory('ktRateTrendService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/stats/rate_trend')
    })
})();
