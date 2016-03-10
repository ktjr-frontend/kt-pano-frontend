;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktErrorsCtrl', function($scope, $state, $location, ktUrlGet) {

            // $rootScope.user = $rootScope.user || angular.user || {}
            // var defaultRoute = '/' + ($.isEmptyObject($state.params) ? '' : ('?' + $.param($state.params)))
            $scope.goHome = function() {
                $location.url(ktUrlGet('/', $location.search()))
            }

        })

})();
