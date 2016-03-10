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
        // 资产意向
        .factory('ktAssetIntentionService', function($resource, ktApiVersion) {
            return $resource('/api/' + ktApiVersion + '/asset_intentions')
        })
        // 用户反馈
        .factory('ktFeedbackService', function($resource, ktApiVersion) {
            return $resource('/api/' + ktApiVersion + '/feedbacks')
        })

})();
