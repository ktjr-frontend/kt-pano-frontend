;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktErrorsCtrl', function($scope, $state, $location, ktUrlGet) {

            $scope.goHome = function() {
                $location.url(ktUrlGet('/', $location.search()))
            }

        })

})();
