/**
 * service api version & cache
 */
angular.module('kt.pano')
    .constant('ktApiVersion', 'v1')
    .factory('ktAjaxCache', function(CacheFactory) {
        /*eslint-disable*/

        return !CacheFactory.get('profileCache') ? CacheFactory('profileCache', {
            maxAge: 1 * 60 * 60 * 1000, // Items added to this cache expire after 1 hours
            cacheFlushInterval: 1 * 60 * 60 * 1000, // This cache will clear itself every 1 hours.
            deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will use `localStorage`.
        }) : CacheFactory.get('profileCache')

        /*eslint-enable*/

    })
