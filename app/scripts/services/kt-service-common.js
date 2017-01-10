/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    // 项目
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

    // 上传名片
    .factory('ktBusinessCardUpload', function($urlMatcherFactory, Upload, ktApiVersion) {
        return function upload(data) {
            var url = $urlMatcherFactory.compile('/api/' + ktApiVersion + '/cards').format(data)
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

    //资产详情页
    .factory('ktAessetsProductService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/products/:id', {
            id: '@id'
        }, {
            'get': {
                mothod: 'GET',
            }
        })
    })
    .factory('ktAessetsProductTrendService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/product_trends/:id', {
            id: '@id'
        }, {
            'get': {
                mothod: 'GET'
            }
        })
    })
    //资管详情页
    .factory('ktAessetsManageProductService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/products/:id', {
            id: '@id'
        }, {
            'get': {
                mothod: 'GET',
            }
        })
    })
    .factory('ktAessetsmanageProductTrendService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/product_trends/:id', {
            id: '@id'
        }, {
            'get': {
                mothod: 'GET'
            }
        })
    })
})();
