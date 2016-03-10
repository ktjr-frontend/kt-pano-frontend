;
(function() {
    'use strict';
    angular.module('kt.pano')
        .factory('ktApiCache', ['$cacheFactory', function($cacheFactory) {
            return $cacheFactory('ktApiCache');
        }]);
})();
