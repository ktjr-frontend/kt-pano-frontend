;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktErrorsCtrl', function($scope, $state, $location, ktUrlGet) {

            $scope.goHome = function() {
                $location.url(ktUrlGet('/', $.extend({ jump: 'true' }, $location.search())))
            }

        })

})();
