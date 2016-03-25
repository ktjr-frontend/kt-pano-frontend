;
(function() {
    'use strict';
    angular.module('kt.pano')
        .factory('ktApiCache', function($cacheFactory) {
            return $cacheFactory('ktApiCache');
        });
})();
